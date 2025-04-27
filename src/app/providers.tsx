'use client';

import { ReactNode } from 'react';
import AuthProvider from '@/hooks/use-auth';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        <>
          {children}
          <Toaster />
        </>
      </AuthProvider>
    </ThemeProvider>
  );
}