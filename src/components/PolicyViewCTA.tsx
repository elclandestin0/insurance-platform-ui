import React from 'react';
import { Button, Flex, Divider, Text, Icon } from '@chakra-ui/react';
import { FaEthereum } from 'react-icons/fa';

const PolicyCTAButton = ({ isOwner, initialPremium }) => {
    const buttonBgColor = isOwner ? 'blue.500' : 'purple.500'; // or any color from your theme
    const buttonHoverColor = isOwner ? 'blue.600' : 'purple.600'; // for hover state

    return (
        <Button
            colorScheme={isOwner ? 'blue' : 'purple'} // Chakra UI color scheme
            backgroundColor={buttonBgColor}
            _hover={{ bg: buttonHoverColor }}
            p={4}
        >
            <Flex direction="row" align="center" justify="center" width="100%">
                {isOwner ? (
                    <Text>Manage Your Policy</Text>
                ) : (
                    <>
                        <Text>Subscribe</Text>
                        <Divider orientation="vertical" height="20px" mx={2} borderColor="currentcolor" />
                        <Flex align="center">
                            <Text fontSize="md" fontWeight="bold">{initialPremium}</Text>
                            <Icon as={FaEthereum} ml={1} color="currentcolor" />
                        </Flex>
                    </>
                )}
            </Flex>
        </Button>
    );
};

export default PolicyCTAButton;
