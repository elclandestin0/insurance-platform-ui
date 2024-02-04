import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import usePolicyContract from '@/hooks/usePolicyContract';
import {BigNumber, ethers} from "ethers";
import {useMetaMask} from "@/contexts/MetaMaskContext";
import {
    Flex,
    Box,
    Text,
    Divider,
    Heading,
    Stat,
    StatLabel,
    StatNumber,
    StatGroup,
    Grid,
    Icon,
    Button
} from '@chakra-ui/react';
import {FaEthereum} from "react-icons/fa";
import PayPremiumCTA from "@/components/PayPremiumCTA";
import {convertEpochToReadableDate} from '@/utils/helpers'; // Import the helper function
import usePayoutContract from '@/hooks/usePayoutContract';
import ManagePremiumModal from "@/components/ManagePremiumModal";

const PolicyManager = () => {
        const router = useRouter();
        const {policyId} = router.query;
        const {fetchPolicy, payPremium, calculatePremium, handlePayout, fetchPremiumsPaid, fetchLastPaidTime, fetchTotalCoverage, fetchPotentialCoverage, fetchAmountCoverageFunded, fetchAmountInvestmentFunded, checkIfCovered, checkIfPotentiallyCovered, fetchPremiumCalculation, fetchRewards} = usePolicyContract();
        const {account} = useMetaMask();
        const [policy, setPolicy] = useState(null);
        const [potentialCoverage, setPotentialCoverage] = useState<string>("0.0");
        const [calculatedPremium, setCalculatedPremium] = useState<BigNumber>(BigNumber.from(0));
        const [premiumsPaid, setPremiumsPaid] = useState<BigNumber>(BigNumber.from(0));
        const [lastPaidTime, setLastPaidTime] = useState<BigNumber>(BigNumber.from(0));
        const [totalCoverage, setTotalCoverage] = useState<BigNumber>(BigNumber.from(0));
        const [premiumAmountToSend, setPremiumAmountToSend] = useState<BigNumber>(BigNumber.from(0));
        const [amountInvestment, setAmountInvestment] = useState<BigNumber>(BigNumber.from(0));
        const [amountCoverage, setAmountCoverage] = useState<BigNumber>(BigNumber.from(0));
        const [premiumCoverage, setPremiumCoverage] = useState<BigNumber>(BigNumber.from(0));
        const [premiumInvestment, setPremiumInvestment] = useState<BigNumber>(BigNumber.from(0));
        const [bonusCoverage, setBonusCoverage] = useState<BigNumber>(BigNumber.from(0));
        const [refreshData, setRefreshData] = useState<boolean>(false);
        const [potentiallyCovered, setPotentiallyCovered] = useState(false);
        const [covered, setCovered] = useState(false);
        const [gracePeriodExceeded, setGracePeriodExceeded] = useState(false);
        const [potentiallyBonusCovered, setPotentiallyBonusCovered] = useState(false);
        const [bonusCovered, setBonusCovered] = useState(false);
        const [claimableRewards, setClaimableRewards] = useState<BigNumber>(BigNumber.from(0));


        const [isModalOpen, setIsModalOpen] = useState(false);
        const openModal = () => setIsModalOpen(true);
        const closeModal = () => setIsModalOpen(false);

        useEffect(() => {
            const loadData = async () => {
                if (policyId && account) {
                    // Load policy data 
                    const policyDetails: any = await fetchPolicy(policyId);

                    if (!policy)
                        setPolicy(policyDetails);

                    // load premium data
                    const calcPremium: BigNumber = await calculatePremium(policyId);
                    setCalculatedPremium(calcPremium);
                    if (!premiumAmountToSend) {
                        setPremiumAmountToSend(calcPremium);
                    }

                    const lastPaidTime: BigNumber = await fetchLastPaidTime(policyId, account);
                    setLastPaidTime(lastPaidTime);

                    const _gracePeriodExceeded = policyDetails ? await checkGracePeriodExceeded(policyId, account, policyDetails.monthsGracePeriod) : false;
                    setGracePeriodExceeded(_gracePeriodExceeded);

                    const premiumsPaid: BigNumber = await fetchPremiumsPaid(policyId, account);
                    setPremiumsPaid(premiumsPaid);

                    const coverage: BigNumber = await fetchTotalCoverage(policyId, account);
                    setTotalCoverage(coverage);

                    const rewards: BigNumber = await fetchRewards(policyId, account);
                    setClaimableRewards(rewards);
                    // Check if bonus covered. For now, this is a hard-coded value. In the future, however, as we update
                    // const coverageAmount: BigNumber = policyDetails.coverageAmount;
                    // coverage > coverageAmount.mul(2) ? setBonusCovered(true) : setBonusCovered(false);

                    const amountCovered: BigNumber = await fetchAmountCoverageFunded(policyId, account);
                    setAmountCoverage(amountCovered);

                    const covered: boolean = await checkIfCovered(policyId, account);
                    setCovered(covered);

                    const amountInvested: BigNumber = await fetchAmountInvestmentFunded(policyId, account);
                    setAmountInvestment(amountInvested);

                    if (potentiallyCovered) {
                        const _bonusCoverage: BigNumber = ethers.utils.parseEther(potentialCoverage).sub(policy.coverageAmount);
                        setBonusCoverage(_bonusCoverage);
                    } else {
                        setBonusCoverage(BigNumber.from(0));
                    }
                }
            };

            loadData();
        }, [policyId, account, fetchPolicy, calculatePremium, fetchPremiumsPaid, fetchTotalCoverage, fetchLastPaidTime, refreshData, policy]);

        const handlePayPremium = async (id: any, amount: BigNumber) => {
            await payPremium(id, amount);
        };

        const handleClaim = async (id: any) => {
            await handlePayout(id, totalCoverage);
        };

        const checkPotentialCoverage = async (id: any, amount: BigNumber) => {
            const _potentialCoverage = await fetchPotentialCoverage(id, account, amount);
            console.log(ethers.utils.formatEther(_potentialCoverage));
            setPotentialCoverage(ethers.utils.formatEther(_potentialCoverage));
        }

        const checkGracePeriodExceeded = async (policyId: any, account: any, gracePeriodMonths: any) => {
            // Fetch the last paid time (timestamp in seconds)
            const lastPaidTime = await fetchLastPaidTime(policyId, account);

            // Convert lastPaidTime from BigNumber to a Date object
            const lastPaidDate = new Date(lastPaidTime.toNumber() * 1000);

            // Convert grace period from months to milliseconds
            // Assuming 30 days per month for simplicity
            const gracePeriodMs = gracePeriodMonths * 30 * 24 * 60 * 60;

            const provider = new ethers.providers.JsonRpcProvider();
            const blockNow = await provider.getBlock('latest');

            // Calculate the difference in milliseconds
            const timeDiffMs = blockNow.timestamp - (lastPaidDate.getTime() / 1000);

            // Check if the difference exceeds the grace period
            if (timeDiffMs > gracePeriodMs) {
                console.log('The grace period has been exceeded.');
                return true;
            } else {
                console.log('The grace period has not been exceeded.');
                return false;
            }
        };


        const handlePremiumInput = async (e: any) => {
            // Ensure input is a valid number or default to "0.0"
            const inputValue = e.target.value.trim();
            const numericValue = inputValue === '' || isNaN(inputValue) ? "0.0" : inputValue;
            try {
                const inputAmount = ethers.utils.parseEther(numericValue);
                console.log(inputAmount);
                if (inputAmount.gte(calculatedPremium)) {
                    setPremiumAmountToSend(inputAmount);
                    await checkPotentialCoverage(policyId, inputAmount);
                    const _premiumCalculation = await fetchPremiumCalculation(policyId, inputAmount);
                    _premiumCalculation ? setPremiumCoverage(_premiumCalculation[0]) : setPremiumCoverage(BigNumber.from("0.0"));
                    _premiumCalculation ? setPremiumInvestment(_premiumCalculation[1]) : setPremiumInvestment(BigNumber.from("0.0"));

                    const _covered = await checkIfPotentiallyCovered(policyId, account, inputAmount);
                    setPotentiallyCovered(_covered);

                    setRefreshData(prev => !prev);
                } else {
                    setPremiumAmountToSend(calculatedPremium)
                }
            } catch (error) {
                console.error('Error parsing premium amount:', error);
                // Handle error or set default values
            }
        };


        return (
            <Flex
                width="100vw"
                justifyContent="center"
                pt={10}
                overflow="auto"
                align="start"
                height="100vh"
                backgroundColor="#243b55"
            >
                {policy ? (
                    <Box
                        borderRadius="lg"
                        overflow="hidden"
                        p={6}
                        width="80%"
                        maxWidth="1000px"
                        bg="#27405d"
                        boxShadow="lg"
                    >
                        <Flex justify="space-between" align="center">
                            <Heading as="h1" size="xl" color="white">Policy Manager</Heading>
                            <StatGroup>
                                <Stat color="white">
                                    <StatLabel>ID</StatLabel>
                                    <StatNumber>{policy.id}</StatNumber>
                                </Stat>
                            </StatGroup>
                        </Flex>
                        <Divider my={4}/>
                        <Heading size="md" color="gray.300" mb={6} fontWeight="normal">
                            Policy Details
                        </Heading>
                        <Grid templateColumns={{sm: '1fr', md: '1fr 1fr', lg: 'repeat(3, 1fr)'}} gap={6}>
                            <Stat color="green.300">
                                <StatLabel>Coverage Amount</StatLabel>
                                <StatNumber>{ethers.utils.formatEther(policy.coverageAmount)} <Icon as={FaEthereum}
                                                                                                    color="currentcolor"/></StatNumber>
                            </Stat>
                            <Stat color="red.300">
                                <StatLabel>Penalty Rate</StatLabel>
                                <StatNumber>{policy.penaltyRate}%</StatNumber>
                            </Stat>
                            <Stat color="yellow.300">
                                <StatLabel>Months Grace Period</StatLabel>
                                <StatNumber>{policy.monthsGracePeriod}</StatNumber>
                            </Stat>
                            <Stat color="white">
                                <StatLabel>Initial Premium Fee</StatLabel>
                                <StatNumber>{ethers.utils.formatEther(policy.initialPremiumFee)} <Icon as={FaEthereum}
                                                                                                       color="currentcolor"/></StatNumber>
                            </Stat>
                            <Stat color="white">
                                <StatLabel>Initial Coverage Percentage</StatLabel>
                                <StatNumber>{policy.initialCoveragePercentage}%</StatNumber>
                            </Stat>
                            <Stat color="white">
                                <StatLabel>Premium Rate</StatLabel>
                                <StatNumber>{ethers.utils.formatEther(policy.premiumRate)} <Icon as={FaEthereum} ml={1}
                                                                                                 color="currentcolor"/></StatNumber>
                            </Stat>
                            <Stat color="white">
                                <StatLabel>Duration</StatLabel>
                                <StatNumber>{policy.duration} days</StatNumber>
                            </Stat>
                            <Stat color="gray.300">
                                <StatLabel> Percentage to Coverage Fund </StatLabel>
                                <StatNumber>{policy.coverageFundPercentage ? policy.coverageFundPercentage : '0'}%
                                    <Icon as={FaEthereum} color="currentcolor"/></StatNumber>
                            </Stat>
                            <Stat color="gray.300">
                                <StatLabel> Percentage to Investment Fund </StatLabel>
                                <StatNumber>{policy.investmentFundPercentage ? policy.investmentFundPercentage : '0'}%
                                    <Icon as={FaEthereum} color="currentcolor"/></StatNumber>
                            </Stat>
                        </Grid>
                        <Divider my={4}/>
                        <Heading size="md" color="gray.300" mb={6} fontWeight="normal">
                            Your Status
                        </Heading><Grid templateColumns={{sm: '1fr', md: '1fr 1fr', lg: 'repeat(3, 1fr)'}} gap={6}>
                        <Stat color="yellow.300">
                            <StatLabel> Last Paid Time </StatLabel>
                            <StatNumber>{lastPaidTime ? convertEpochToReadableDate(lastPaidTime) : '0.0'}</StatNumber>
                        </Stat>
                        <Stat color={gracePeriodExceeded ? "red.300" : "white"}>
                            {gracePeriodExceeded ? (
                                <StatLabel fontWeight="bold"
                                >Premium with Penalty</StatLabel>
                            ) : (<StatLabel
                                    color="white">Calculated Premium</StatLabel>
                            )}
                            <StatNumber>{calculatedPremium ? parseFloat(ethers.utils.formatEther(calculatedPremium)).toFixed(2) : '0.0'}<Icon
                                as={FaEthereum} color="currentcolor"/></StatNumber>
                        </Stat>
                        <Stat color="green.300">
                            <StatLabel> Maximum Claimable Coverage </StatLabel>
                            <StatNumber>{totalCoverage ? parseFloat(ethers.utils.formatEther(totalCoverage)).toFixed(2) : '0'}<Icon
                                as={FaEthereum} color="currentcolor"/></StatNumber>
                        </Stat>
                        <Stat color="white">
                            <StatLabel> Premiums Paid </StatLabel>
                            <StatNumber>{premiumsPaid ? parseFloat(ethers.utils.formatEther(premiumsPaid)).toFixed(2) : '0.0'}<Icon
                                as={FaEthereum} color="currentcolor"/></StatNumber>
                        </Stat>
                        <Stat color="gray.300">
                            <StatLabel> Amount in Coverage Fund </StatLabel>
                            <StatNumber>{amountCoverage ? parseFloat(ethers.utils.formatEther(amountCoverage)).toFixed(2) : '0'}<Icon
                                as={FaEthereum} color="currentcolor"/></StatNumber>
                        </Stat>
                        <Stat color="gray.300">
                            <StatLabel> Amount in Investment Fund </StatLabel>
                            <StatNumber>{amountInvestment ? parseFloat(ethers.utils.formatEther(amountInvestment)).toFixed(2) : '0'}<Icon
                                as={FaEthereum} color="currentcolor"/></StatNumber>
                        </Stat>
                    </Grid>
                        <Flex mt={10} justifyContent="center">
                            <ManagePremiumModal calculatedPremium={calculatedPremium} handlePayPremium={handlePayPremium}
                                                potentialCoverage={potentialCoverage} covered={covered}
                                                potentiallyCovered={potentiallyCovered} bonusCoverage={bonusCoverage}
                                                premiumCoverage={premiumCoverage} premiumInvestment={premiumInvestment}
                                                premiumAmountToSend={premiumAmountToSend}
                                                handlePremiumInput={handlePremiumInput} policyId={policyId}
                                                totalCoverage={totalCoverage} handleClaim={handleClaim}
                                                policyCoverageAmount={policy.coverageAmount}
                                                investmentPercentage={policy.investmentFundPercentage}
                                                coveragePercentage={policy.coverageFundPercentage}
                                                claimableRewards={claimableRewards}/>
                            {/*<Button colorScheme="blue" onClick={openModal}>Pay Premium</Button>*/}
                        </Flex>
                    </Box>
                ) : (
                    <Text>Loading policy details...</Text>
                )}
            </Flex>
        )
            ;
    }
;

export default PolicyManager;
