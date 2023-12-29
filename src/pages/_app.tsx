// src/pages/_app.tsx
import { ChakraProvider } from '@chakra-ui/react';
import '@/app/globals.css'; // Import global CSS
import { MetaMaskProvider } from '../contexts/MetaMaskContext';
import { extendTheme } from '@chakra-ui/react';
import NavBar from "@/components/NavBar";

const theme: Record<string, any> = extendTheme({
    fonts: {
        heading: 'Roboto, sans-serif',
        body: 'Poppins, sans-serif',
    },
    // You can add other theme customizations here
});

export default function MyApp({ Component, pageProps }) {
    return (
        <ChakraProvider theme={theme}>
            <MetaMaskProvider>
                <NavBar/>
                <Component {...pageProps} />
            </MetaMaskProvider>
        </ChakraProvider>
    );
}
