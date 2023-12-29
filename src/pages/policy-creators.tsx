import React, {useEffect, useState} from 'react';
import {
    Box, Flex, Text, SimpleGrid, Divider, Button,
    Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalCloseButton, ModalBody, ModalFooter, Input
} from '@chakra-ui/react';
import styles from "@/pages/page.module.css";
import { useContracts } from '@/hooks/useContracts';
import {useMetaMask} from "@/contexts/MetaMaskContext";
import {ethers, BigNumber} from "ethers";

const PolicyCreators: React.FC = () => {
    const { policyMakerContract } = useContracts();
    const {account} = useMetaMask();
    const [policies, setPolicies]: any[] = useState([]);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [coverageAmount, setCoverageAmount] = useState('');
    const [initialPremiumFee, setInitialPremiumFee] = useState('');
    const [initialCoveragePercentage, setInitialCoveragePercentage] = useState('');
    const [premiumRate, setPremiumRate] = useState('');
    const [duration, setDuration] = useState('');
    const [penaltyRate, setPenaltyRate] = useState('');
    const [monthsGracePeriod, setMonthsGracePeriod] = useState('');

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

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

    const handleSubmit = async (event: Event) => {
        event.preventDefault();
        console.log("clicking handle submit..");
            try {
                // Parse values to appropriate format
                const parsedCoverageAmount = ethers.BigNumber.from(coverageAmount);
                const parsedInitialPremiumFee = ethers.BigNumber.from(initialPremiumFee);
                const parsedInitialCoveragePercentage = ethers.BigNumber.from(initialCoveragePercentage);
                const parsedPremiumRate = ethers.BigNumber.from(premiumRate);
                const parsedDuration = Number(duration);
                const parsedPenaltyRate = Number(penaltyRate);
                const parsedMonthsGracePeriod = Number(monthsGracePeriod);

                console.log(parsedCoverageAmount);
                // Call the createPolicy function of the smart contract
                const tx = await policyMakerContract.createPolicy(
                    parsedCoverageAmount,
                    parsedInitialPremiumFee,
                    parsedInitialCoveragePercentage,
                    parsedPremiumRate,
                    parsedDuration,
                    parsedPenaltyRate,
                    parsedMonthsGracePeriod
                );
                await tx.wait();

            } catch (error) {
                console.error('Error creating policy:', error);
            }
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
                        {policies.map((policy, index) => (
                            <Box key={index} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
                                <Text fontWeight="bold">Policy ID: {policy.id.toString()}</Text> {/* Assuming policy.id is a BigNumber */}
                                <Divider my={3}/>
                                {/* Render other policy details here */}
                                <Text>Coverage Amount: {policy.coverageAmount}</Text>
                                {/* Add more policy details as needed */}
                                <Text>Duration: {policy.duration} days</Text> {/* Assuming policy.duration is a BigNumber */}
                                <Text>Premium Rate: {policy.premiumRate.toString()} ETH</Text>
                                {/* ...and so on for the other attributes */}
                            </Box>
                        ))}
                    </SimpleGrid>
                ) : (
                    <Text>No policies found.</Text>
                )}
                <Button colorScheme="blue" onClick={openModal}>Create new Policy</Button>
            </Box>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create New Policy</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handleSubmit}>
                            <Input placeholder="Coverage Amount" value={coverageAmount} onChange={(e) => setCoverageAmount(e.target.value)} />
                            <Input placeholder="Initial Premium Fee" value={initialPremiumFee} onChange={(e) => setInitialPremiumFee(e.target.value)} />
                            <Input placeholder="Initial Coverage Percentage" value={initialCoveragePercentage} onChange={(e) => setInitialCoveragePercentage(e.target.value)} />
                            <Input placeholder="Premium Rate" value={premiumRate} onChange={(e) => setPremiumRate(e.target.value)} />
                            <Input placeholder="Duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
                            <Input placeholder="Penalty Rate" value={penaltyRate} onChange={(e) => setPenaltyRate(e.target.value)} />
                            <Input placeholder="Months Grace Period" value={monthsGracePeriod} onChange={(e) => setMonthsGracePeriod(e.target.value)} />
                            <Button type="submit">
                                Create Policy
                            </Button>
                        </form>

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={closeModal}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
}

export default PolicyCreators;
