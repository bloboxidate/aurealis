import LoginForm from './ui';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-xl font-semibold tracking-tight">Auréalis admin</h1>
        <p className="text-sm text-slate-400">Sign in with the credentials configured in environment variables. This app is bound to port 3001 and must not be exposed publicly without VPN or IP allowlist.</p>
        <LoginForm />
      </div>
    </div>
  );
}
