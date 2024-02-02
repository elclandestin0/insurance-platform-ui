import React from 'react';
import {Button, Flex, Divider, Text, Icon} from '@chakra-ui/react';
import {FaEthereum} from 'react-icons/fa';
import {useRouter} from 'next/router'; // Import useRouter

const PolicyViewCTA = ({isOwner, initialPremium, policyId, onPayPremium}) => {
    const buttonBgColor = isOwner ? 'blue.500' : 'purple.500';
    const buttonHoverColor = isOwner ? 'blue.600' : 'purple.600';
    const router = useRouter(); // Initialize useRouter

    const handleButtonClick = () => {
        if (isOwner) {
            router.push(`/policy-manager?policyId=${policyId}`);
        } else {
            onPayPremium(policyId);
        }
    };

    return (
        <Button
            colorScheme="pink"
            p={4}
            onClick={handleButtonClick}
        >
            <Flex direction="row" align="center" justify="center" width="100%">
                {isOwner ? (
                    <Text>Manage Your Policy</Text>
                ) : (
                    <>
                        <Text>Subscribe</Text>
                        <Divider orientation="vertical" height="20px" mx={2} borderColor="currentcolor"/>
                        <Text fontSize="md" fontWeight="bold">{initialPremium}</Text>
                        <Icon as={FaEthereum} ml={1} color="currentcolor"/>
                    </>
                )}
            </Flex>
        </Button>
    );
};

export default PolicyViewCTA;
