import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import AuthScreen from './AuthScreen';

type AuthState = {
  session: Session | null;
  loading: boolean;
};

export default function AuthGate({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ session: null, loading: true });

  useEffect(() => {
    if (!supabase) {
      setAuth({ session: null, loading: false });
      return;
    }

    let alive = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (alive) setAuth({ session, loading: false });
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (!alive) return;
      if (error) console.error('Unable to restore Finora session:', error.message);
      setAuth({ session: data.session, loading: false });
    });

    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!isSupabaseConfigured || !supabase) {
    return <AuthScreen configurationRequired />;
  }

  if (auth.loading) {
    return <main className="auth-loading" aria-live="polite"><span className="auth-spinner" />Checking your secure session…</main>;
  }

  if (!auth.session) return <AuthScreen />;

  const signOut = async (event: FormEvent) => {
    event.preventDefault();
    const { error } = await supabase!.auth.signOut();
    if (error) console.error('Finora sign-out failed:', error.message);
  };

  return (
    <div className="authenticated-app">
      <div className="auth-session-bar">
        <span><span className="session-status-dot" /> Signed in as <b>{auth.session.user.email ?? 'Finora user'}</b></span>
        <form onSubmit={signOut}><button type="submit">Sign out</button></form>
      </div>
      {children}
    </div>
  );
}
