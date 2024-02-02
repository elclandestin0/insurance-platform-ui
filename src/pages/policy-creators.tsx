import React, {useEffect, useState} from 'react';
import {
    Box,
    Flex,
    Text,
    SimpleGrid,
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
    Stack,
    StatNumber,
    Card,
    CardHeader,
    Heading,
    CardBody, CardFooter, useDisclosure
} from '@chakra-ui/react';
import styles from "@/pages/page.module.css";
import {useContracts} from '@/hooks/useContracts';
import {useMetaMask} from "@/contexts/MetaMaskContext";
import {ethers} from "ethers";
import usePolicyContract from '@/hooks/usePolicyContract'; // Import the custom hook
import {useRouter} from 'next/router';
import {FaEthereum} from "react-icons/fa";
import PolicyDetailsModal from "@/components/PolicyDetailsModal";

const PolicyCreators: React.FC = () => {
    const {account} = useMetaMask();
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
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const {checkPolicyOwnership} = usePolicyContract();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleButtonClick = (policyId: any) => {
        router.push(`/policy-settings?policyId=${policyId}`);
    };

    const handlePolicyClick = (policy) => {
        setSelectedPolicy(policy);
        onOpen();
    };

    useEffect(() => {
        if (policies[0]) {
            console.log()
        }
    }, [account, policies])


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
                                <Card key={policy.id} backgroundColor="#27405d" borderColor="#00B3A4" borderWidth="2px">
                                    <CardHeader>
                                        <Heading color="white" size='md'>Policy ID: {policy.id.toString()}</Heading>
                                    </CardHeader>
                                    <CardBody>
                                        <Text color="white" >View policy details.</Text>
                                    </CardBody>
                                    <CardFooter>
                                        <Stack direction="column" spacing={5}>
                                            {
                                                ethers.utils.getAddress(account) == policies[0].creator ?
                                                    (<Button colorScheme="pink"
                                                             onClick={() => handleButtonClick(policy.id)}>Manage
                                                        settings</Button>) : (<></>)
                                            }
                                            <Button color="white" variant="ghost" onClick={() => handlePolicyClick(policy)}>View
                                                details</Button>
                                        </Stack>
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
                <Flex mt={5} justifyContent="center">
                    <Button onClick={openModal} colorScheme="pink" size="md">Create new policy</Button>
                </Flex> </Box>
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
            <PolicyDetailsModal
                isOpen={isOpen}
                onClose={onClose}
                selectedPolicy={selectedPolicy}
                checkOwnership={checkPolicyOwnership}
                viewOnly={true}
            />
        </Flex>
    );
}

export default PolicyCreators;
