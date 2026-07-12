import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Building2,
  Camera,
  CheckCircle2,
  CreditCard,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  Shield,
  User,
  X,
} from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { formatPlanDisplayName } from '@/utils/planAdminDisplay';

import { ProfilePersonalSchema, type ProfilePersonalFormValues } from '../schemas';

import { InfoRow, ProfileSectionCard } from './ProfileSectionCard';

interface AccountMeta {
  readonly plan?: string;
  readonly role?: string;
  readonly emailVerified?: boolean;
  readonly companyCount?: number;
  readonly memberSince?: string;
}

interface ProfilePersonalSectionProps {
  readonly formData: ProfilePersonalFormValues;
  readonly avatar: string;
  readonly accountMeta: AccountMeta;
  readonly isEditing: boolean;
  readonly isSaving: boolean;
  readonly onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly onSave: (values: ProfilePersonalFormValues) => void | Promise<void>;
  readonly onCancel: () => void;
  readonly onStartEditing: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  god: 'God',
  sys_admin: 'Sys Admin',
  admin: 'Admin',
  owner: 'Owner',
  editor: 'Editor',
  operator: 'Operador',
  viewer: 'Visualizador',
  user: 'Usuário',
};

function AvatarBlock({
  avatar,
  name,
  isEditing,
  onAvatarChange,
}: Readonly<{
  avatar: string;
  name: string;
  isEditing: boolean;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}>) {
  const hasAvatar = Boolean(avatar) && avatar !== '/avatars/default.png';

  return (
    <div className="relative mx-auto h-24 w-24 sm:mx-0 sm:h-28 sm:w-28">
      {hasAvatar ? (
        <img
          src={avatar}
          alt={name.trim().length > 0 ? name : 'Avatar'}
          className="h-full w-full rounded-full border-2 border-border object-cover dark:border-border-dark"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== '/avatars/default.png') {
              target.src = '/avatars/default.png';
            }
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-border bg-primary-100 dark:border-border-dark dark:bg-primary-900/30">
          <User className="h-12 w-12 text-primary-600 dark:text-primary-400" />
        </div>
      )}
      {isEditing ? (
        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary-500 text-white shadow-md transition-colors hover:bg-primary-600"
          title="Alterar foto"
        >
          <Camera className="h-4 w-4" />
        </label>
      ) : null}
      <input
        type="file"
        id="avatar-upload"
        className="hidden"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={onAvatarChange}
        disabled={!isEditing}
      />
    </div>
  );
}

export function ProfilePersonalSection({
  formData,
  avatar,
  accountMeta,
  isEditing,
  isSaving,
  onAvatarChange,
  onSave,
  onCancel,
  onStartEditing,
}: ProfilePersonalSectionProps) {
  const form = useForm<ProfilePersonalFormValues>({
    resolver: zodResolver(ProfilePersonalSchema),
    defaultValues: formData,
  });

  useEffect(() => {
    form.reset(formData);
  }, [formData, form]);

  const watchedName = form.watch('name');
  const displayName = watchedName.trim().length > 0 ? watchedName : formData.name;
  const planLabel = formatPlanDisplayName(accountMeta.plan ?? 'free');
  const roleLabel = ROLE_LABELS[accountMeta.role ?? 'user'] ?? accountMeta.role ?? 'Usuário';
  const memberSince = accountMeta.memberSince
    ? format(new Date(accountMeta.memberSince), "MMM 'de' yyyy", { locale: ptBR })
    : null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <ProfileSectionCard
        title="Perfil"
        description={
          isEditing
            ? 'Altere seus dados e salve quando terminar'
            : 'Como você aparece na plataforma'
        }
        icon={<User className="h-4 w-4 text-primary-500 dark:text-primary-400" aria-hidden />}
        action={
          isEditing ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset(formData);
                  onCancel();
                }}
                disabled={isSaving}
                className="min-h-[44px] gap-2"
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
              <Button
                type="button"
                variant="success"
                onClick={form.handleSubmit((values) => onSave(values))}
                disabled={isSaving}
                className="min-h-[44px] gap-2"
              >
                {isSaving ? <Spinner size="sm" /> : <Save className="h-4 w-4" />}
                Salvar
              </Button>
            </>
          ) : (
            <Button
              type="button"
              onClick={onStartEditing}
              className="min-h-[44px] gap-2 bg-primary-500 font-semibold text-white hover:bg-primary-600 dark:bg-primary-400 dark:text-background dark:hover:bg-primary-500"
            >
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
          )
        }
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <div className="flex flex-col items-center gap-3 text-center lg:w-52 lg:items-start lg:text-left">
            <AvatarBlock
              avatar={avatar}
              name={displayName}
              isEditing={isEditing}
              onAvatarChange={onAvatarChange}
            />
            <div className="min-w-0 space-y-1">
              <p className="truncate text-lg font-semibold text-text dark:text-text-dark">
                {displayName.trim().length > 0 ? displayName : 'Seu nome'}
              </p>
              <p className="truncate text-sm text-muted-foreground">{formData.email}</p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-1 lg:justify-start">
                <Badge variant="secondary" className="text-[11px]">
                  {planLabel}
                </Badge>
                {accountMeta.emailVerified ? (
                  <Badge variant="success" className="gap-1 text-[11px]">
                    <CheckCircle2 className="h-3 w-3" />
                    Email verificado
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="text-[11px] text-amber-700 dark:text-amber-300"
                  >
                    Email pendente
                  </Badge>
                )}
              </div>
              {isEditing ? (
                <p className="pt-2 text-xs text-muted-foreground">
                  JPEG, PNG, WebP ou GIF · máx. 500 KB
                </p>
              ) : null}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            {isEditing ? (
              <form className="space-y-4" onSubmit={form.handleSubmit((values) => onSave(values))}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1.5 block text-sm font-medium text-text dark:text-text-dark"
                    >
                      Nome completo
                    </label>
                    <Input
                      id="name"
                      type="text"
                      className="border-border bg-background text-text dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
                      {...form.register('name')}
                    />
                    {form.formState.errors.name ? (
                      <p className="mt-1 text-sm text-red-500" role="alert">
                        {form.formState.errors.name.message}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium text-text dark:text-text-dark"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      className="border-border bg-background text-text dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
                      {...form.register('email')}
                    />
                    {form.formState.errors.email ? (
                      <p className="mt-1 text-sm text-red-500" role="alert">
                        {form.formState.errors.email.message}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1.5 block text-sm font-medium text-text dark:text-text-dark"
                    >
                      Telefone
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      className="border-border bg-background text-text dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
                      {...form.register('phone')}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="location"
                      className="mb-1.5 block text-sm font-medium text-text dark:text-text-dark"
                    >
                      Localização
                    </label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="Cidade, UF"
                      className="border-border bg-background text-text dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
                      {...form.register('location')}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="bio"
                    className="mb-1.5 block text-sm font-medium text-text dark:text-text-dark"
                  >
                    Sobre você
                  </label>
                  <Textarea
                    id="bio"
                    rows={3}
                    placeholder="Uma breve descrição (opcional)"
                    className="border-border bg-background text-text dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
                    {...form.register('bio')}
                  />
                  {form.formState.errors.bio ? (
                    <p className="mt-1 text-sm text-red-500" role="alert">
                      {form.formState.errors.bio.message}
                    </p>
                  ) : null}
                </div>
              </form>
            ) : (
              <div>
                <InfoRow label="Nome" value={formData.name} icon={<User className="h-4 w-4" />} />
                <InfoRow label="Email" value={formData.email} icon={<Mail className="h-4 w-4" />} />
                <InfoRow
                  label="Telefone"
                  value={formData.phone ?? ''}
                  icon={<Phone className="h-4 w-4" />}
                />
                <InfoRow
                  label="Localização"
                  value={formData.location ?? ''}
                  icon={<MapPin className="h-4 w-4" />}
                />
                <InfoRow
                  label="Sobre você"
                  value={formData.bio ?? ''}
                  emptyLabel="Nenhuma bio cadastrada"
                  icon={<Pencil className="h-4 w-4" />}
                />
              </div>
            )}
          </div>
        </div>
      </ProfileSectionCard>

      <ProfileSectionCard
        title="Resumo da conta"
        description="Informações da sua assinatura e acesso"
        icon={<Shield className="h-4 w-4 text-primary-500 dark:text-primary-400" aria-hidden />}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-background/60 p-4 dark:border-border-dark dark:bg-background-dark/40">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-xs text-muted-foreground">Plano</p>
            <p className="mt-0.5 text-sm font-semibold text-text dark:text-text-dark">
              {planLabel}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background/60 p-4 dark:border-border-dark dark:bg-background-dark/40">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
              <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-xs text-muted-foreground">Função</p>
            <p className="mt-0.5 text-sm font-semibold text-text dark:text-text-dark">
              {roleLabel}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background/60 p-4 dark:border-border-dark dark:bg-background-dark/40">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
              <Building2 className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            </div>
            <p className="text-xs text-muted-foreground">Empresas</p>
            <p className="mt-0.5 text-sm font-semibold text-text dark:text-text-dark">
              {accountMeta.companyCount ?? 0}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background/60 p-4 dark:border-border-dark dark:bg-background-dark/40">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
              <User className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-xs text-muted-foreground">Membro desde</p>
            <p className="mt-0.5 text-sm font-semibold capitalize text-text dark:text-text-dark">
              {memberSince ?? '—'}
            </p>
          </div>
        </div>
      </ProfileSectionCard>
    </div>
  );
}
