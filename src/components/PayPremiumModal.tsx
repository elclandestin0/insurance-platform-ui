import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Stat,
    Tooltip,
    Text,
    StatLabel,
    StatNumber,
    Icon,
    FormControl,
    FormLabel,
    useDisclosure,
} from '@chakra-ui/react';
import {FaEthereum} from 'react-icons/fa';
import {BigNumber, ethers} from 'ethers';
import {useEffect, useState} from "react";
import {InfoOutlineIcon} from '@chakra-ui/icons';

const ManagePremiumModal = ({calculatedPremium, potentialCoverage, premiumAmountToSend, handlePremiumInput, handlePayPremium, policyId, covered, premiumCoverage, premiumInvestment, bonusCoverage, policyCoverageAmount, investmentPercentage, coveragePercentage}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [bonusCover, setBonusCoverage] = useState<BigNumber>(BigNumber.from(0));

    useEffect(() => {
        if (bonusCoverage) {
            const _bonusCoverage = bonusCoverage.sub(policyCoverageAmount);
            setBonusCoverage(_bonusCoverage);
        }
    }, [bonusCoverage]);

    return (
        <>
            <Button onClick={onOpen} colorScheme="pink" size="md">Pay</Button>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay/>
                <ModalContent borderRadius="xl" backgroundColor="white" p={4}>
                    <ModalHeader color="gray.700" fontSize="lg">Pay Premium</ModalHeader>
                    <ModalCloseButton/>
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
                                <FormLabel htmlFor="coverage-amount" color="green">You will be fully covered</FormLabel>
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
                                    {potentialCoverage ? ethers.utils.formatEther(bonusCover) : ethers.utils.formatEther(bonusCover) }
                                    <Icon as={FaEthereum} color="gray.700"/>
                                </StatNumber>
                            </Stat>
                        </FormControl>
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
    );
};

export default ManagePremiumModal;