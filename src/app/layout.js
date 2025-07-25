import { 
  Geist, 
  Geist_Mono, 
  Great_Vibes, 
  Playfair_Display,
  Lato, 
  Mulish, 
  Nunito, 
  Poppins, 
  Quicksand,
  Manrope,
  Space_Grotesk
} from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { CartProvider } from "@/context/CartContext"; // Importa o "cérebro" do carrinho
import CartIcon from "@/app/CartIcon"; // Importa o componente do ícone do carrinho

// --- FONTES DO PROJETO ---
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-great-vibes",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
});

const mulish = Mulish({
  subsets: ['latin'],
  variable: '--font-mulish',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-nunito',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-poppins',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['800'],
  variable: '--font-manrope',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-space-grotesk',
});


// --- METADADOS DO SITE ---
export const metadata = {
  title: "Brechó Luz",
  description: "Peças com História, Luz para seu Estilo!",
};


// --- ESTRUTURA PRINCIPAL (LAYOUT) ---
export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          ${greatVibes.variable} 
          ${playfairDisplay.variable}
          ${lato.variable}
          ${mulish.variable}
          ${nunito.variable}
          ${poppins.variable}
          ${quicksand.variable}
          ${manrope.variable} 
          ${spaceGrotesk.variable}
          antialiased
        `}
      >
        <CartProvider> {/* 1. O "Cérebro" do carrinho agora envolve todo o site */}
          <header 
            className="w-full p-4 shadow-md sticky top-0 z-50" 
            style={{ backgroundColor: '#d0ab81' }}
          >
            <div className="container mx-auto flex justify-between items-center">
              <Link href="/">
                <h1 
                  className="text-2xl font-bold text-white tracking-wider" 
                  style={{ fontFamily: 'var(--font-great-vibes)'}}
                >
                  Brechó Luz
                </h1>
              </Link>
              <CartIcon /> {/* 2. O ícone do carrinho foi adicionado aqui */}
            </div>
          </header>

          {children}
        </CartProvider>
      </body>
    </html>
  );
}