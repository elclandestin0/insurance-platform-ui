import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import usePolicyContract from '@/hooks/usePolicyContract';
import {BigNumber, ethers} from "ethers";
import { useMetaMask } from "@/contexts/MetaMaskContext";
import {
    Flex, Box, Text, Divider, VStack, Heading, Stat, StatLabel, StatNumber, StatGroup, Grid, Icon
} from '@chakra-ui/react';
import {FaEthereum} from "react-icons/fa";
import PayPremiumCTA from "@/components/PayPremiumCTA";
import { truncateToDecimalPlace } from '@/utils/helpers'; // Import the helper function

const PolicyManager = () => {
    const router = useRouter();
    const { policyId } = router.query;
    const { fetchPolicy } = usePolicyContract();
    const { account } = useMetaMask();
    const { payPremium, calculatePremium } = usePolicyContract();
    const [policy, setPolicy] = useState(null);
    const [calculatedPremium, setCalculatedPremium] = useState(null);

    useEffect(() => {
        const loadPolicy = async () => {
            if (policyId && account) {
                const policyDetails = await fetchPolicy(policyId, account);
                setPolicy(policyDetails);
                const calcPremium: any = await calculatePremium(policyId);
                setCalculatedPremium(calcPremium);
            }
        };

        loadPolicy();
    }, [policyId, fetchPolicy, account, calculatePremium, calculatedPremium]);

    const handlePayPremium = async (id, amount) => {
        await payPremium(id, amount);
    };
    
    return (
        <Flex
            width="100vw"
            justifyContent="center"
            p={4}
            overflow="auto"
            align="start"
            height="auto"
            mt={10}
        >
            {policy ? (
                <Box
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    p={6}
                    width="80%"
                    maxWidth="1000px"
                    bg="white"
                    boxShadow="lg"
                >
                    <Flex justify="space-between" align="center">
                        <Heading as="h1" size="xl">Policy Manager</Heading>
                        <StatGroup>
                            <Stat>
                                <StatLabel>ID</StatLabel>
                                <StatNumber>{policy.id}</StatNumber>
                            </Stat>
                        </StatGroup>
                    </Flex>
                    <Divider my={4}/>
                    <Grid templateColumns={{ sm: '1fr', md: '1fr 1fr', lg: 'repeat(3, 1fr)' }} gap={6}>
                        <Stat>
                            <StatLabel>Coverage Amount</StatLabel>
                            <StatNumber>{ethers.utils.formatEther(policy.coverageAmount)} <Icon as={FaEthereum} color="currentcolor" /></StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Initial Premium Fee</StatLabel>
                            <StatNumber>{ethers.utils.formatEther(policy.initialPremiumFee)} <Icon as={FaEthereum} color="currentcolor" /></StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Initial Coverage Percentage</StatLabel>
                            <StatNumber>{policy.initialCoveragePercentage}%</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Premium Rate</StatLabel>
                            <StatNumber>{ethers.utils.formatEther(policy.premiumRate)} <Icon as={FaEthereum} ml={1} color="currentcolor" /></StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Duration</StatLabel>
                            <StatNumber>{policy.duration} days</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Penalty Rate</StatLabel>
                            <StatNumber>{policy.penaltyRate}%</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Months Grace Period</StatLabel>
                            <StatNumber>{policy.monthsGracePeriod}</StatNumber>
                        </Stat>
                        <Divider my={4}/>
                        <Stat>
                            <StatLabel>Calculated Premium</StatLabel>
                            <StatNumber>{calculatedPremium ? ethers.utils.formatEther(calculatedPremium) : '0.0'}<Icon as={FaEthereum} color="currentcolor" /></StatNumber>
                        </Stat>
                    </Grid>
                    <Divider my={4}/>
                    <PayPremiumCTA premiumRate={calculatedPremium} onPayPremium={handlePayPremium} policyId={policyId}/>
                </Box>
            ) : (
                <Text>Loading policy details...</Text>
            )}
        </Flex>
    );
};

export default PolicyManager;
