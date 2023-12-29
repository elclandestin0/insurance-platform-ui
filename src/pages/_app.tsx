// src/pages/_app.tsx
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import '@/app/globals.css'; // Import global CSS
import { MetaMaskProvider } from '../contexts/MetaMaskContext';
import NavBar from "@/components/NavBar";

const theme: Record<string, any> = extendTheme({
    fonts: {
        heading: '"Open Sans", sans-serif', // Use Open Sans for headings
        body: '"Open Sans", sans-serif', // Use Open Sans for body text as well
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
