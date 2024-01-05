import {
    Box,
    Button,
    Select,
    FormControl,
    FormLabel,
    Input,
    VStack,
    HStack,
    Text
} from '@chakra-ui/react';
import { useState } from 'react';

const DeFiStakingComponent = () => {
    const [selectedPool, setSelectedPool] = useState('');
    const [amountToStake, setAmountToStake] = useState('');

    return (
        <Box p={5} borderRadius="md" m={5}>
            <VStack spacing={4}>
                <Text fontSize="xl" fontWeight="semibold">
                    Connect to a DeFi Staking Pool
                </Text>
                <FormControl id="staking-pool">
                    <FormLabel>Select Staking Pool</FormLabel>
                    <Select placeholder="Select pool" onChange={(e) => setSelectedPool(e.target.value)}>
                        {/* Populate this list with real data */}
                        <option value="pool1"> Aave </option>
                        <option value="pool2"> Curve Finance </option>
                        <option value="pool3"> Yearn.finance </option>
                    </Select>
                </FormControl>  
                <FormControl id="amount-to-stake">
                    <FormLabel>Amount to Stake</FormLabel>
                    <Input
                        placeholder="0.0"
                        onChange={(e) => setAmountToStake(e.target.value)}
                    />
                </FormControl>
                    <Button colorScheme="blue" onClick={() => {/* Handle stake action */}}>
                        Stake Funds
                    </Button>
                    {/*<Button colorScheme="red" onClick={() => /!* Handle unstake action *!/}>*/}
                    {/*    Unstake Funds*/}
                    {/*</Button>*/}
            </VStack>
        </Box>
    );
};

export default DeFiStakingComponent;