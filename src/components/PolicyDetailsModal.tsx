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
    Text, Divider,
} from '@chakra-ui/react';

import usePolicyContract from '@/hooks/usePolicyContract';
import {useMetaMask} from "@/contexts/MetaMaskContext";
import PolicyViewCTA from "@/components/PolicyViewCTA";
import {ethers} from "ethers";

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
}

const PolicyDetailsModal: React.FC<PolicyDetailsModalProps> = ({ isOpen, onClose, selectedPolicy, checkOwnership}) => {
    const { payInitialPremium } = usePolicyContract();
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

    const handlePayPremium = async (id, amount) => {
        await payInitialPremium(id, amount);
    };
    

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent borderRadius="10px" bg="#FDF6EC">
                <ModalHeader fontSize="lg" fontWeight="bold" textAlign="center" bg="#3182ce" color="#ffffff" borderTopRadius="10px">
                    Policy Details
                </ModalHeader>
                <ModalCloseButton color="#ffffff" />
                <ModalBody p={6}>
                    {selectedPolicy && (
                        <Box>
                            <Text fontSize="md" mb={2}>
                                <Text as="span" fontWeight="bold">Coverage Amount:</Text> {ethers.utils.formatEther(selectedPolicy.coverageAmount)}
                            </Text>
                            <Text fontSize="md" mb={2}>
                                <Text as="span" fontWeight="bold">Initial Coverage Percentage:</Text> {selectedPolicy.initialCoveragePercentage}
                            </Text>
                            <Text fontSize="md" mb={2}>
                                <Text as="span" fontWeight="bold">Premium Rate:</Text> {ethers.utils.formatEther(selectedPolicy.premiumRate)}
                            </Text>
                            <Text fontSize="md" mb={2}>
                                <Text as="span" fontWeight="bold">Duration:</Text> {selectedPolicy.duration} days
                            </Text>
                            <Text fontSize="md" mb={2}>
                                <Text as="span" fontWeight="bold">Penalty Rate:</Text> {selectedPolicy.penaltyRate}
                            </Text>
                            <Text fontSize="md" mb={2}>
                                <Text as="span" fontWeight="bold">Months Grace Period:</Text> {selectedPolicy.monthsGracePeriod}
                            </Text>
                            <Divider my={3}/>
                            <PolicyViewCTA
                                isOwner={isOwner}
                                initialPremium={selectedPolicy ? ethers.utils.formatEther(selectedPolicy.initialPremiumFee) : '0'}
                                policyId={selectedPolicy.id}
                                onPayPremium={handlePayPremium}
                            />
                        </Box>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default PolicyDetailsModal;
