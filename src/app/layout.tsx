'use client';
import { useEffect } from 'react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider, useAuth } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { lato } from './fonts';
import { AuthProvider } from '@/context/AuthContext';

function AuthHandler({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  useEffect(() => {
    // Initiate anonymous sign-in as soon as the Auth service is available.
    if (auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [auth]);

  return <>{children}</>;
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${lato.variable}`}>
      <body>
        <AuthProvider>
          <FirebaseClientProvider>
            <AuthHandler>
              {children}
            </AuthHandler>
          </FirebaseClientProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
