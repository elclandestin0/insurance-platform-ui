// src/contexts/MetaMaskContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface IMetaMaskContext {
    isConnected: boolean;
    account: String | null;
    connectWallet: () => Promise<void>;
}

// Create a context with a default disconnected state and a dummy connect function
const MetaMaskContext = createContext<IMetaMaskContext>({
    isConnected: false,
    account: null,
    connectWallet: async () => {},
});

export const useMetaMask = () => useContext(MetaMaskContext);

export const MetaMaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [account, setAccount] = useState<string | null>(null); // State to store the connected account

    useEffect(() => {
        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length > 0) {
                setIsConnected(true);
                setAccount(accounts[0]); // Set the connected account
            } else {
                setIsConnected(false);
                setAccount(null); // Reset the account when disconnected
            }
        };

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);

            // Check if already connected on component mount
            window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
                if (accounts.length > 0) {
                    setIsConnected(true);
                    setAccount(accounts[0]);
                }
            });

            // Cleanup function to remove the event listener
            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            };
        }
    }, []);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setIsConnected(true);
                setAccount(accounts[0]);
            } catch (error) {
                console.error(error);                
                setIsConnected(false);
                setAccount(null);
            }
        } else {
            alert('Please install MetaMask!');
        }
    };

    return (
        <MetaMaskContext.Provider value={{ isConnected, account, connectWallet }}>
            {children}
        </MetaMaskContext.Provider>
    );
};
