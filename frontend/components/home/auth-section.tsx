import type { HomePageLabels } from '../../lib/home/constants';

type AuthSectionProps = {
  labels: Pick<
    HomePageLabels,
    | 'authTitle'
    | 'emailLabel'
    | 'passwordLabel'
    | 'signUpButton'
    | 'signInButton'
    | 'signOutButton'
    | 'emailPlaceholder'
    | 'passwordPlaceholder'
  >;
  email: string;
  password: string;
  loading: boolean;
  isAuthed: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSignUp: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
};

export function AuthSection(props: AuthSectionProps) {
  const {
    labels,
    email,
    password,
    loading,
    isAuthed,
    onEmailChange,
    onPasswordChange,
    onSignUp,
    onSignIn,
    onSignOut,
  } = props;

  const isCredentialReady = email.length > 0 && password.length > 0;

  return (
    <section className='space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
      <h2 className='text-sm font-semibold text-slate-700'>{labels.authTitle}</h2>

      <div className='space-y-3'>
        <div className='space-y-1'>
          <label htmlFor='email-input' className='text-xs font-medium text-slate-600'>
            {labels.emailLabel}
          </label>
          <input
            id='email-input'
            className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm'
            placeholder={labels.emailPlaceholder}
            autoComplete='email'
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
          />
        </div>

        <div className='space-y-1'>
          <label htmlFor='password-input' className='text-xs font-medium text-slate-600'>
            {labels.passwordLabel}
          </label>
          <input
            id='password-input'
            className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm'
            placeholder={labels.passwordPlaceholder}
            type='password'
            autoComplete='current-password'
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
          />
        </div>
      </div>

      <div className='grid grid-cols-3 gap-2'>
        <button
          className='rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60'
          onClick={onSignUp}
          disabled={loading || !isCredentialReady}
          type='button'
        >
          {labels.signUpButton}
        </button>
        <button
          className='rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white disabled:opacity-60'
          onClick={onSignIn}
          disabled={loading || !isCredentialReady}
          type='button'
        >
          {labels.signInButton}
        </button>
        <button
          className='rounded-lg bg-slate-500 px-3 py-2 text-sm font-medium text-white disabled:opacity-60'
          onClick={onSignOut}
          disabled={loading || !isAuthed}
          type='button'
        >
          {labels.signOutButton}
        </button>
      </div>
    </section>
  );
}
