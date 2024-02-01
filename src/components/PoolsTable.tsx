import React, {useEffect, useState} from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Box,
} from '@chakra-ui/react';
import DeFiStakingModal from "@/components/DeFiStakingModal";
import {ethers} from "ethers";
import DeFiWithdrawModal from "@/components/DeFiWithdrawModal";

const PoolsTable = ({investmentBalance, policyId, aTokenBalance}) => {
    const [selectedRow, setSelectedRow] = useState(null);

    return (
        <Box w="full">
            <Table variant="unstyled">
                <Thead>
                    <Tr>
                        <Th fontStyle="bold">Supply</Th>
                        <Th>Protocol name</Th>
                        <Th>Token name</Th>
                        <Th>Total aWeth accrued</Th>
                        <Th>Withdraw rewards</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <React.Fragment key={0}>
                        <Tr key={0} cursor="pointer" border="1px"
                            borderColor="pink" backgroundColor="white">
                            <Td color="black" fontWeight="bold"
                                isNumeric>
                                <DeFiStakingModal investmentBalance={investmentBalance} policyId={policyId}/>
                            </Td>
                            <Td color="black" fontWeight="bold">Aave</Td>
                            <Td color="black" fontWeight="bold">WETH</Td>
                            <Td color="black" fontWeight="bold">{ethers.utils.formatEther(aTokenBalance)}</Td>
                            <Td color="black" fontWeight="bold"
                                isNumeric>
                                <DeFiWithdrawModal investmentBalance={investmentBalance} policyId={policyId}/>
                            </Td>
                        </Tr>
                    </React.Fragment>
                </Tbody>
            </Table>
        </Box>
    );
};

export default PoolsTable;
