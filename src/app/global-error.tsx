'use client';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
          <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="h-10 w-10" />
            </div>
            <h1 className="mb-3 text-2xl font-bold text-red-900">
              حدث خطأ غير متوقع
            </h1>
            <p className="mb-6 text-sm text-red-700">
              نعتذر عن الإزعاج. يرجى المحاولة مرة أخرى.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button onClick={reset}>
                <RefreshCw className="h-4 w-4" />
                إعادة المحاولة
              </Button>
              <Button
                onClick={() => (window.location.href = '/ar')}
                variant="outline"
              >
                <Home className="h-4 w-4" />
                الرئيسية
              </Button>
            </div>
            {error.digest && (
              <p className="mt-4 text-xs text-gray-400 font-mono">
                ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}