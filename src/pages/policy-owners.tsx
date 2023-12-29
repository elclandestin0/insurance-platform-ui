import React, { useEffect, useState } from 'react';
import {
    Box, Flex, Text, SimpleGrid, Divider,
} from '@chakra-ui/react';
import styles from "@/pages/page.module.css";
import { useContracts } from '@/hooks/useContracts';
import { useMetaMask } from "@/contexts/MetaMaskContext";
import { ethers } from "ethers";

const PolicyOwners: React.FC = () => {
    const { policyMakerContract } = useContracts();
    const { account } = useMetaMask();
    const [policies, setPolicies]: any[] = useState([]);
    const [error, setError] = useState(null);

    const fetchPolicies = async (): Promise<any[]> => {
        if (!policyMakerContract) {
            console.error("Contract not initialized.");
            return [];
        }
        try {
            const allPolicies = [];
            const nextIdBigNumber = await policyMakerContract.nextPolicyId();
            console.log(nextIdBigNumber);
            if (nextIdBigNumber != null) {
                for (let i = 1; i < nextIdBigNumber; i++) {
                    const policy = await policyMakerContract.policies(i.toString());
                    console.log(policy);
                    // Format the policy details correctly
                    const formattedPolicy = {
                        id: i,
                        coverageAmount: policy.coverageAmount.toString(),
                        initialPremiumFee: policy.initialPremiumFee.toString(),
                        initialCoveragePercentage: policy.initialCoveragePercentage.toString(),
                        premiumRate: policy.premiumRate.toString(),
                        duration: Number(policy.duration),
                        penaltyRate: Number(policy.penaltyRate),
                        monthsGracePeriod: Number(policy.monthsGracePeriod),
                    };

                    allPolicies.push(formattedPolicy);
                }

                return allPolicies;
            } else {
                console.error("nextPolicyId did not return a BigNumber.");
                return [];
            }
        } catch (error) {
            console.error("Error fetching all policies:", error);
            return []; // or handle this case as needed
        }
    };

    useEffect(() => {
        const getPolicies = async () => {
            try {
                const fetchedPolicies = await fetchPolicies();
                setPolicies(fetchedPolicies);
            } catch (err) {
                // setError(err.message);
                console.error('Error fetching policies:', err);
            }
        };
        getPolicies();
    }, [policyMakerContract ]);

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
