# Autenticacao e Gerenciamento de Sessao - Guia de Implementacao

> Documento tecnico para portar o sistema de autenticacao com tokens, cookies HttpOnly e persistencia de sessao.

---

## Indice

1. [Visao Geral da Arquitetura](#1-visao-geral-da-arquitetura)
2. [Backend - NestJS](#2-backend---nestjs)
3. [Frontend - React](#3-frontend---react)
4. [Fluxos Detalhados](#4-fluxos-detalhados)
5. [Configuracoes de Seguranca](#5-configuracoes-de-seguranca)
6. [Checklist de Implementacao](#6-checklist-de-implementacao)

---

## 1. Visao Geral da Arquitetura

### Estrategia Dual: Cookies HttpOnly + Bearer Token

O sistema usa uma abordagem hibrida onde os tokens sao entregues via **cookies HttpOnly** (principal) e opcionalmente via **header Authorization** (fallback/compatibilidade).

```
┌─────────────────┐     POST /auth/login      ┌──────────────────────┐
│                  │ ─────────────────────────> │                      │
│    Frontend      │                            │      Backend         │
│    (React)       │ <───────────────────────── │      (NestJS)        │
│                  │   Set-Cookie: access_token  │                      │
│                  │   Set-Cookie: refresh_token │                      │
└────────┬────────┘                            └──────────┬───────────┘
         │                                                │
         │  GET /api/resource                             │
         │  Cookie: access_token=xxx; refresh_token=yyy   │
         │ ──────────────────────────────────────────────> │
         │                                                │
         │  401 Unauthorized (token expirado)             │
         │ <────────────────────────────────────────────── │
         │                                                │
         │  POST /auth/refresh-token                      │
         │  Cookie: refresh_token=yyy                     │
         │ ──────────────────────────────────────────────> │
         │                                                │
         │  Set-Cookie: access_token=NOVO                 │
         │  Set-Cookie: refresh_token=NOVO                │
         │ <────────────────────────────────────────────── │
         │                                                │
         │  Retry: GET /api/resource (cookie novo)        │
         │ ──────────────────────────────────────────────> │
```

### Tokens

| Token | Tipo | Duracao | Armazenamento |
|-------|------|---------|---------------|
| Access Token | JWT (HS256) | 24 horas | Cookie HttpOnly + localStorage (fallback) |
| Refresh Token | Random hex (80 chars) | 7 dias | Cookie HttpOnly + MongoDB |

---

## 2. Backend - NestJS

### 2.1 Dependencias Necessarias

```bash
npm install @nestjs/passport @nestjs/jwt passport passport-jwt passport-local cookie-parser
npm install -D @types/passport-jwt @types/passport-local @types/cookie-parser
```

### 2.2 Configuracao do Modulo Auth

```typescript
// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    // MongooseModule.forFeature([...]) para RefreshToken schema
  ],
  providers: [
    AuthService,
    JwtStrategy,      // Validacao do JWT
    LocalStrategy,    // Login email/senha
    RefreshTokenService,
  ],
})
export class AuthModule {}
```

### 2.3 Configuracao do cookie-parser e CORS

```typescript
// main.ts
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // OBRIGATORIO: parseia cookies de cada request
  app.use(cookieParser());

  // OBRIGATORIO: credentials: true para cookies cross-origin
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
  });

  await app.listen(3000);
}
```

### 2.4 Definicao dos Cookies no Controller

Este e o ponto central - como os cookies sao configurados na resposta HTTP:

```typescript
// auth.controller.ts
import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  // ===== LOGIN =====
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);
    this.setAuthCookies(res, result);
    // NAO retorna tokens no JSON - eles vao nos cookies
    return { user: result.user };
  }

  // ===== REFRESH TOKEN =====
  @Post('refresh-token')
  async refreshToken(
    @Body('refreshToken') refreshTokenBody: string | undefined,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Prioridade: cookie > body (para compatibilidade)
    const refreshToken = req.cookies?.refresh_token ?? refreshTokenBody;
    const result = await this.authService.refreshToken(refreshToken);
    this.setAuthCookies(res, result);
    return { message: 'Tokens refreshed successfully' };
  }

  // ===== LOGOUT =====
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
    return { message: 'Logged out successfully' };
  }

  // ===== GET CURRENT USER (para auto-login) =====
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request) {
    return req.user;
  }

  // ===== CONFIGURACAO DOS COOKIES =====
  private setAuthCookies(res: Response, result: LoginResponse) {
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('access_token', result.token, {
      httpOnly: true,     // JS nao pode ler (protege contra XSS)
      secure: isProduction, // HTTPS only em producao
      sameSite: 'lax',    // Protege contra CSRF basico
      maxAge: 24 * 60 * 60 * 1000, // 24 horas em ms
      path: '/',
    });

    if (result.refreshToken) {
      res.cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias em ms
        path: '/',
      });
    }
  }
}
```

### 2.5 JWT Strategy - Extracao do Token

A strategy define de ONDE o token e lido. A prioridade e: Cookie > Header > Query.

```typescript
// jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

const cookieExtractor = (req: Request): string | null => {
  // 1. Tenta cookie HttpOnly (principal)
  if (req?.cookies?.access_token) {
    return req.cookies.access_token;
  }

  // 2. Fallback: header Authorization: Bearer xxx
  const tokenFromHeader = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  if (tokenFromHeader) {
    return tokenFromHeader;
  }

  // 3. Fallback: query string ?token=xxx (para SSE/EventSource)
  const tokenFromQuery = req.query?.token as string | undefined;
  if (tokenFromQuery) {
    return tokenFromQuery;
  }

  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    const user = await this.userService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user; // Disponivel em req.user
  }
}
```

### 2.6 Refresh Token Service

O refresh token e um valor opaco (nao JWT) armazenado no banco. E rotacionado a cada uso.

```typescript
// refresh-token.service.ts
import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>,
  ) {}

  async generateRefreshToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(40).toString('hex'); // 80 chars
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenModel.create({
      userId,
      token,
      expiresAt,
    });

    return token;
  }

  async validateRefreshToken(token: string): Promise<boolean> {
    const record = await this.refreshTokenModel.findOne({
      token,
      revoked: false,
      expiresAt: { $gt: new Date() },
    });
    return !!record;
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await this.refreshTokenModel.updateOne(
      { token },
      { revoked: true, revokedAt: new Date() },
    );
  }
}
```

### 2.7 Auth Service - Login e Refresh

```typescript
// auth.service.ts (partes relevantes)
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async login(user: UserDocument): Promise<LoginResponse> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    const refreshToken = await this.refreshTokenService.generateRefreshToken(user.id);

    return {
      user: { id: user.id, name: user.name, email: user.email, /* ... */ },
      token,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const isValid = await this.refreshTokenService.validateRefreshToken(refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const record = await this.refreshTokenService.getRefreshToken(refreshToken);
    const user = await this.userService.findOne(record.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Rotaciona: revoga o antigo, gera novos tokens
    await this.refreshTokenService.revokeRefreshToken(refreshToken);
    return this.login(user);
  }
}
```

---

## 3. Frontend - React

### 3.1 Dependencias Necessarias

```bash
npm install axios @tanstack/react-query zustand
```

### 3.2 API Client com Interceptors

Este e o nucleo do sistema no frontend - o axios configurado com refresh automatico:

```typescript
// services/apiClient.ts
import axios, { type InternalAxiosRequestConfig, type AxiosError } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;
const REFRESH_URL = '/auth/refresh-token';

// ===== CLIENTE PRINCIPAL =====
export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // OBRIGATORIO: envia cookies em toda requisicao
});

// ===== CLIENTE DE REFRESH (separado para evitar loop no interceptor) =====
const refreshClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ===== FILA DE REQUISICOES DURANTE REFRESH =====
let isRefreshing = false;
type QueueItem = {
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
};
let failedQueue: QueueItem[] = [];

function processQueue(error: Error | null) {
  for (const item of failedQueue) {
    if (error) {
      item.reject(error);
    } else {
      item.resolve(undefined);
    }
  }
  failedQueue = [];
}

// ===== INTERCEPTOR DE REQUEST: adiciona Bearer token (fallback) =====
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Os cookies sao enviados automaticamente pelo withCredentials.
  // O Bearer token e um fallback para cenarios sem cookie (ex: mobile).
  const token = getTokenFromStorage();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== INTERCEPTOR DE RESPONSE: refresh automatico em 401 =====
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Se o proprio refresh falhou, desiste
    if (originalRequest.url?.includes(REFRESH_URL)) {
      redirectToLogin();
      return Promise.reject(error);
    }

    // Se ja tentou retry, desiste
    if (originalRequest._retry) {
      redirectToLogin();
      return Promise.reject(error);
    }

    // Se ja esta fazendo refresh, enfileira a requisicao
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => apiClient(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Chama refresh - o cookie refresh_token vai automaticamente
      await refreshClient.post(REFRESH_URL);

      // Sucesso: novos cookies foram definidos pelo backend
      processQueue(null);
      return apiClient(originalRequest); // Re-executa a request original
    } catch (refreshError) {
      processQueue(new Error('Refresh failed'));
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

function redirectToLogin() {
  // Limpa stores e redireciona
  localStorage.removeItem('auth-storage');
  globalThis.location.href = '/login';
}

function getTokenFromStorage(): string | null {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.state?.token ?? null;
  } catch {
    return null;
  }
}
```

### 3.3 Auth Store (Zustand + Persist)

```typescript
// stores/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly emailVerified: boolean;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user) => set({
        user,
        isAuthenticated: !!user,
      }),

      setToken: (token) => set({ token }),

      clearAuth: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
      }),
    }),
    {
      name: 'auth-storage', // Chave no localStorage
      onRehydrateStorage: () => (state) => {
        // Ao recarregar a pagina, re-valida o estado
        if (state) {
          state.isAuthenticated = !!state.user;
        }
      },
    },
  ),
);
```

### 3.4 Auth Service

```typescript
// services/authService.ts
import { apiClient } from './apiClient';

interface LoginParams {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    emailVerified: boolean;
  };
  // Tokens NAO vem no JSON - vem nos cookies Set-Cookie
}

export async function login(params: LoginParams): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', params);
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function getCurrentUser(): Promise<LoginResponse['user']> {
  const { data } = await apiClient.get('/auth/me');
  return data;
}

export async function refreshToken(): Promise<void> {
  await apiClient.post('/auth/refresh-token');
}
```

### 3.5 Hook useAuth - Auto-Login e Persistencia

```typescript
// hooks/useAuth.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { login, logout, getCurrentUser } from '@/services/authService';

export function useAuth() {
  const queryClient = useQueryClient();
  const { user: storedUser, setUser, setToken, clearAuth } = useAuthStore();

  // ===== AUTO-LOGIN: roda ao montar o componente =====
  // Se existem cookies validos, GET /auth/me retorna o user
  // Se nao, retorna 401 e o interceptor tenta refresh
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 0,         // Sempre verifica se a sessao e valida
    gcTime: 10 * 60_000,  // Mantém cache por 10 min
    enabled: true,         // Sempre ativo - cookies sao enviados automaticamente
  });

  // Sincroniza o user do React Query com o Zustand store
  if (user && user.id !== storedUser?.id) {
    setUser(user);
  }

  // ===== LOGIN =====
  const loginMutation = useMutation({
    mutationFn: async ({ email, password, rememberMe }: {
      email: string;
      password: string;
      rememberMe?: boolean;
    }) => {
      const result = await login({ email, password });
      return { ...result, rememberMe };
    },
    onSuccess: (data) => {
      setUser(data.user);
      // Token ja esta nos cookies; armazena no store como fallback
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  // ===== LOGOUT =====
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
      queryClient.removeQueries({ queryKey: ['user'] });
      // Limpa outros stores se necessario
      globalThis.location.href = '/login';
    },
  });

  return {
    user: user ?? storedUser,
    isAuthenticated: !!(user ?? storedUser),
    isLoading,
    error,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
```

### 3.6 Rota Protegida

```typescript
// components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function ProtectedRoute({ children }: { readonly children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

### 3.7 "Remember Me" - Como Funciona

A diferenca entre "lembrar" e "nao lembrar" e onde o token fallback e armazenado:

```typescript
// utils/auth.ts
const TOKEN_KEY = '@Auth:token';
const REFRESH_TOKEN_KEY = '@Auth:refreshToken';

function getStorage(persistent: boolean): Storage {
  return persistent ? localStorage : sessionStorage;
}

export const authUtils = {
  setToken(token: string, persistent: boolean): void {
    getStorage(persistent).setItem(TOKEN_KEY, token);
  },
  setRefreshToken(token: string, persistent: boolean): void {
    getStorage(persistent).setItem(REFRESH_TOKEN_KEY, token);
  },
  clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
```

| Remember Me | Armazenamento Local | Cookies | Comportamento |
|-------------|---------------------|---------|---------------|
| `true` | localStorage (persiste) | Sim (maxAge 24h/7d) | Sessao sobrevive ao fechar browser |
| `false` | sessionStorage (temporario) | Sim (maxAge 24h/7d) | Token local morre ao fechar aba, mas cookies persistem |

**Na pratica:** como os cookies tem `maxAge` fixo, a sessao persiste independente do "Remember Me" enquanto os cookies forem validos. O "Remember Me" controla apenas o fallback do Bearer token no localStorage/sessionStorage.

---

## 4. Fluxos Detalhados

### 4.1 Login com Senha

```
1. Usuario digita email/senha e clica "Entrar"
2. Frontend: POST /auth/login { email, password }
3. Backend:
   a. Valida credenciais (bcrypt compare)
   b. Gera JWT (access_token, 24h)
   c. Gera refresh token (random hex, 7 dias, salva no DB)
   d. Define cookies: Set-Cookie: access_token=JWT; Set-Cookie: refresh_token=xxx
   e. Retorna JSON: { user: { id, name, email, ... } }
4. Frontend:
   a. Recebe o user no JSON
   b. Cookies sao armazenados pelo browser automaticamente
   c. Atualiza Zustand store com o user
   d. Redireciona para dashboard
```

### 4.2 Auto-Login ao Reabrir o Site

```
1. Usuario abre o site (browser tem cookies do login anterior)
2. Frontend:
   a. Zustand re-hidrata de localStorage (user + token antigos)
   b. useAuth() dispara GET /auth/me
   c. Browser envia Cookie: access_token=JWT automaticamente
3. Backend:
   a. JwtStrategy extrai token do cookie
   b. Valida JWT (nao expirado, assinatura valida)
   c. Busca user no DB
   d. Retorna user
4. Frontend:
   a. React Query recebe o user
   b. Atualiza o store
   c. Usuario esta logado sem digitar senha
```

### 4.3 Token Expirado + Refresh Automatico

```
1. Usuario faz uma requisicao (ex: GET /accounts)
2. Browser envia cookies automaticamente
3. Backend: JWT expirado -> retorna 401
4. Frontend (interceptor):
   a. Detecta 401
   b. Define isRefreshing = true
   c. Enfileira outras requisicoes que falham com 401
   d. POST /auth/refresh-token (cookie refresh_token vai automaticamente)
5. Backend:
   a. Le refresh_token do cookie
   b. Valida no DB (nao revogado, nao expirado)
   c. Revoga o token antigo (rotacao)
   d. Gera novo JWT + novo refresh token
   e. Define novos cookies
   f. Retorna 200
6. Frontend:
   a. Sucesso: re-executa a request original (GET /accounts)
   b. Processa fila de requests enfileiradas
   c. Usuario nunca percebe que o token expirou
```

### 4.4 Logout

```
1. Usuario clica "Sair"
2. Frontend: POST /auth/logout
3. Backend:
   a. Limpa cookies: clearCookie('access_token'), clearCookie('refresh_token')
   b. Retorna 200
4. Frontend:
   a. Limpa Zustand store
   b. Limpa React Query cache
   c. Limpa localStorage/sessionStorage
   d. Redireciona para /login
```

---

## 5. Configuracoes de Seguranca

### 5.1 Propriedades dos Cookies

| Propriedade | Valor | Motivo |
|-------------|-------|--------|
| `httpOnly` | `true` | JavaScript nao pode ler o cookie (previne XSS) |
| `secure` | `true` em prod | Cookie so e enviado via HTTPS |
| `sameSite` | `'lax'` | Previne CSRF em requests POST cross-origin |
| `path` | `'/'` | Cookie disponivel em todas as rotas |
| `maxAge` | 24h / 7d | Tempo de vida do cookie no browser |

### 5.2 CORS

```typescript
// Backend - main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL,  // NAO use '*' com credentials
  credentials: true,                  // Permite cookies cross-origin
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
});
```

```typescript
// Frontend - axios
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,  // Envia cookies em toda request
});
```

### 5.3 Refresh Token Rotation

Cada refresh token e **single-use**: ao ser usado, e revogado no banco e um novo e gerado. Isso limita o impacto de um token vazado.

### 5.4 Protecao contra Replay

O fallback de query string (`?token=xxx`) existe para Server-Sent Events (SSE), onde o browser nao envia cookies na conexao `EventSource`. Use tokens de curta duracao (1h) para SSE.

---

## 6. Checklist de Implementacao

### Backend

- [ ] Instalar `cookie-parser` e configurar no `main.ts`
- [ ] Configurar CORS com `credentials: true`
- [ ] Criar `JwtStrategy` com `cookieExtractor` (cookie > header > query)
- [ ] Criar `JwtAuthGuard` usando Passport
- [ ] Criar `RefreshTokenService` com geracao, validacao e revogacao
- [ ] Criar schema `RefreshToken` no banco (userId, token, expiresAt, revoked)
- [ ] Endpoint `POST /auth/login` - valida credenciais, define cookies
- [ ] Endpoint `POST /auth/refresh-token` - le cookie, rotaciona tokens
- [ ] Endpoint `POST /auth/logout` - limpa cookies
- [ ] Endpoint `GET /auth/me` - retorna user autenticado (guard JWT)
- [ ] Metodo `setAuthCookies()` - httpOnly, secure, sameSite, maxAge
- [ ] Variavel `JWT_SECRET` em `.env` (nunca hardcoded)

### Frontend

- [ ] Axios com `withCredentials: true`
- [ ] Interceptor de request para Bearer token (fallback)
- [ ] Interceptor de response para refresh automatico em 401
- [ ] Fila de requests durante refresh (evita requests paralelas falhando)
- [ ] Cliente separado para refresh (evita loop no interceptor)
- [ ] Zustand store com `persist` para re-hidratacao
- [ ] Hook `useAuth` com React Query para `GET /auth/me`
- [ ] Componente `ProtectedRoute` para rotas autenticadas
- [ ] Logica de "Remember Me" (localStorage vs sessionStorage)
- [ ] Limpeza completa no logout (stores, cache, redirect)
