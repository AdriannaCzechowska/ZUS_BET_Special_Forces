'use client';
import { useEffect } from 'react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider, useAuth } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';

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
    <html lang="pl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <AuthHandler>
            {children}
          </AuthHandler>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
