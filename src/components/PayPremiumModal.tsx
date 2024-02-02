import {
    Button,
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    Stat,
    StatLabel,
    StatNumber,
    Icon,
    Box,
    Text,
    IconButton,
    Tooltip,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    useDisclosure,
    useToast
} from '@chakra-ui/react';
import {FaEthereum} from 'react-icons/fa';
import {BigNumber, ethers} from 'ethers';
import {useEffect, useState} from "react";
import {InfoOutlineIcon} from '@chakra-ui/icons';
import {FaLock} from "react-icons/fa";
import usePolicyContract from "@/hooks/usePolicyContract";

const PayPremiumModal = ({
                             calculatedPremium,
                             potentialCoverage,
                             premiumAmountToSend,
                             handlePremiumInput,
                             handlePayPremium,
                             policyId,
                             bonusCoverage,
                             potentiallyCovered,
                             covered,
                             premiumCoverage,
                             premiumInvestment,
                             policyCoverageAmount,
                             investmentPercentage,
                             coveragePercentage,
                             totalCoverage,
                             handleClaim,
                             claimableRewards
                         }) => {

    const {payCustomPremium, withdrawRewardsFromPolicy} = usePolicyContract();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [activeTab, setActiveTab] = useState('pay');
    const [isHovering, setIsHovering] = useState(false);
    const [investmentPercentagePremium, setInvestmentPercentagePremium] = useState(50); // Default to 50%
    const [coveragePercentagePremium, setCoveragePercentagePremium] = useState(50);// Default to 50%
    const [readableCoverageAmount, setReadableCoverageAmount] = useState<BigNumber>(BigNumber.from(0));
    const [readableInvestmentAmount, setReadableInvestmentAmount] = useState<BigNumber>(BigNumber.from(0));
    const [customPremiumAmountToSend, setCustomPremiumAmountToSend] = useState<BigNumber>(BigNumber.from(0));
    const toast = useToast();

    const handleInvestmentPercentageChange = (valueString: any) => {
        const value = valueString === "" ? 0 : parseFloat(valueString);
        setInvestmentPercentagePremium(value);
        setCoveragePercentagePremium(100 - value);
    };


    useEffect(() => {
        if (covered) {
            setActiveTab('custom');
        }
        customPremiumAmountToSend ? setReadableCoverageAmount((customPremiumAmountToSend.mul(BigNumber.from(coveragePercentagePremium))).div(BigNumber.from(100))) : setReadableCoverageAmount(BigNumber.from(0));
        customPremiumAmountToSend ? setReadableInvestmentAmount((customPremiumAmountToSend.mul(BigNumber.from(investmentPercentagePremium))).div(BigNumber.from(100))) : setReadableCoverageAmount(BigNumber.from(0));
    }, [investmentPercentagePremium, customPremiumAmountToSend, covered]);


    const handlePayCustomPremium = async () => {
        await payCustomPremium(policyId, Number(investmentPercentagePremium), customPremiumAmountToSend);
    };

    const handleWithdrawRewards = async () => {
        await withdrawRewardsFromPolicy(policyId, claimableRewards);
    }

    const handleLockClick = () => {
        if (!covered) {
            toast({
                title: "Action needed",
                description: "You need to be fully covered to use this feature.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <>
            <Button onClick={onOpen} colorScheme="pink" size="md">Manage</Button>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay/>
                <ModalContent borderRadius="xl" backgroundColor="#27405d" p={4}>
                    <ModalHeader color="gray.700" fontSize="lg">
                        <Flex direction="row" justify="space-between" align="center">
                            <Box>
                                <Flex direction="row" align="center">
                                    <Text
                                        fontSize="md"
                                        fontWeight={activeTab === 'pay' ? 'bold' : 'normal'}
                                        color={activeTab === 'pay' ? 'pink.500' : 'gray.400'}
                                        cursor="pointer"
                                        onClick={() => !covered ? setActiveTab('pay') : toast({
                                            title: "You are fully covered",
                                            description: "Use the Bonus tab to pay.",
                                            status: "info",
                                            duration: 5000,
                                            isClosable: true,
                                        })}
                                    >
                                        Pay
                                    </Text>
                                    <Flex
                                        align="center"
                                        cursor="pointer"
                                        onClick={() => covered ? setActiveTab('custom') : console.log("Can't click.")}
                                        borderRadius="full"

                                        onMouseEnter={() => setIsHovering(true)}
                                        onMouseLeave={() => setIsHovering(false)}
                                    >
                                        <Text
                                            ml={3}
                                            fontSize="md"
                                            fontWeight={activeTab === 'custom' ? 'bold' : 'normal'}
                                            color={activeTab === 'custom' ? 'pink.500' : 'gray.400'}
                                        >
                                            Pay +
                                        </Text>
                                        {!covered && (
                                            <IconButton
                                                aria-label="Locked feature"
                                                icon={<FaLock/>}
                                                variant="ghost"
                                                isRound
                                                size="sm"
                                                onClick={handleLockClick}
                                                color={isHovering ? "gold" : "gray.400"}
                                            />
                                        )}
                                    </Flex>

                                    <Text
                                        fontSize="md"
                                        ml={2}
                                        fontWeight={activeTab === 'claim' ? 'bold' : 'normal'}
                                        color={activeTab === 'claim' ? 'pink.500' : 'gray.400'}
                                        cursor="pointer"
                                        onClick={() => setActiveTab('claim')}
                                    >
                                        Claim
                                    </Text>

                                </Flex>
                            </Box>
                            <ModalCloseButton position="absolute" right="4" top="4"/>
                        </Flex>
                    </ModalHeader>
                    <ModalBody>
                        {
                            activeTab == "pay" && (
                                <>
                                    <FormControl>
                                        <FormLabel htmlFor="premium-amount" color="white">You pay</FormLabel>
                                        <Input
                                            id="premium-amount"
                                            placeholder="Premium amount"
                                            color="white"
                                            defaultValue={calculatedPremium ? ethers.utils.formatEther(calculatedPremium) : "0.0"}
                                            onChange={handlePremiumInput}
                                            type="number"
                                            min={calculatedPremium ? ethers.utils.formatEther(calculatedPremium) : "0.0"}
                                            focusBorderColor="pink.400"
                                            fontSize="xl" // Set the font size to extra large
                                        />
                                    </FormControl>
                                    <FormControl mt={4}>
                                        <FormLabel htmlFor="premium-investment" color="white">Amount to investment fund
                                            <Text fontSize="sm" color="gray.400">
                                                {ethers.utils.formatUnits(investmentPercentage, 0)}% of your premium
                                            </Text>
                                        </FormLabel>
                                        <Stat>
                                            <StatNumber fontSize="xl" color="white">
                                                {ethers.utils.formatEther(premiumInvestment) ? ethers.utils.formatEther(premiumInvestment) : '0.0'}
                                                <Icon as={FaEthereum} color="white"/>
                                            </StatNumber>
                                        </Stat>
                                    </FormControl>
                                    <FormControl mt={4}>
                                        <FormLabel htmlFor="coverage-amount" color="white">
                                            Amount to coverage fund
                                            <Text fontSize="sm" color="gray.400">
                                                {ethers.utils.formatUnits(coveragePercentage, 0)}% of your premium
                                            </Text></FormLabel>
                                        <Stat>
                                            <StatNumber fontSize="xl" color="white">
                                                {premiumCoverage ? ethers.utils.formatEther(premiumCoverage) : '0.0'}
                                                <Icon as={FaEthereum} color="white"/>
                                            </StatNumber>
                                        </Stat>
                                    </FormControl>
                                    <FormControl mt={4}>
                                        {potentiallyCovered ? (
                                            <FormLabel htmlFor="coverage-amount" color="green">You will be fully
                                                covered</FormLabel>
                                        ) : (
                                            <FormLabel htmlFor="coverage-amount" color="white">You will receive in
                                                coverage</FormLabel>
                                        )}
                                        <Stat>
                                            <StatNumber fontSize="xl" color="white">
                                                {ethers.utils.parseEther(potentialCoverage).gt(policyCoverageAmount) ? ethers.utils.formatEther(policyCoverageAmount) : potentialCoverage}
                                                <Icon as={FaEthereum} color="white"/>
                                            </StatNumber>
                                        </Stat>
                                    </FormControl>
                                    <FormControl mt={4}>
                                        <FormLabel htmlFor="bonus-coverage"
                                                   color={bonusCoverage.gte(policyCoverageAmount) ? "green" : "white"}>
                                            {bonusCoverage.gte(policyCoverageAmount) ? "Maximum bonus coverage reached " : "Bonus coverage "}
                                            <Tooltip
                                                label="Extra coverage from additional premiums paid beyond the policy coverage amount.">
                                                <InfoOutlineIcon/>
                                            </Tooltip>
                                        </FormLabel>
                                        <Stat>
                                            <StatNumber fontSize="xl" color="white">
                                                {potentiallyCovered ? ethers.utils.formatEther(bonusCoverage) : '0.0'}
                                                <Icon as={FaEthereum} color="white"/>
                                            </StatNumber>
                                        </Stat>
                                    </FormControl>
                                </>
                            )}

                        {activeTab == "custom" && (
                            <>
                                <FormControl>
                                    <FormLabel htmlFor="premium-amount" color="white">You pay</FormLabel>
                                    <Input
                                        id="premium-amount"
                                        placeholder="Premium amount"
                                        color="white"
                                        defaultValue={customPremiumAmountToSend ? ethers.utils.formatEther(customPremiumAmountToSend) : "0.0"}
                                        onChange={(e) => {
                                            const value = e.target.value.trim(); // Trim whitespace
                                            if (value === '' || parseFloat(value) <= 0) {
                                                setCustomPremiumAmountToSend(BigNumber.from(0));
                                            } else {
                                                try {
                                                    const parsedValue = ethers.utils.parseEther(value);
                                                    setCustomPremiumAmountToSend(parsedValue);
                                                } catch (error) {
                                                    // Handle the error for invalid input values that cannot be parsed to BigNumber
                                                    console.error('Invalid input for premium amount');
                                                }
                                            }
                                        }}
                                        type="number"
                                        min={calculatedPremium ? ethers.utils.formatEther(calculatedPremium) : "0.0"}
                                        focusBorderColor="pink.400"
                                        fontSize="xl" // Set the font size to extra large
                                    />
                                </FormControl>
                                <FormControl mt={4}>
                                    <FormLabel htmlFor="investment-percentage" color="white">Investment Fund Percentage</FormLabel>
                                    <NumberInput
                                        id="investment-percentage"
                                        color="white"
                                        focusBorderColor="pink.400"
                                        defaultValue={totalCoverage >= totalCoverage.mul(2) ? investmentPercentagePremium : 100}
                                        min={0}
                                        max={100}
                                        onChange={handleInvestmentPercentageChange}
                                    >
                                        <NumberInputField/>
                                        <NumberInputStepper>
                                            <NumberIncrementStepper/>
                                            <NumberDecrementStepper/>
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>
                                <FormControl mt={4}>
                                    <FormLabel htmlFor="coverage-percentage" color="white">Coverage Fund
                                        Percentage</FormLabel>
                                    <NumberInput
                                        color="white"
                                        focusBorderColor="pink.400"
                                        id="coverage-percentage"
                                        value={coveragePercentagePremium}
                                        min={0}
                                        max={100}
                                    >
                                        <NumberInputField
                                            isReadOnly/>
                                        <NumberInputStepper>
                                            <NumberIncrementStepper isDisabled/>
                                            <NumberDecrementStepper isDisabled/>
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>
                                <FormControl mt={4}>
                                    <FormLabel htmlFor="premium-investment" color="white">Amount to investment fund
                                        <Text fontSize="sm" color="gray.500">
                                            {ethers.utils.formatUnits(investmentPercentagePremium, 0)}% of your premium
                                        </Text>
                                    </FormLabel>
                                    <Stat>
                                        <StatNumber fontSize="xl" color="white">
                                            {ethers.utils.formatEther(readableInvestmentAmount) ? ethers.utils.formatEther(readableInvestmentAmount) : '0.0'}
                                            <Icon as={FaEthereum} color="white"/>
                                        </StatNumber>
                                    </Stat>
                                </FormControl>
                                <FormControl mt={4}>
                                    <FormLabel htmlFor="premium-coverage" color="white">Amount to coverage fund
                                        <Text fontSize="sm" color="gray.500">
                                            {ethers.utils.formatUnits(coveragePercentagePremium, 0)}% of your premium
                                        </Text>
                                    </FormLabel>
                                    <Stat>
                                        <StatNumber fontSize="xl" color="white">
                                            {ethers.utils.formatEther(readableCoverageAmount) ? ethers.utils.formatEther(readableCoverageAmount) : '0.0'}
                                            <Icon as={FaEthereum} color="white"/>
                                        </StatNumber>
                                    </Stat>
                                </FormControl>
                            </>
                        )}
                        {activeTab == "claim" && (
                            <>
                                <FormControl mt={4}>
                                    <FormLabel htmlFor="premium-coverage" color="white">
                                        Coverage to claim
                                    </FormLabel>
                                    <Stat>
                                        <StatNumber fontSize="xl" color="white">
                                            {ethers.utils.formatEther(totalCoverage) ? ethers.utils.formatEther(totalCoverage) : '0.0'}
                                            <Icon as={FaEthereum} color="white"/>
                                        </StatNumber>
                                    </Stat>

                                </FormControl>
                                <FormControl mt={4}>
                                    <FormLabel htmlFor="premium-coverage" color="white">
                                        Rewards to claim
                                    </FormLabel>
                                    <Stat>
                                        <StatNumber fontSize="xl" color="white">
                                            {ethers.utils.formatEther(claimableRewards) ? ethers.utils.formatEther(claimableRewards) : '0.0'}
                                            <Icon as={FaEthereum} color="white"/>
                                        </StatNumber>
                                    </Stat>

                                </FormControl>
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        {
                            activeTab == "pay" && (
                                <>
                                    <Button variant="ghost" color="white" mr={3} onClick={onClose}>
                                        Close
                                    </Button>
                                    <Button
                                        colorScheme="pink"
                                        onClick={() => handlePayPremium(policyId, premiumAmountToSend)}
                                    >
                                        Pay Premium
                                    </Button>
                                </>
                            )
                        }
                        {
                            activeTab == "custom" && (
                                <>
                                    <Button variant="ghost" color="white" mr={3} onClick={onClose}>
                                        Close
                                    </Button>
                                    <Button
                                        colorScheme="pink"
                                        onClick={() => handlePayCustomPremium()}
                                    >
                                        Pay Bonus
                                    </Button>
                                </>
                            )
                        }
                        {
                            activeTab == "claim" && (
                                <>
                                    <Button variant="ghost" color="white" mr={3} onClick={onClose}>
                                        Close
                                    </Button>
                                    <Button
                                        variant="outline"
                                        colorScheme="pink"
                                        mr={3}
                                        onClick={handleWithdrawRewards}
                                    >
                                        Claim Rewards
                                    </Button>
                                    <Button
                                        colorScheme="pink"
                                        onClick={() => handleClaim(policyId)}
                                    >
                                        Claim Coverage
                                    </Button>
                                </>
                            )
                        }

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
};

export default PayPremiumModal;