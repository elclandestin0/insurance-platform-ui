import React, {useEffect, useState} from 'react';
import {Box, Flex, Text, SimpleGrid, Divider} from '@chakra-ui/react';
import styles from "@/pages/page.module.css";
import {policyMakerContract} from '@/utils/ethereum';
import {useMetaMask} from "@/contexts/MetaMaskContext";

const PolicyCreators: React.FC = () => {
    const {account} = useMetaMask();
    const [policies, setPolicies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getPolicies = async () => {
            try {
                const fetchedPolicies = await fetchPolicies();
                setPolicies(fetchedPolicies);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching policies:', err);
            }
        };

        getPolicies();
    }, []); // Empty dependency array means this runs once when the component mounts

    if (error) {
        return <Box>Error: {error}</Box>;
    }

    const fetchPolicies = async (): Promise<any[]> => {
        try {
            return await policyMakerContract.policies(account);
        } catch (error) {
            console.log(error);
            return [];
        }
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
                        {policies.map((policy, index) => (
                            <Box key={index} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
                                <Text fontWeight="bold">Policy ID: {policy.id}</Text>
                                <Divider my={3}/>
                                {/* Render other policy details here */}
                                <Text>Coverage Amount: {policy.coverageAmount}</Text>
                                {/* Add more policy details as needed */}
                            </Box>
                        ))}
                    </SimpleGrid>
                ) : (
                    <Text>No policies found.</Text>
                )}
            </Box>
        </Flex>
    );
}

export default PolicyCreators;
