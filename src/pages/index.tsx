// src/pages/index.tsx
import {
    Box, Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader, Divider,
    Flex,
    Grid,
    Heading, Icon, Image,
    Link,
    Text,
    useBreakpointValue
} from '@chakra-ui/react';
import React, {useEffect} from 'react';
import MetaMaskConnect from "@/components/MetaMaskConnect";
import {useMetaMask} from "@/contexts/MetaMaskContext";
import NextLink from 'next/link';
import styles from '@/pages/page.module.css';
import {FaEthereum} from "react-icons/fa";
import {useRouter} from "next/router";

const Home: React.FC = () => {
    const router = useRouter();
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
                    <Flex>
                        <img src="/unidawg.png" alt="Logo" style={{width: '200px'}}/>
                    </Flex>
                </Heading>
                <MetaMaskConnect/>
            </Flex>
        );
    }

    return (
        <Flex className={styles.main} height="100vh" alignItems="center" justifyContent="center" p={10}>
            <Grid templateColumns="repeat(1, 1fr)" gap={10}>
                <Button
                    colorScheme={'pink'}
                    p={4}
                    onClick={() => {
                        router.push(`/policy-owners`);
                    }}
                >
                    <Text>Browse Policies</Text>
                </Button>
                <Button
                    variant="outline"
                    colorScheme={'pink'}
                    p={4}
                    onClick={() => {
                        router.push(`/policy-creators`);
                    }}
                >
                    <Text>View Creators' Portal</Text>
                </Button>
            </Grid>
        </Flex>
    );
}

export default Home;