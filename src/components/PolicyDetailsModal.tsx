// components/PolicyDetailsModal.tsx
import React, {useEffect, useState} from 'react';
import {
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Text, Divider, Grid, Stat, StatLabel, StatNumber, Icon, Flex,
} from '@chakra-ui/react';

import usePolicyContract from '@/hooks/usePolicyContract';
import {useMetaMask} from "@/contexts/MetaMaskContext";
import PolicyViewCTA from "@/components/PolicyViewCTA";
import {ethers} from "ethers";
import {FaEthereum} from "react-icons/fa";
import {convertEpochToReadableDate} from "@/utils/helpers";

// Define the structure of a single policy
interface Policy {
    id: number;
    coverageAmount: string;
    initialPremiumFee: string;
    initialCoveragePercentage: string;
    premiumRate: string;
    duration: number;
    penaltyRate: number;
    monthsGracePeriod: number;
}

// Define the props for the PolicyDetailsModal component
interface PolicyDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedPolicy: Policy | null;
    checkOwnership: (policyId: number, accountAddress: String) => Promise<boolean>;
    viewOnly: boolean;
}

const PolicyDetailsModal: React.FC<PolicyDetailsModalProps> = ({isOpen, onClose, selectedPolicy, checkOwnership, viewOnly}) => {
    const {payInitialPremium} = usePolicyContract();
    const [isOwner, setIsOwner] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const {account} = useMetaMask();

    useEffect(() => {
        const checkOwnershipStatus = async () => {
            if (account && selectedPolicy) {
                setIsLoading(true);
                try {
                    const ownershipStatus = await checkOwnership(selectedPolicy.id, account);
                    setIsOwner(ownershipStatus);
                } catch (error) {
                    console.error('Error checking policy ownership:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        checkOwnershipStatus();
    }, [selectedPolicy, account]);

    const handlePayPremium = async (id) => {
        await payInitialPremium(id);
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay/>
            <ModalContent borderRadius="xl" backgroundColor="white" p={4}>
                <ModalHeader color="black" fontSize="lg" fontWeight="bold" textAlign="center"
                             borderTopRadius="10px">
                    Policy Details
                </ModalHeader>
                <ModalCloseButton color="black"/>
                <ModalBody p={6}>
                    {selectedPolicy && (
                        <Box>
                            <Grid templateColumns={{sm: '1fr', md: '1fr 1fr', lg: 'repeat(3, 1fr)'}} gap={6}>
                                <Stat>
                                    <StatLabel>Coverage Amount</StatLabel>
                                    <StatNumber>{ethers.utils.formatEther(selectedPolicy.coverageAmount)} <Icon
                                        as={FaEthereum} color="currentcolor"/></StatNumber>
                                </Stat>
                                <Stat>
                                    <StatLabel>Initial Premium Fee</StatLabel>
                                    <StatNumber>{ethers.utils.formatEther(selectedPolicy.initialPremiumFee)} <Icon
                                        as={FaEthereum}
                                        color="currentcolor"/></StatNumber>
                                </Stat>
                                <Stat>
                                    <StatLabel>Initial Coverage Percentage</StatLabel>
                                    <StatNumber>{selectedPolicy.initialCoveragePercentage}%</StatNumber>
                                </Stat>
                                <Stat>
                                    <StatLabel>Premium Rate</StatLabel>
                                    <StatNumber>{ethers.utils.formatEther(selectedPolicy.premiumRate)} <Icon
                                        as={FaEthereum}
                                        ml={1}
                                        color="currentcolor"/></StatNumber>
                                </Stat>
                                <Stat>
                                    <StatLabel>Duration</StatLabel>
                                    <StatNumber>{selectedPolicy.duration} days</StatNumber>
                                </Stat>
                                <Stat>
                                    <StatLabel>Penalty Rate</StatLabel>
                                    <StatNumber>{selectedPolicy.penaltyRate}%</StatNumber>
                                </Stat>
                                <Stat>
                                    <StatLabel>Months Grace Period</StatLabel>
                                    <StatNumber>{selectedPolicy.monthsGracePeriod}</StatNumber>
                                </Stat>
                            </Grid>
                            {
                                !viewOnly &&
                                <Flex justifyContent="flex-end" mt={4}>
                                    <PolicyViewCTA
                                        isOwner={isOwner}
                                        initialPremium={selectedPolicy ? ethers.utils.formatEther(selectedPolicy.initialPremiumFee) : '0'}
                                        policyId={selectedPolicy.id}
                                        onPayPremium={handlePayPremium}
                                    />
                                </Flex>
                            }
                            <>

                            </>
                        </Box>

                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default PolicyDetailsModal;
