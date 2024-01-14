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

const ManagePremiumModal = ({calculatedPremium, potentialCoverage, premiumAmountToSend, handlePremiumInput, handlePayPremium, policyId, covered, premiumCoverage, premiumInvestment, bonusCoverage, policyCoverageAmount, investmentPercentage, coveragePercentage}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [bonusCover, setBonusCoverage] = useState<BigNumber>(BigNumber.from(0));
    const [activeTab, setActiveTab] = useState('pay');
    const [isHovering, setIsHovering] = useState(false);
    const [investmentPercentagePremium, setInvestmentPercentagePremium] = useState(50); // Default to 50%
    const [coveragePercentagePremium, setCoveragePercentagePremium] = useState(50); // Default to 50%
    const [readableCoverageAmount, setReadableCoverageAmount] = useState<BigNumber>(BigNumber.from(0));
    const [readableInvestmentAmount, setReadableInvestmentAmount] = useState<BigNumber>(BigNumber.from(0));
    const [customPremiumAmountToSend, setCustomPremiumAmountToSend] = useState<BigNumber>(BigNumber.from(0));
    const toast = useToast();
    const handleInvestmentPercentageChange = (value) => setInvestmentPercentagePremium(value);
    const handleCoveragePercentageChange = (value) => setCoveragePercentagePremium(value);


    useEffect(() => {
        if (bonusCoverage) {
            const _bonusCoverage = bonusCoverage.sub(policyCoverageAmount);
            setBonusCoverage(_bonusCoverage);
        }
        if (premiumAmountToSend) {
            const _coverageBigNumber = (customPremiumAmountToSend.mul(BigNumber.from(coveragePercentagePremium))).div(BigNumber.from(100));
            setReadableCoverageAmount(_coverageBigNumber);

            const _investmentBigNumber = (customPremiumAmountToSend.mul(BigNumber.from(investmentPercentagePremium))).div(BigNumber.from(100));
            setReadableInvestmentAmount(_investmentBigNumber)
        }
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
                                        fontWeight={activeTab === 'pay' ? 'bold' : 'normal'}
                                        mr={4}
                                        cursor="pointer"
                                        onClick={() => setActiveTab('pay')}
                                    >
                                        Pay Premium
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
                                            Custom Pay Premium
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
                                        onChange={(e) => setCustomPremiumAmountToSend(ethers.utils.parseEther(e.target.value))}
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
                                        isDisabled={true}
                                        defaultValue={100 - investmentPercentagePremium}
                                        value={100 - investmentPercentagePremium}
                                        min={0}
                                        max={100}
                                        onChange={handleCoveragePercentageChange}
                                    >
                                        <NumberInputField/>
                                        <NumberInputStepper>
                                            <NumberIncrementStepper/>
                                            <NumberDecrementStepper/>
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