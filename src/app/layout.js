// Arquivo: src/app/layout.js

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
import { CartProvider } from "@/context/CartContext"; // Caminho corrigido com @

import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import FloatingButtons from '@/components/FloatingButtons';


// --- FONTES DO PROJETO ---
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: ["400"], variable: "--font-great-vibes" });
const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair-display" });
const lato = Lato({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-lato' });
const mulish = Mulish({ subsets: ['latin'], variable: '--font-mulish' });
const nunito = Nunito({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-nunito' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-poppins' });
const quicksand = Quicksand({ subsets: ['latin'], variable: '--font-quicksand' });
const manrope = Manrope({ subsets: ['latin'], weight: ['800'], variable: '--font-manrope' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['700'], variable: '--font-space-grotesk' });

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
          ${geistSans.variable} ${geistMono.variable} ${greatVibes.variable} 
          ${playfairDisplay.variable} ${lato.variable} ${mulish.variable} 
          ${nunito.variable} ${poppins.variable} ${quicksand.variable} 
          ${manrope.variable} ${spaceGrotesk.variable} antialiased
        `}
      >
        <Toaster 
      position="top-center" // Posição das notificações
      toastOptions={{
        duration: 3000, // Duração de 3 segundos
      }}
    />
          <CartProvider>
      <Toaster />
      <main>{children}</main>
      <Footer />
      <FloatingButtons />
    </CartProvider>
      </body>
      
    </html>
  );
}