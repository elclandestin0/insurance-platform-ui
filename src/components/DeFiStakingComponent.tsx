import {
    Box,
    Button,
    Select,
    FormControl,
    FormLabel,
    Input,
    VStack,
    HStack,
    Text, Stat, StatLabel, StatNumber, Icon
} from '@chakra-ui/react';
import React, { useState } from 'react';
import {ethers} from "ethers";
import {FaEthereum} from "react-icons/fa";

const DeFiStakingComponent = ({investmentBalance}) => {
    const [selectedPool, setSelectedPool] = useState('');
    const [amountToStake, setAmountToStake] = useState('');
    
    return (
        <Box p={5} borderRadius="md" m={5}>
        <VStack spacing={4}>
        
        <Stat>
        <StatLabel>Investment Balance</StatLabel>
        {investmentBalance != null && (
            <StatNumber>{ethers.utils.formatEther(investmentBalance)} <Icon as={FaEthereum} /></StatNumber>
            )}
            </Stat>
            <Stat>
            <StatLabel>Enter Value</StatLabel>
            <StatNumber>
            <Input placeholder="Input value here" />
            </StatNumber>
            {/* You can add more Stat components like StatHelpText if needed */}
            </Stat>
            <Button colorScheme="blue" onClick={() => {/* Handle stake action */}}>
            Stake on Yearn.fi
            </Button>
            {/*<Button colorScheme="red" onClick={() => /!* Handle unstake action *!/}>*/}
            {/*    Unstake Funds*/}
            {/*</Button>*/}
            </VStack>
            </Box>
            );
        };
        
        export default DeFiStakingComponent;