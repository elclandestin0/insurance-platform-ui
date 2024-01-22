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
    useDisclosure, Card, CardHeader, CardBody, Heading, CardFooter, Button,
} from '@chakra-ui/react';
import styles from "@/pages/page.module.css";
import usePolicyContract from '@/hooks/usePolicyContract';
import PolicyDetailsModal from "@/components/PolicyDetailsModal";
import {ethers} from "ethers"; // Import the custom hook


const PolicyOwners: React.FC = ({policy}) => {
    const {policies, error} = usePolicyContract();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const {checkPolicyOwnership} = usePolicyContract();


    if (error) {
        return <Box>Error: {error}</Box>;
    }

    const handlePolicyClick = (policy) => {
        setSelectedPolicy(policy);
        onOpen();
    };


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
                            <>
                                <Card key={policy.id}>
                                    <CardHeader>
                                        <Heading size='md'>Policy ID: {policy.id.toString()}</Heading>
                                    </CardHeader>
                                    <CardBody>
                                        <Text>View policy details.</Text>
                                    </CardBody>
                                    <CardFooter>
                                        <Button onClick={() => handlePolicyClick(policy)}>View details</Button>
                                    </CardFooter>
                                </Card>
                            </>
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
                checkOwnership={checkPolicyOwnership}
            />
        </Flex>
    );
}

export default PolicyOwners;
