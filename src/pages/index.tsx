// src/pages/index.tsx
import {Box, Flex, Grid, Heading, Link, useBreakpointValue} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import MetaMaskConnect from "@/components/MetaMaskConnect";
import {useMetaMask} from "@/contexts/MetaMaskContext";
import NextLink from 'next/link';
import styles from '@/pages/page.module.css';

const Home: React.FC = ()=> {
    const {isConnected, account} = useMetaMask();

    useEffect(() => {
        console.log(isConnected);
        console.log(account);
    }, [isConnected, account]);
    
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
                <NextLink href="/policy-owners" passHref>
                    <Link>
                        <Box borderWidth="1px"
                             borderRadius="xl"
                             overflow="hidden"
                             p={10}
                             textAlign="center"
                             w="lg"
                             h="lg"
                             _hover={{ bg: "blue.100" }}>
                            Policy Owners
                        </Box>
                    </Link>
                </NextLink>
                <NextLink href="/policy-creators" passHref>
                    <Link>
                        <Box borderWidth="1px"
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
                </NextLink>
            </Grid>
        </Flex>
    );
}

export default Home;