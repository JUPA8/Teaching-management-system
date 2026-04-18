// Shared password + email validation — used by both frontend and API routes

// ─── Password rules ───────────────────────────────────────────────────────────

export interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (p) => p.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'At least 1 uppercase letter (A–Z)',
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: 'lowercase',
    label: 'At least 1 lowercase letter (a–z)',
    test: (p) => /[a-z]/.test(p),
  },
  {
    id: 'number',
    label: 'At least 1 number (0–9)',
    test: (p) => /[0-9]/.test(p),
  },
  {
    id: 'special',
    label: 'At least 1 special character (!@#$%^&*…)',
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

// Most common passwords to reject
const COMMON_PASSWORDS = new Set([
  'password', 'password1', 'password123', 'Password1', 'Password123',
  'qwerty', 'qwerty123', 'Qwerty123', '12345678', '123456789',
  '1234567890', 'iloveyou', 'admin123', 'letmein', 'welcome1',
  'monkey123', 'dragon123', 'master123', 'sunshine', 'princess',
  'football', 'abc12345', 'passw0rd', 'Passw0rd',
]);

export interface PasswordValidationResult {
  isValid: boolean;
  failedRules: string[];           // rule ids that failed
  isCommon: boolean;
  strength: 'weak' | 'fair' | 'strong' | 'very-strong';
}

export function validatePassword(password: string): PasswordValidationResult {
  const failedRules = PASSWORD_RULES
    .filter((rule) => !rule.test(password))
    .map((rule) => rule.id);

  const isCommon = COMMON_PASSWORDS.has(password);
  const passedCount = PASSWORD_RULES.length - failedRules.length;

  let strength: PasswordValidationResult['strength'];
  if (passedCount <= 1) strength = 'weak';
  else if (passedCount <= 2) strength = 'fair';
  else if (passedCount <= 3) strength = 'strong';
  else strength = 'very-strong';

  const isValid = failedRules.length === 0 && !isCommon;

  return { isValid, failedRules, isCommon, strength };
}

// ─── Email validation ─────────────────────────────────────────────────────────

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  // RFC-5322-ish — strict enough for production
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(
    email.trim()
  );
}

// ─── Strength visual helpers ──────────────────────────────────────────────────

export const STRENGTH_CONFIG = {
  'weak':       { label: 'Weak',        color: 'bg-red-500',    width: 'w-1/4',  textColor: 'text-red-600' },
  'fair':       { label: 'Fair',        color: 'bg-orange-400', width: 'w-2/4',  textColor: 'text-orange-600' },
  'strong':     { label: 'Strong',      color: 'bg-yellow-400', width: 'w-3/4',  textColor: 'text-yellow-600' },
  'very-strong':{ label: 'Very strong', color: 'bg-green-500',  width: 'w-full', textColor: 'text-green-600' },
} as const;
