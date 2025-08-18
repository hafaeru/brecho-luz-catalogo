import Link from 'next/link';
import { FaInstagram, FaWhatsapp, FaFacebook } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-stone-100 border-t border-stone-200 text-stone-700 mt-12">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          
          {/* Coluna 1: Marca e Mensagem */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-bold text-amber-900" style={{ fontFamily: 'var(--font-lato)' }}>
              Brechó Luz
            </h2>
                <div className="mt-2 text-sm max-w-xs space-y-3" style={{ fontFamily: 'var(--font-nunito)' }}>
                    <p>Seja bem-vindo!
                    Peças com História, Luz para seu Estilo. Encontre tesouros únicos e dê uma nova vida à moda.</p>
                    <p>Enviamos para todo Brasil. Entrega no mesmo dia para Curitiba e região metropolitana.</p>
                </div>
          </div>

          {/* Coluna 2: Navegação */}
          <div>
            <h3 className="font-semibold text-teal-800 uppercase tracking-wider" style={{ fontFamily: 'var(--font-poppins)' }}>
              Navegue
            </h3>
            <nav className="mt-4 flex flex-col space-y-2" style={{ fontFamily: 'var(--font-nunito)' }}>
              <Link href="/" className="hover:text-amber-800 hover:underline">Início</Link>
              <Link href="/sobre" className="hover:text-amber-800 hover:underline">Sobre Nós</Link>
              <Link href="/como-funciona" className="hover:text-amber-800 hover:underline">Como funciona?</Link>
              <Link href="/carrinho" className="hover:text-amber-800 hover:underline">Meu Carrinho</Link>
              {/* Adicione outros links aqui se necessário, ex: "Contato", "FAQ" */}
            </nav>
          </div>

          {/* Coluna 3: Contato e Redes Sociais */}
          <div>
            <h3 className="font-semibold text-teal-800 uppercase tracking-wider" style={{ fontFamily: 'var(--font-poppins)' }}>
              Contato
            </h3>
            <div className="mt-4 space-y-2" style={{ fontFamily: 'var(--font-nunito)' }}>
              <p>Alto da XV, Curitiba - PR</p>
              <p>Atendimento com hora marcada.</p>
              <div className="flex justify-center md:justify-start space-x-6 mt-4">
                <a href="https://instagram.com/usebrecholuz" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-amber-800">
                  <FaInstagram size={24} />
                </a>
                <a href="https://wa.me/5541SEUNUMEROAQUI" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-amber-800">
                  <FaWhatsapp size={24} />
                </a>
                <a href="https://www.facebook.com/people/Brech%C3%B3-Luz/61579754214792/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-amber-800">
                  <FaFacebook size={24} />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Barra Inferior de Copyright e Créditos */}
      <div className="border-t border-stone-200 bg-stone-200">
        <div className="container mx-auto py-4 px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left text-sm text-stone-500 space-y-2 md:space-y-0">
            <p>&copy; {new Date().getFullYear()} Brechó Luz. Todos os direitos reservados.</p>
            <p>Desenvolvido por <a href="SEU_LINK_DE_PORTFOLIO" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">Hafaeru</a></p>
        </div>
      </div>
    </footer>
  );
}