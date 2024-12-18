// pages/_app.tsx
import type { AppProps } from 'next/app';
import Layout from '@/Layout';
import '../styles/globals.css'; // Import your global styles here

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
