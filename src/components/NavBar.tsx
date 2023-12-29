import React from 'react';
import { Flex, Box, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link'; // Import Next.js Link component

const NavBar = () => {
    return (
        <Flex bg="blue.800" color="white" justifyContent="space-between" alignItems="center" p="4">
            <Box fontSize="48px" fontWeight="bold">
                🐶
            </Box>
            <Flex>
                {/* Use Next.js Link for client-side navigation */}
                <NextLink href="/policy-owners" passHref>
                    <Link p="4" fontSize="16px" _hover={{ textDecoration: 'none', bg: 'blue.700' }}>
                        Policy Owners
                    </Link>
                </NextLink>
                <NextLink href="/policy-creators" passHref>
                        Policy Creators
                    <Link p="4"  fontSize="16px" _hover={{ textDecoration: 'none', bg: 'blue.700' }}>
                    </Link>
                </NextLink>
            </Flex>
        </Flex>
    );
};

export default NavBar;
