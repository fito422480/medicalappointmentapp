'use client';

import { ReactNode } from 'react';
import { AuthProvider as _AuthProvider } from '@/hooks/use-auth';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <_AuthProvider>
        <>
          {children}
          <Toaster />
        </>
      </_AuthProvider>
    </ThemeProvider>
  );
}