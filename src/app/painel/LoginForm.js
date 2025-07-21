
'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage('Erro ao criar conta: ' + error.message);
    } else {
      setMessage('Conta criada com sucesso! Agora você pode tentar entrar.');
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage('Erro ao entrar: ' + error.message);
    } else {
      router.refresh(); // Atualiza a página. Como agora estará logado, verá o painel.
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Acesso ao Painel</h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="email-input" className="sr-only">Email</label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="password-input" className="sr-only">Senha</label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          {message && <p className="text-sm text-center text-red-500">{message}</p>}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleSignIn}
              className="w-full px-4 py-2 font-bold text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
            >
              Entrar
            </button>
            <button
              onClick={handleSignUp}
              className="w-full px-4 py-2 text-sm text-gray-600 hover:underline"
            >
              Criar conta (primeiro acesso)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}