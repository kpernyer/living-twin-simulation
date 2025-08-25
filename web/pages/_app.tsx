import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';
import { SimulationProvider } from '../context/SimulationContext';
import ContextBar from '../components/ContextBar';

import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SimulationProvider>
      <ContextBar />
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </SimulationProvider>
  );
}
