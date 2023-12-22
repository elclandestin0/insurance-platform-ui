// src/components/MetaMaskConnect.tsx
import { Button } from '@chakra-ui/react';
import { useMetaMask } from '../contexts/MetaMaskContext';

const MetaMaskConnect: React.FC = () => {
    const { isConnected, connectWallet } = useMetaMask();

    return (
        <Button colorScheme="teal" onClick={connectWallet} disabled={isConnected} size="lg">
            {isConnected ? 'Connected' : 'Connect to MetaMask'}
        </Button>
    );
};

export default MetaMaskConnect;
