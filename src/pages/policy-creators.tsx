import React, {useEffect, useState} from 'react';
import {
    Box, Flex, Text, SimpleGrid, Divider, Button,
    Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalCloseButton, ModalBody, ModalFooter, Input
} from '@chakra-ui/react';import styles from "@/pages/page.module.css";
import {policyMakerContract} from '@/utils/ethereum';
import {useMetaMask} from "@/contexts/MetaMaskContext";
import {ethers} from "ethers";

const PolicyCreators: React.FC = () => {
    const {account} = useMetaMask();
    const [policies, setPolicies] = useState([]);
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
        try {
            return await policyMakerContract.policies(account);
        } catch (error) {
            console.log(error);
            return [];
        }
    }

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

    const handleSubmit = async (event: Event) => {
        event.preventDefault();
            try {
                // Parse values to appropriate format
                const parsedCoverageAmount = ethers.parseEther(coverageAmount); // Assuming ether units
                const parsedInitialPremiumFee = ethers.parseEther(initialPremiumFee); // Adjust based on the unit
                const parsedInitialCoveragePercentage = ethers.parseUnits(initialCoveragePercentage, 0);
                const parsedPremiumRate = ethers.parseEther(premiumRate);
                const parsedDuration = ethers.parseUnits(duration, 0);
                const parsedPenaltyRate = ethers.parseUnits(penaltyRate, 0);
                const parsedMonthsGracePeriod = ethers.parseUnits(monthsGracePeriod, 0);
                
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
                        </form>

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={closeModal}>
                            Close
                        </Button>
                        <Button variant="ghost" type="submit" form="form-id">
                            Create Policy
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
}

export default PolicyCreators;
