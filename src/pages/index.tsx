// src/pages/index.tsx
import {Box, Flex,Grid, Heading, useBreakpointValue} from '@chakra-ui/react';
import MetaMaskConnect from "@/components/MetaMaskConnect";
import {useMetaMask} from "@/contexts/MetaMaskContext";
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
    const {isConnected} = useMetaMask();
    const gridTemplateColumns = useBreakpointValue({
        base: 'repeat(1, 1fr)',
        md: 'repeat(2, 1fr)',
        lg: 'repeat(4, 1fr)'
    });

    // If MetaMask is not connected, show the landing page with the connect button
    if (!isConnected) {
        return (
            <Flex
                className={styles.main}
                height="100vh"
                alignItems="center"
                justifyContent="center"
                direction="column"
                p={4}
            >
                <Heading as='h1' size='4xl' noOfLines={1} mb={10}>
                    🐶 ProteccFi 🐶
                </Heading>
                <MetaMaskConnect/>
            </Flex>
        );
    }

    return (
        <Flex className={styles.main} height="100vh" alignItems="center" justifyContent="center">
            <Grid templateColumns="repeat(2, 1fr)" gap={10}>
                <Link href="/policy-owners" passHref>
                    <Box as="a"
                         borderWidth="1px"
                         borderRadius="xl"
                         overflow="hidden"
                         p={10} // Increased padding
                         textAlign="center"
                         w="lg" // Increased width
                         h="lg" // Increased height
                         _hover={{ bg: "blue.100" }}>
                        Policy Owners
                    </Box>
                </Link>
                <Link href="/policy-creators" passHref>
                    <Box as="a"
                         borderWidth="1px"
                         borderRadius="xl"
                         overflow="hidden"
                         p={10}
                         textAlign="center"
                         w="lg"
                         h="lg"
                         _hover={{ bg: "blue.100" }}>
                        Policy Creators
                    </Box>
                </Link>
            </Grid>
        </Flex>
    );
}
