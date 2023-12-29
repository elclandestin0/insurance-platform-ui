// components/PolicyDetailsModal.tsx
import React from 'react';
import {
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Text,
} from '@chakra-ui/react';

import usePolicyContract from '@/hooks/usePolicyContract';

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
    selectedPolicy: Policy | null; // selectedPolicy can be a Policy object or null
}

const PolicyDetailsModal: React.FC<PolicyDetailsModalProps> = ({ isOpen, onClose, selectedPolicy }) => {
    const { checkPolicyOwnership } = usePolicyContract();
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent borderRadius="10px" bg="#f7fafc">
                <ModalHeader fontSize="lg" fontWeight="bold" textAlign="center" bg="#3182ce" color="#ffffff" borderTopRadius="10px">
                    Policy Details
                </ModalHeader>
                <ModalCloseButton color="#ffffff" />
                <ModalBody p={6}>
                    {selectedPolicy && (
                        <Box>
                            <Text fontSize="md" mb={2}>
                                <Text as="span" fontWeight="bold">Coverage Amount:</Text> {selectedPolicy.coverageAmount}
                            </Text>
                            <Text fontSize="md" mb={2}>
                                <Text as="span" fontWeight="bold">Initial Premium Fee:</Text> {selectedPolicy.initialPremiumFee}
                            </Text>
                            <Text fontSize="md" mb={2}>
                                <Text as="span" fontWeight="bold">Initial Coverage Percentage:</Text> {selectedPolicy.initialCoveragePercentage}
                            </Text>
                            <Text fontSize="md" mb={2}>
                                <Text as="span" fontWeight="bold">Premium Rate:</Text> {selectedPolicy.premiumRate}
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
                        </Box>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default PolicyDetailsModal;
