// src/pages/_app.tsx
import { ChakraProvider } from '@chakra-ui/react';
import '@/app/globals.css'; // Import global CSS
import { MetaMaskProvider } from '../contexts/MetaMaskContext';

export default function MyApp({ Component, pageProps }) {
    return (
        <ChakraProvider>
            <MetaMaskProvider>
                <Component {...pageProps} />
            </MetaMaskProvider>
        </ChakraProvider>
    );
}
