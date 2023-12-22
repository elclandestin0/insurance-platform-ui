// src/pages/index.tsx
import { Box, Grid, GridItem, Flex, useBreakpointValue } from '@chakra-ui/react';
import MetaMaskConnect from "@/components/MetaMaskConnect";
import { useMetaMask } from "@/contexts/MetaMaskContext";
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
    const { isConnected } = useMetaMask();
    const gridTemplateColumns = useBreakpointValue({ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' });

    // If MetaMask is not connected, show the landing page with the connect button
    if (!isConnected) {
        return (
            <Flex className={styles.main} bg="darkgreen" height="100vh" alignItems="center" justifyContent="center">
                <MetaMaskConnect />
            </Flex>
        );
    }

    // If MetaMask is connected, show the home page with options for Policy Owners or Policy Creators
    return (
        <Flex height="100vh" alignItems="center" justifyContent="center">
            <Grid templateColumns={gridTemplateColumns} gap={6} alignItems="center" justifyContent="center">
                <GridItem w="100%">
                    <Link href="/policy-owners" passHref>
                        <Box as="a" borderWidth="1px" borderRadius="lg" overflow="hidden" p={6} textAlign="center" boxShadow="md">
                            Policy Owners
                        </Box>
                    </Link>
                </GridItem>
                <GridItem w="100%">
                    <Link href="/policy-creators" passHref>
                        <Box as="a" borderWidth="1px" borderRadius="lg" overflow="hidden" p={6} textAlign="center" boxShadow="md">
                            Policy Creators
                        </Box>
                    </Link>
                </GridItem>
            </Grid>
        </Flex>
    );
}
