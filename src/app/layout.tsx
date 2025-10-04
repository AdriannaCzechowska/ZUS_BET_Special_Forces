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
        {/* Removing custom Google Fonts to use Arial as per ZUS style */}
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
