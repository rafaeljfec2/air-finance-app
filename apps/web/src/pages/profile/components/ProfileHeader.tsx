interface ProfileHeaderProps {
  readonly userName?: string;
}

export function ProfileHeader({ userName }: ProfileHeaderProps) {
  return (
    <header className="mb-6 sm:mb-8">
      <p className="text-sm text-muted-foreground">Configurações</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-text dark:text-text-dark sm:text-3xl">
        {userName ? `Olá, ${userName.split(' ')[0]}` : 'Minha Conta'}
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">
        Gerencie perfil, preferências, assinatura e integrações em um só lugar.
      </p>
    </header>
  );
}
