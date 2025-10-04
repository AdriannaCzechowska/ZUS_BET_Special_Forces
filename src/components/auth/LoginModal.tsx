'use client';

import { useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface LoginModalProps {
  setOpen: (open: boolean) => void;
}

export function LoginModal({ setOpen }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuthContext();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (login(username, password)) {
      toast({
        title: 'Zalogowano pomyślnie',
        description: 'Tryb administratora został włączony.',
      });
      setOpen(false);
    } else {
      setError('Nieprawidłowa nazwa użytkownika lub hasło.');
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="font-headline text-2xl">Logowanie do PUE/eZUS</DialogTitle>
        <DialogDescription>
          Wprowadź dane logowania, aby uzyskać dostęp do panelu administratora.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Nazwa użytkownika</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Hasło</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        <Button type="submit" className="w-full">
          Zaloguj
        </Button>
      </form>
    </DialogContent>
  );
}
