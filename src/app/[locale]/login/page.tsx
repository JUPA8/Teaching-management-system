import { Suspense } from 'react';
import LoginContent from './LoginContent';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FDFBF7] to-white">
          <div className="w-10 h-10 border-2 border-[#2B7A78] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
