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

const ManagePremiumModal = ({
                                calculatedPremium,
                                potentialCoverage,
                                premiumAmountToSend,
                                handlePremiumInput,
                                handlePayPremium,
                                policyId,
                                covered,
                                premiumCoverage,
                                premiumInvestment,
                                bonusCoverage,
                                policyCoverageAmount,
                                investmentPercentage,
                                coveragePercentage
                            }) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [bonusCover, setBonusCoverage] = useState<BigNumber>(BigNumber.from(0));
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
        if (bonusCoverage) {
            const _bonusCoverage = bonusCoverage.sub(policyCoverageAmount);
            setBonusCoverage(_bonusCoverage);
        }

        premiumAmountToSend ? setReadableCoverageAmount((customPremiumAmountToSend.mul(BigNumber.from(coveragePercentagePremium))).div(BigNumber.from(100))) : setReadableCoverageAmount(BigNumber.from(0));
        premiumAmountToSend ? setReadableInvestmentAmount((customPremiumAmountToSend.mul(BigNumber.from(investmentPercentagePremium))).div(BigNumber.from(100))) : setReadableCoverageAmount(BigNumber.from(0));

    }, [bonusCoverage, investmentPercentagePremium, customPremiumAmountToSend]);

    const handleLockClick = () => {
        // Assuming you have a state or prop that tells you if the user is fully covered
        // Let's say `isFullyCovered` is a boolean that is `true` when the user is fully covered
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
            <Button onClick={onOpen} colorScheme="pink" size="md">Pay</Button>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay/>
                <ModalContent borderRadius="xl" backgroundColor="white" p={4}>
                    <ModalHeader color="gray.700" fontSize="lg">
                        <Flex direction="row" justify="space-between" align="center">
                            <Box>
                                <Flex direction="row" align="center">
                                    <Text
                                        fontSize="md"
                                        fontWeight={'bold'}
                                        mr={4}
                                        cursor="pointer"
                                        onClick={() => setActiveTab('pay')}
                                    >
                                        Pay
                                    </Text>

                                    <Flex
                                        align="center"
                                        cursor="pointer"
                                        onClick={() => covered ? setActiveTab('custom') : console.log("Can't click.")}
                                        borderRadius="full"
                                        p={1}
                                        onMouseEnter={() => setIsHovering(true)} // Set hover state to true when mouse enters
                                        onMouseLeave={() => setIsHovering(false)} // Set hover state to false when mouse leaves
                                    >
                                        <Text
                                            ml={3}
                                            fontSize="md"
                                            fontWeight="bold"
                                            color={activeTab === 'gold' || isHovering ? 'gold' : 'gray.400'} // Change color when hovering
                                        >
                                            Bonus
                                        </Text>
                                        <IconButton
                                            aria-label="Locked feature"
                                            icon={<FaLock/>}
                                            variant="ghost"
                                            isRound
                                            size="sm"
                                            ml={1}
                                            onClick={handleLockClick}
                                            color={isHovering ? "gold" : "gray.400"}
                                        />
                                    </Flex>
                                    <Text
                                        fontSize="md"
                                        fontWeight="bold"
                                        ml={4}
                                        cursor="pointer"
                                        color={isHovering ? "black" : "gray.400"}
                                        onClick={() => setActiveTab('claim')}
                                    >
                                        Claim
                                    </Text>
                                </Flex>
                            </Box>
                            <ModalCloseButton position="absolute" right="4" top="4"/>
                        </Flex>
                    </ModalHeader>
                    {
                        activeTab == "pay" && (
                            <ModalBody>
                                <FormControl>
                                    <FormLabel htmlFor="premium-amount" color="gray.600">You pay</FormLabel>
                                    <Input
                                        id="premium-amount"
                                        placeholder="Premium amount"
                                        defaultValue={calculatedPremium ? ethers.utils.formatEther(calculatedPremium) : "0.0"}
                                        onChange={handlePremiumInput}
                                        type="number"
                                        min={calculatedPremium ? ethers.utils.formatEther(calculatedPremium) : "0.0"}
                                        focusBorderColor="pink.400"
                                        fontSize="xl" // Set the font size to extra large
                                    />
                                </FormControl>
                                <FormControl mt={4}>
                                    <FormLabel htmlFor="premium-investment" color="gray.600">Amount to investment fund
                                        <Text fontSize="sm" color="gray.500">
                                            {ethers.utils.formatUnits(investmentPercentage, 0)}% of your premium
                                        </Text>
                                    </FormLabel>
                                    <Stat>
                                        <StatNumber fontSize="xl" color="gray.600">
                                            {ethers.utils.formatEther(premiumInvestment) ? ethers.utils.formatEther(premiumInvestment) : '0.0'}
                                            <Icon as={FaEthereum} color="gray.700"/>
                                        </StatNumber>
                                    </Stat>
                                </FormControl>
                                <FormControl mt={4}>
                                    <FormLabel htmlFor="coverage-amount" color="gray.600">
                                        Amount to coverage fund
                                        <Text fontSize="sm" color="gray.500">
                                            {ethers.utils.formatUnits(coveragePercentage, 0)}% of your premium
                                        </Text></FormLabel>
                                    <Stat>
                                        <StatNumber fontSize="xl" color="gray.600">
                                            {ethers.utils.formatEther(premiumCoverage) ? ethers.utils.formatEther(premiumCoverage) : '0.0'}
                                            <Icon as={FaEthereum} color="gray.700"/>
                                        </StatNumber>
                                    </Stat>
                                </FormControl>
                                <FormControl mt={4}>
                                    {covered ? (
                                        <FormLabel htmlFor="coverage-amount" color="green">You will be fully
                                            covered</FormLabel>
                                    ) : (
                                        <FormLabel htmlFor="coverage-amount" color="gray.600">You will receive in
                                            coverage</FormLabel>
                                    )}
                                    <Stat>
                                        <StatNumber fontSize="xl" color="gray.600">
                                            {potentialCoverage ? ethers.utils.formatEther(policyCoverageAmount) : ethers.utils.formatEther(potentialCoverage)}
                                            <Icon as={FaEthereum} color="gray.700"/>
                                        </StatNumber>
                                    </Stat>
                                </FormControl>
                                <FormControl mt={4}>
                                    <FormLabel htmlFor="bonus-coverage" color="gray.600">Bonus coverage <Tooltip
                                        label="Extra coverage from additional premiums paid beyond the policy coverage amount.">
                                        <InfoOutlineIcon/>
                                    </Tooltip>
                                    </FormLabel>
                                    <Stat>
                                        <StatNumber fontSize="xl" color="gray.600">
                                            {potentialCoverage ? ethers.utils.formatEther(bonusCover) : ethers.utils.formatEther(bonusCover)}
                                            <Icon as={FaEthereum} color="gray.700"/>
                                        </StatNumber>
                                    </Stat>
                                </FormControl>
                            </ModalBody>
                        )}

                    <ModalBody>
                        {activeTab == "custom" && (
                            <>
                                <FormControl>
                                    <FormLabel htmlFor="premium-amount" color="gray.600">You pay</FormLabel>
                                    <Input
                                        id="premium-amount"
                                        placeholder="Premium amount"
                                        defaultValue={premiumAmountToSend ? ethers.utils.formatEther(customPremiumAmountToSend) : "0.0"}
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
                                    <FormLabel htmlFor="investment-percentage">Investment Fund Percentage</FormLabel>
                                    <NumberInput
                                        id="investment-percentage"
                                        defaultValue={investmentPercentagePremium}
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
                                    <FormLabel htmlFor="coverage-percentage">Coverage Fund Percentage</FormLabel>
                                    <NumberInput
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
                                    <FormLabel htmlFor="premium-investment" color="gray.600">Amount to investment fund
                                        <Text fontSize="sm" color="gray.500">
                                            {ethers.utils.formatUnits(investmentPercentagePremium, 0)}% of your premium
                                        </Text>
                                    </FormLabel>
                                    <Stat>
                                        <StatNumber fontSize="xl" color="gray.600">
                                            {ethers.utils.formatEther(readableInvestmentAmount) ? ethers.utils.formatEther(readableInvestmentAmount) : '0.0'}
                                            <Icon as={FaEthereum} color="gray.700"/>
                                        </StatNumber>
                                    </Stat>
                                </FormControl>
                                <FormControl mt={4}>
                                    <FormLabel htmlFor="premium-coverage" color="gray.600">Amount to coverage fund
                                        <Text fontSize="sm" color="gray.500">
                                            {ethers.utils.formatUnits(coveragePercentagePremium, 0)}% of your premium
                                        </Text>
                                    </FormLabel>
                                    <Stat>
                                        <StatNumber fontSize="xl" color="gray.600">
                                            {ethers.utils.formatEther(readableCoverageAmount) ? ethers.utils.formatEther(readableCoverageAmount) : '0.0'}
                                            <Icon as={FaEthereum} color="gray.700"/>
                                        </StatNumber>
                                    </Stat>
                                </FormControl>
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button
                            colorScheme="pink"
                            onClick={() => handlePayPremium(policyId, premiumAmountToSend)}
                        >
                            Pay Premium
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
        ;
};

export default ManagePremiumModal;