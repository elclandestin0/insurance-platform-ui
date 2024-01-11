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
    StatLabel,
    StatNumber,
    Icon,
    FormControl,
    FormLabel,
    useDisclosure,
} from '@chakra-ui/react';
import {FaEthereum} from 'react-icons/fa';
import {ethers} from 'ethers';

const ManagePremiumModal = ({calculatedPremium, potentialCoverage, premiumAmountToSend, handlePremiumInput, handlePayPremium, policyId, covered, premiumCoverage, premiumInvestment}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
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
                            />
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
                                    {potentialCoverage ? potentialCoverage : '0.0'}
                                    <Icon as={FaEthereum} color="gray.700"/>
                                </StatNumber>
                            </Stat>
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel htmlFor="coverage-amount" color="gray.600">Premium coverage</FormLabel>
                            <Stat>
                                <StatNumber fontSize="xl" color="gray.600">
                                    {ethers.utils.formatEther(premiumCoverage) ? ethers.utils.formatEther(premiumCoverage) : '0.0'}
                                    <Icon as={FaEthereum} color="gray.700"/>
                                </StatNumber>
                            </Stat>
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel htmlFor="coverage-amount" color="gray.600">Premium investment</FormLabel>
                            <Stat>
                                <StatNumber fontSize="xl" color="gray.600">
                                    {ethers.utils.formatEther(premiumInvestment) ? ethers.utils.formatEther(premiumInvestment) : '0.0'}
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