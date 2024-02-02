import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    Flex,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
    useToast, Stat, StatNumber, Icon, StatLabel, FormHelperText
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import {BigNumber, ethers} from "ethers";
import usePolicyContract from "@/hooks/usePolicyContract";
import {FaEthereum} from "react-icons/fa";


const DeFiStakingModal = ({investmentBalance, policyId}) => {
    const [selectedPool, setSelectedPool] = useState('');
    const [amountToStake, setAmountToStake] = useState('');
    const {investInAavePool} = usePolicyContract();
    const [activeTab, setActiveTab] = useState('pay');
    const toast = useToast();
    const [investmentAmount, setInvestmentAmount] = useState<BigNumber>(BigNumber.from(0));
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [refreshData, setRefreshData] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        console.log(ethers.utils.formatEther(investmentAmount));
    }, [refreshData]);

    const handleInvestmentInput = async (e: any) => {
        const inputValue = e.target.value.trim();
        let numericValue = parseFloat(inputValue);

        // Ensure the input is not less than zero
        if (numericValue < 0) {
            numericValue = 0;
        }

        // Ensure the input does not exceed the maximum balance
        if (investmentBalance && numericValue > parseFloat(ethers.utils.formatEther(investmentBalance))) {
            numericValue = parseFloat(ethers.utils.formatEther(investmentBalance));
        }

        try {
            const inputAmount = ethers.utils.parseEther(numericValue.toString());
            setInvestmentAmount(inputAmount);
            setRefreshData(prev => !prev);
        } catch (error) {
            console.error('Error parsing investment amount:', error);
        }
    };

    const handleSupplyToAavePool = async () => {
        await investInAavePool(policyId, investmentAmount);
    }

    return (
        <>
            <Button onClick={onOpen} colorScheme="pink" size="md">Supply to Aave Pool</Button>
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
                                        color={activeTab === 'pay' ? 'white' : 'gray.400'}
                                        cursor="pointer"
                                    >
                                        Invest
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
                                    <Stat color="white">
                                        <StatLabel>Investment fund</StatLabel>
                                        <StatNumber> {investmentBalance.gt(BigNumber.from(0)) ? ethers.utils.formatUnits(investmentBalance) : "0.0"}
                                            <Icon as={FaEthereum} color="currentcolor"/></StatNumber>
                                    </Stat>
                                    <FormControl mt={4}>
                                        <FormLabel htmlFor="premium-amount" color="white">You pay</FormLabel>
                                        <Input
                                            id="premium-amount"
                                            color="white"
                                            placeholder="Premium amount"
                                            defaultValue={investmentBalance ? ethers.utils.formatEther(investmentBalance) : "0.0"}
                                            onChange={handleInvestmentInput}
                                            type="number"
                                            min={0}
                                            max={investmentBalance ? ethers.utils.formatEther(investmentBalance) : "0.0"}
                                            focusBorderColor="pink.400"
                                            fontSize="xl" // Set the font size to extra large
                                        />
                                    </FormControl>
                                </>
                            )}
                    </ModalBody>
                    <ModalFooter>
                        {
                            activeTab == "pay" && (
                                <>
                                    <Button variant="ghost" colorScheme="blue" mr={3} onClick={onClose}>
                                        Close
                                    </Button>
                                    <Button
                                        colorScheme="pink"
                                        onClick={() => handleSupplyToAavePool(policyId, investmentAmount)}
                                    >
                                        Supply Aave pool
                                    </Button>
                                </>
                            )
                        }
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default DeFiStakingModal;