import React, {useEffect, useState} from 'react';
import {
    Box,
    Flex,
    Text,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Stat,
    Stack,
    StatNumber,
    Card,
    CardHeader,
    Heading,
    CardBody,
    CardFooter,
    useDisclosure,
    Grid,
    SimpleGrid,
    Input,
    StatLabel
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
                    <SimpleGrid columns={{sm: 1, md: 2, lg: 3}} spacing={5} placeItems="center">
                        {policies.map((policy) => (
                            <>
                                <Card key={policy.id} backgroundColor="#27405d">
                                    <CardHeader>
                                        <Heading color="white" size='md'>Policy ID: {policy.id.toString()}</Heading>
                                    </CardHeader>
                                    <CardBody>
                                        <Text color="white">View policy details.</Text>
                                    </CardBody>
                                    <CardFooter>
                                        <Stack direction="column" spacing={5}>
                                            {
                                                ethers.utils.getAddress(account) == policies[0].creator ?
                                                    (<Button colorScheme="teal"
                                                             onClick={() => handleButtonClick(policy.id)}>Manage
                                                        settings</Button>) : (<></>)
                                            }
                                            <Button color="white" variant="outline"
                                                    onClick={() => handlePolicyClick(policy)}>View
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
                </Flex>
            </Box>
            <Modal size="xl" isOpen={isModalOpen} onClose={closeModal} width="400px">
                <ModalOverlay/>
                <ModalContent borderRadius="xl" backgroundColor="#27405d" p={4}>
                    <ModalHeader color="white" fontSize="lg" fontWeight="bold" textAlign="center"
                                 borderTopRadius="10px">Create New Policy</ModalHeader>
                    <ModalCloseButton color="white"/>
                    <ModalBody>
                        <form onSubmit={handleSubmit}>
                            <Grid columns={2} spacing={5}
                                  templateColumns={{sm: '1fr', md: '1fr 1fr', lg: 'repeat(2, 1fr)'}} gap={6}>
                                <Stat>
                                    <StatLabel color="white"> Coverage amount</StatLabel>
                                    <Input mt={4} color="white" value={coverageAmount}
                                           onChange={(e) => setCoverageAmount(e.target.value)}/>
                                </Stat>
                                <Stat>
                                    <StatLabel color="white"> Initial Premium Fee </StatLabel>
                                    <Input mt={4} color="white"
                                           value={initialPremiumFee}
                                           onChange={(e) => setInitialPremiumFee(e.target.value)}/>
                                </Stat>
                                <Stat>
                                    <StatLabel color="white"> Initial Coverage Percentage</StatLabel>
                                    <Input mt={4} color="white"
                                           value={initialCoveragePercentage}
                                           onChange={(e) => setInitialCoveragePercentage(e.target.value)}/>
                                </Stat>
                                <Stat>
                                    <StatLabel color="white"> Premium Rate </StatLabel>
                                    <Input mt={4} color="white" value={premiumRate}
                                           onChange={(e) => setPremiumRate(e.target.value)}/>
                                </Stat>
                                <Stat>
                                    <StatLabel color="white"> Duration</StatLabel>
                                    <Input mt={4} color="white" value={duration}
                                           onChange={(e) => setDuration(e.target.value)}/>
                                </Stat>
                                <Stat>
                                    <StatLabel color="white"> Penalty Rate</StatLabel>
                                    <Input mt={4} color="white" value={penaltyRate}
                                           onChange={(e) => setPenaltyRate(e.target.value)}/>
                                </Stat>
                                <Stat>
                                    <StatLabel color="white"> Months Grace Period</StatLabel>
                                    <Input mt={4} color="white"
                                           value={monthsGracePeriod}
                                           onChange={(e) => setMonthsGracePeriod(e.target.value)}/>
                                </Stat>
                                <Stat>
                                    <StatLabel color="white"> Investment Percentage</StatLabel>
                                    <Input mt={4} color="white"
                                           value={investmentPercentage}
                                           onChange={(e) => setInvestmentPercentage(e.target.value)}/>
                                </Stat>
                                <Stat>
                                    <StatLabel color="white"> Coverage Percentage</StatLabel>
                                    <Input mt={4} color="white"
                                           value={coveragePerentage}
                                           onChange={(e) => setCoveragePercentage(e.target.value)}/>
                                </Stat>
                            </Grid>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="pink" type="submit" onClick={handleSubmit}>
                            Create Policy
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
