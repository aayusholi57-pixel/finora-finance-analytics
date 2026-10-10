import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, LockKeyhole, Wallet } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Props = { configurationRequired?: boolean };

export default function AuthScreen({ configurationRequired = false }: Props) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setError('');
    if (!supabase) return;
    setBusy(true);
    try {
      if (mode === 'signup') {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { display_name: name.trim() } },
        });
        if (authError) throw authError;
        setMessage(data.session
          ? 'Your account is ready. You are now signed in.'
          : 'Account created. Check your email for the confirmation link before signing in.');
      } else if (mode === 'reset') {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin,
        });
        if (authError) throw authError;
        setMessage('If an account exists for that email, a password-reset link has been sent.');
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (authError) throw authError;
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-ambient auth-ambient-one" />
      <div className="auth-ambient auth-ambient-two" />
      <section className="auth-card">
        <a className="auth-brand" href="#" aria-label="Finora">
          <span className="auth-brand-mark"><Wallet size={22} /></span><span>finora<span>.</span></span>
        </a>
        <div className="auth-intro">
          <span className="auth-eyebrow"><LockKeyhole size={13} /> YOUR PRIVATE MONEY SPACE</span>
          <h1>{configurationRequired ? 'One quick setup step.' : mode === 'signup' ? 'Start fresh with Finora.' : mode === 'reset' ? 'Reset your password.' : 'Welcome back.'}</h1>
          <p>{configurationRequired
            ? 'Connect your Supabase project to enable secure account access.'
            : mode === 'signup' ? 'Create your account and build a clearer picture of your money.'
            : mode === 'reset' ? 'We’ll email you a secure link to reset your password.'
            : 'Sign in to continue to your personal finance workspace.'}</p>
        </div>

        {configurationRequired ? (
          <div className="auth-setup-message">
            <CheckCircle2 size={20} />
            <div><b>Supabase credentials are not configured</b><p>Copy <code>.env.example</code> to <code>.env</code> in the project root, then set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> using your project's public API values. Restart the Vite server afterward.</p></div>
          </div>
        ) : (
          <>
            <div className="auth-mode-switch" role="tablist" aria-label="Account action">
              <button type="button" role="tab" aria-selected={mode === 'signin'} className={mode === 'signin' ? 'selected' : ''} onClick={() => { setMode('signin'); setError(''); setMessage(''); }}>Sign in</button>
              <button type="button" role="tab" aria-selected={mode === 'signup'} className={mode === 'signup' ? 'selected' : ''} onClick={() => { setMode('signup'); setError(''); setMessage(''); }}>Create account</button>
            </div>
            <form className="auth-form" onSubmit={submit}>
              {mode === 'signup' && <label>Full name<input autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" maxLength={100} required /></label>}
              <label>Email address<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required /></label>
              {mode !== 'reset' && <label>Password<input type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'} minLength={mode === 'signup' ? 8 : 1} required /></label>}
              {mode === 'signin' && <button className="auth-forgot" type="button" onClick={() => { setMode('reset'); setError(''); setMessage(''); }}>Forgot password?</button>}
              {error && <p className="auth-alert auth-error" role="alert">{error}</p>}
              {message && <p className="auth-alert auth-success" role="status">{message}</p>}
              <button className="auth-submit" type="submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'signup' ? 'Create your account' : mode === 'reset' ? 'Send reset link' : 'Sign in securely'} <ArrowRight size={17} /></button>
              {mode === 'reset' && <button type="button" className="auth-back" onClick={() => { setMode('signin'); setError(''); setMessage(''); }}>Back to sign in</button>}
            </form>
          </>
        )}
        <div className="auth-foot"><LockKeyhole size={13} /><span>Your account is protected by Supabase authentication. Your financial data stays scoped to your user account by database policies.</span></div>
      </section>
      <footer className="auth-copyright">© 2026 Finora Finance <span>·</span> Understand your money. Own your future.</footer>
    </main>
  );
}
