// src/contexts/MetaMaskContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface IMetaMaskContext {
    isConnected: boolean;
    connectWallet: () => Promise<void>;
}

// Create a context with a default disconnected state and a dummy connect function
const MetaMaskContext = createContext<IMetaMaskContext>({
    isConnected: false,
    connectWallet: async () => {},
});

export const useMetaMask = () => useContext(MetaMaskContext);

export const MetaMaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        const handleAccountsChanged = (accounts: string[]) => {
            setIsConnected(accounts.length > 0);
        };

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            // Cleanup function to remove the event listener
            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            };
        }
    }, []);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                setIsConnected(true);
            } catch (error) {
                console.error(error);
            }
        } else {
            alert('Please install MetaMask!');
        }
    };

    return (
        <MetaMaskContext.Provider value={{ isConnected, connectWallet }}>
            {children}
        </MetaMaskContext.Provider>
    );
};
