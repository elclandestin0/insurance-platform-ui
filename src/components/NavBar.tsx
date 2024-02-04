import React from 'react';
import { Flex, Box, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link'; // Import Next.js Link component
import UniDawg from '../../public/unidawg.png';

const NavBar = () => {
    return (
        <Flex bg="#27405d" color="white" justifyContent="space-between" alignItems="center" p="4">
            <Box fontSize="48px" fontWeight="bold">
            <img src="/unidawg.png" alt="Logo" style={{ width: '48px', height: '48px' }} />
            </Box>
            <Flex>
                {/* Use Next.js Link for client-side navigation */}
                <NextLink href="/policy-owners" passHref>
                    <Text p="4" fontSize="16px" _hover={{ textDecoration: 'none', bg: 'blue.700' }}>
                        Policy Owners
                    </Text>
                </NextLink>
                <NextLink href="/policy-creators" passHref>
                    <Text p="4"  fontSize="16px" _hover={{ textDecoration: 'none', bg: 'blue.700' }}>
                        Policy Creators
                    </Text>
                </NextLink>
            </Flex>
        </Flex>
    );
};

export default NavBar;
