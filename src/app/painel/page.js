import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import LoginForm from './LoginForm.js';

// Função para buscar os dados do usuário logado
async function getUser() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user;
}

// Um componente simples para os botões do menu
function MenuButton({ href, title, description }) {
    return (
        <Link href={href} className="block p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 transition-colors text-center">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="mt-2 text-sm text-gray-500">{description}</p>
        </Link>
    );
}

export default async function PainelPage() {
  const user = await getUser();
  
  // Se não houver usuário logado, continua mostrando o formulário de login
  if (!user) {
    return <LoginForm />;
  }
  
  // Se o usuário estiver logado, mostra o novo dashboard
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
            <h1 className="text-3xl font-bold">Painel de Administração</h1>
            <p className="mt-1 text-gray-600">Bem-vindo(a), {user.email}!</p>
        </div>
        <form action="/api/auth/signout" method="post">
          <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Sair (Logout)
          </button>
        </form>
      </div>

      {/* Grid com os botões bonitos e centralizados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MenuButton 
            href="/painel/adicionar" 
            title="Adicionar Peça" 
            description="Cadastrar um novo item no inventário." 
        />
        <MenuButton 
            href="/painel/catalogo" 
            title="Gerenciar Catálogo" 
            description="Visualizar, editar ou excluir peças existentes." 
        />
        {/* Botão para a futura área de métricas */}
        <div className="block p-6 bg-gray-50 border border-gray-200 rounded-lg text-center cursor-not-allowed opacity-60">
            <h2 className="text-2xl font-bold text-gray-400">Métricas</h2>
            <p className="mt-2 text-sm text-gray-400">Analisar vendas e o desempenho do brechó (em breve).</p>
        </div>
      </div>
    </div>
  );
}