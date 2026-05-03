import LoginForm from './ui';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-xl font-semibold tracking-tight">Auréalis admin</h1>
        <p className="text-sm text-slate-400">
          Sign in with the password configured for this deployment (see <code className="text-amber-200/80">ADMIN_PASS_HASH</code> /{' '}
          <code className="text-amber-200/80">ADMIN_DEV_PASSWORD</code> in env). Optional: restrict by IP with{' '}
          <code className="text-amber-200/80">ADMIN_ALLOWED_IPS</code>.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
