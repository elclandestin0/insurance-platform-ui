// src/pages/index.tsx
import {Box, Flex,Grid, Heading, useBreakpointValue} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import MetaMaskConnect from "@/components/MetaMaskConnect";
import {useMetaMask} from "@/contexts/MetaMaskContext";
import Link from 'next/link';
import styles from '@/pages/page.module.css';
import { policyMakerContract } from '@/utils/ethereum';

export default function Home() {
    const {isConnected} = useMetaMask();
    // Function to interact with the contract
    const fetchDataFromContract = async () => {
        try {
            // Call a read function from your contract
            const result = await policyMakerContract.isActive(0);
            console.log(result);
        } catch (error) {
            console.error('Error fetching data from the contract:', error);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchDataFromContract();
    }, []);


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
