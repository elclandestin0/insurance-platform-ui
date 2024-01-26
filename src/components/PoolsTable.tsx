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

const PoolsTable = ({investmentBalance, policyId}) => {
    const [selectedRow, setSelectedRow] = useState(null);

    return (
        <Box w="full">
            <Table variant="unstyled">
                <Thead>
                    <Tr>
                        <Th fontStyle="bold">Supply</Th>
                        <Th>Protocol name</Th>
                        <Th>Token name</Th>
                        <Th>Liquidity Index</Th>
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
                            <Td color="black" fontWeight="bold">Liquidity Index</Td>
                        </Tr>
                    </React.Fragment>
                </Tbody>
            </Table>
        </Box>
    );
};

export default PoolsTable;
