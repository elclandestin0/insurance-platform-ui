import React, {useEffect, useState} from 'react';
import {
    Box,
    Flex,
    Text,
    SimpleGrid,
    Divider,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Input,
    Stat,
    StatLabel,
    StatNumber,
    Icon,
    Card,
    CardHeader,
    Heading,
    CardBody, CardFooter
} from '@chakra-ui/react';
import styles from "@/pages/page.module.css";
import {useContracts} from '@/hooks/useContracts';
import {useMetaMask} from "@/contexts/MetaMaskContext";
import {ethers, BigNumber} from "ethers";
import usePolicyContract from '@/hooks/usePolicyContract'; // Import the custom hook
import {useRouter} from 'next/router';
import {FaEthereum} from "react-icons/fa";

const PolicyCreators: React.FC = () => {
    const {policyMakerContract} = useContracts();
    const {policies, error} = usePolicyContract();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [coverageAmount, setCoverageAmount] = useState('');
    const [initialPremiumFee, setInitialPremiumFee] = useState('');
    const [initialCoveragePercentage, setInitialCoveragePercentage] = useState('');
    const [premiumRate, setPremiumRate] = useState('');
    const [duration, setDuration] = useState('');
    const [penaltyRate, setPenaltyRate] = useState('');
    const [monthsGracePeriod, setMonthsGracePeriod] = useState('');
    const [coveragePerentage, setCoveragePercentage] = useState('');
    const [investmentPercentage, setInvestmentPercentage] = useState('');
    const router = useRouter(); // Initialize useRouter

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleButtonClick = (policyId: any) => {
        router.push(`/policy-settings?policyId=${policyId}`);
    };


    if (error) {
        return <Box>Error: {error}</Box>;
    }

    const handleSubmit = async (event: Event) => {
        event.preventDefault();

        try {
            // Parse values to appropriate format
            const parsedCoverageAmount = ethers.utils.parseEther(coverageAmount);
            const parsedInitialPremiumFee = ethers.utils.parseEther(initialPremiumFee);
            const parsedInitialCoveragePercentage = ethers.BigNumber.from(initialCoveragePercentage);
            const parsedPremiumRate = ethers.utils.parseEther(premiumRate);
            const parsedDuration = Number(duration);
            const parsedPenaltyRate = Number(penaltyRate);
            const parsedMonthsGracePeriod = Number(monthsGracePeriod);
            const parsedInvestmentPerentage = Number(investmentPercentage);
            const parsedCoveragePercentage = Number(coveragePerentage);

            // Call the createPolicy function of the smart contract 
            const tx = await policyMakerContract.createPolicy(
                parsedCoverageAmount,
                parsedInitialPremiumFee,
                parsedInitialCoveragePercentage,
                parsedPremiumRate,
                parsedDuration,
                parsedPenaltyRate,
                parsedMonthsGracePeriod,
                parsedCoveragePercentage,
                parsedInvestmentPerentage,
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
                                        <Button onClick={() => handleButtonClick(policy.id)}>View details</Button>
                                    </CardFooter>
                                </Card>
                            </>
                        ))}
                    </SimpleGrid>
                ) : (
                    <Stat mt={4}>
                        <StatNumber> 0 policies found </StatNumber>
                    </Stat>
                )}
                <Button mt={4} onClick={openModal} colorScheme="pink" size="md">Create new policy</Button>
            </Box>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Create New Policy</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <form onSubmit={handleSubmit}>
                            <Input mt={4} placeholder="Coverage Amount" value={coverageAmount}
                                   onChange={(e) => setCoverageAmount(e.target.value)}/>
                            <Input mt={4} placeholder="Initial Premium Fee" value={initialPremiumFee}
                                   onChange={(e) => setInitialPremiumFee(e.target.value)}/>
                            <Input mt={4} placeholder="Initial Coverage Percentage" value={initialCoveragePercentage}
                                   onChange={(e) => setInitialCoveragePercentage(e.target.value)}/>
                            <Input mt={4} placeholder="Premium Rate" value={premiumRate}
                                   onChange={(e) => setPremiumRate(e.target.value)}/>
                            <Input mt={4} placeholder="Duration" value={duration}
                                   onChange={(e) => setDuration(e.target.value)}/>
                            <Input mt={4} placeholder="Penalty Rate" value={penaltyRate}
                                   onChange={(e) => setPenaltyRate(e.target.value)}/>
                            <Input mt={4} placeholder="Months Grace Period" value={monthsGracePeriod}
                                   onChange={(e) => setMonthsGracePeriod(e.target.value)}/>
                            <Input mt={4} placeholder="Investment Percentage" value={investmentPercentage}
                                   onChange={(e) => setInvestmentPercentage(e.target.value)}/>
                            <Input mt={4} placeholder="Coverage Percentage" value={coveragePerentage}
                                   onChange={(e) => setCoveragePercentage(e.target.value)}/>
                            <Button mt={4} type="submit">
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
