type SignupMessageKey =
  | 'error_user_exists'
  | 'error_rate_limit'
  | 'error_signup_password'
  | 'error_signup_invalid_email'
  | 'error_signup_failed';

type LoginMessageKey = 'error_invalid_credentials' | 'error_rate_limit' | 'error_login_failed';

function pickCode(err: unknown): string {
  if (!err || typeof err !== 'object') return '';
  const o = err as { code?: unknown; name?: unknown };
  if (typeof o.code === 'string' && o.code.length > 0) return o.code;
  if (typeof o.name === 'string' && o.name.length > 0) return o.name;
  return '';
}

function pickStatus(err: unknown): number | undefined {
  if (!err || typeof err !== 'object') return undefined;
  const s = (err as { status?: unknown }).status;
  return typeof s === 'number' ? s : undefined;
}

export function signupErrorMessageKey(err: unknown): SignupMessageKey {
  const code = pickCode(err).toLowerCase();
  const status = pickStatus(err);

  if (status === 429) return 'error_rate_limit';

  switch (code) {
    case 'user_already_exists':
    case 'email_address_not_authorized':
      return 'error_user_exists';
    case 'over_email_send_rate_limit':
    case 'email_rate_limit_exceeded':
    case 'too_many_requests':
      return 'error_rate_limit';
    case 'weak_password':
      return 'error_signup_password';
    case 'email_address_invalid':
    case 'invalid_email':
    case 'invalid_credentials':
      return 'error_signup_invalid_email';
    case 'signup_disabled':
    default:
      return 'error_signup_failed';
  }
}

const LOGIN_INVALID_CREDS_CODES = new Set([
  'invalid_credentials',
  'user_not_found',
  'email_not_confirmed',
  'invalid_grant',
  'invalid_login_credentials',
]);

export function loginErrorMessageKey(err: unknown): LoginMessageKey {
  const code = pickCode(err).toLowerCase();
  const status = pickStatus(err);
  if (status === 429) return 'error_rate_limit';
  if (status != null && status >= 500) return 'error_login_failed';
  if (LOGIN_INVALID_CREDS_CODES.has(code)) return 'error_invalid_credentials';
  if (status === 400 || status === 401) return 'error_invalid_credentials';
  return 'error_login_failed';
}
