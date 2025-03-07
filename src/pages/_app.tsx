import Navbar from "@/components/Navbar"; // Importation de la barre de navigation
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar /> {/* Barre de navigation visible sur toutes les pages */}
      <Component {...pageProps} />
    </>
  );
}
