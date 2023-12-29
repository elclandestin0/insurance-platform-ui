import React, {useState} from 'react';
import {
    Box,
    SimpleGrid,
    Text,
    Divider,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Flex,
    useDisclosure,
} from '@chakra-ui/react';
import styles from "@/pages/page.module.css";
import {useMetaMask} from "@/contexts/MetaMaskContext";
import usePolicyContract from '@/hooks/usePolicyContract';
import PolicyDetailsModal from "@/components/PolicyDetailsModal"; // Import the custom hook


const PolicyOwners: React.FC = () => {
    const {policies, isLoading, error} = usePolicyContract();
    const {account} = useMetaMask();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [selectedPolicy, setSelectedPolicy] = useState(null);

    const handlePolicyClick = (policy) => {
        setSelectedPolicy(policy);
        onOpen();
    };


    if (error) {
        return <Box>Error: {error}</Box>;
    }

    return (
        <Flex className={styles.main}
              height="100vh"
              alignItems="center"
              justifyContent="center"
              direction="column"
              p={4}>
            <Box p={5}>
                {policies.length > 0 ? (
                    <SimpleGrid columns={{sm: 1, md: 2, lg: 3}} spacing={5}>
                        {policies.map((policy) => (
                            <Box key={policy.id} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}
                                 onClick={() => handlePolicyClick(policy)} cursor="pointer">
                                <Text fontWeight="bold">Policy ID: {policy.id.toString()}</Text>
                                <Divider my={3}/>
                                <Text>Coverage Amount: {policy.coverageAmount}</Text>
                                <Text>Duration: {policy.duration} days</Text>
                                <Text>Premium Rate: {policy.premiumRate.toString()} ETH</Text>
                            </Box>
                        ))}
                    </SimpleGrid>
                ) : (
                    <Text>No policies found.</Text>
                )}
            </Box>
            <PolicyDetailsModal
                isOpen={isOpen}
                onClose={onClose}
                selectedPolicy={selectedPolicy}
            />
        </Flex>
    );
}

export default PolicyOwners;
