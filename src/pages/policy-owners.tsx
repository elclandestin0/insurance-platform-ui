import React, { useEffect, useState } from 'react';
import {
    Box, Flex, Text, SimpleGrid, Divider,
} from '@chakra-ui/react';
import styles from "@/pages/page.module.css";
import { useMetaMask } from "@/contexts/MetaMaskContext";
import usePolicyContract from '@/hooks/usePolicyContract'; // Import the custom hook


const PolicyOwners: React.FC = () => {
    const { policies, isLoading, error } = usePolicyContract();
    const { account } = useMetaMask();
    

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
                        {policies.map((policy, index) => (
                            <Box key={index} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
                                <Text fontWeight="bold">Policy ID: {policy.id.toString()}</Text>
                                <Divider my={3}/>
                                {/* Render other policy details here */}
                                <Text>Coverage Amount: {policy.coverageAmount}</Text>
                                <Text>Duration: {policy.duration} days</Text>
                                <Text>Premium Rate: {policy.premiumRate.toString()} ETH</Text>
                                {/* ...and so on for the other attributes */}
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

export default PolicyOwners;
