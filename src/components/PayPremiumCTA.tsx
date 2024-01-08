import React from 'react';
import { Button, Flex, Divider, Text, Icon } from '@chakra-ui/react';
import { FaEthereum } from 'react-icons/fa';
import { ethers } from 'ethers';

const PayPremiumCTA = ({ premiumAmountToSend, onPayPremium, policyId }) => {
    // Define button colors
    const buttonBgColor = 'green.500';
    const buttonHoverColor = 'green.600';

    const handleButtonClick = () => {
        console.log(premiumAmountToSend);
        onPayPremium(policyId, premiumAmountToSend);
    };

    return (
        <Button
            colorScheme="green"
            backgroundColor={buttonBgColor}
            _hover={{ bg: buttonHoverColor }}
            p={4}
            onClick={handleButtonClick}
        >
            <Flex direction="row" align="center" justify="center" width="100%">
                <Text>Pay</Text>
                <Divider orientation="vertical" height="20px" mx={2} borderColor="currentcolor" />
                <Flex align="center">
                    {/* <Text fontSize="md" fontWeight="bold">{premiumAmountToSend ? ethers.utils.formatEther(premiumAmountToSend) : '0.0'}</Text> */}
                    <Icon as={FaEthereum} ml={1} color="currentcolor" />
                </Flex>
            </Flex>
        </Button>
    );
};

export default PayPremiumCTA;
