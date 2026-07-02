'use client';

import { AppShell } from '../../components/app-shell';
import { AuthFormPanel } from './components/auth-form-panel';
import { useAuthForm } from './hooks/use-auth-form';
import type { AuthFormMode } from './types';

type AuthFormProps = {
  mode: AuthFormMode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const authForm = useAuthForm(mode);

  return (
    <AppShell>
      <main
        className="relative grid min-h-[calc(100vh-64px)] place-items-center bg-cover bg-center px-5 py-16"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(9, 10, 15, 0.85), rgba(9, 10, 15, 0.72)), url('/images/concert-stage.png')",
        }}
      >
        <AuthFormPanel
          authError={authForm.authError}
          formError={authForm.formError}
          isLoading={authForm.isLoading}
          mode={mode}
          values={authForm.values}
          onSubmit={authForm.submit}
          onUpdateField={authForm.updateField}
        />
      </main>
    </AppShell>
  );
}
