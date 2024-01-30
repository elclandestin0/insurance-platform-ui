import React, {useEffect, useState} from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Box,
    Collapse,
    Button,
    Text,
    Icon
} from '@chakra-ui/react';
import {FaEthereum} from 'react-icons/fa';
import {BigNumber, ethers} from 'ethers';
import {convertEpochToReadableDate} from '@/utils/helpers';

interface SubscribersTableProps {
    subscribers: any[];
    premiumsPerSubscriber: BigNumber[];
    timePerSubscriber: BigNumber[];
    coveragePerSubscriber: BigNumber[];
    claimedPerSubscriber: BigNumber[];
    investmentBalance: BigNumber;
    investmentFundedPerSubscriber: BigNumber[];
}

const SubscribersTable: React.FC<SubscribersTableProps> = ({
                                                               subscribers,
                                                               premiumsPerSubscriber,
                                                               timePerSubscriber,
                                                               coveragePerSubscriber,
                                                               claimedPerSubscriber,
                                                               investmentBalance,
                                                               investmentFundedPerSubscriber,
                                                           }) => {

    const [selectedRow, setSelectedRow] = useState(null);
    const [percentageInvested, setPercentageInvested] = useState('0');
    const handleRowClick = (index) => {
        setSelectedRow(selectedRow === index ? null : index);
    };

    useEffect(() => {
        if (!investmentFundedPerSubscriber || !investmentBalance) return;
    }, [coveragePerSubscriber, investmentFundedPerSubscriber, investmentBalance])

    return (
        <Box w="full">
            <Table variant="unstyled">
                <Thead>
                    <Tr>
                        <Th fontStyle="bold">Subscriber ID</Th>
                        <Th>Address</Th>
                        <Th>Premium paid</Th>
                        <Th>Last paid date</Th>
                        <Th>Available coverage to claim</Th>
                        <Th> Total investment funded </Th>
                        <Th> % of investment funded </Th>
                        <Th>Total claimed</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {subscribers.map((address, index) => (
                        <React.Fragment key={index}>
                            <Tr key={address} onClick={() => handleRowClick(index)} cursor="pointer" border="1px"
                                borderColor="pink" backgroundColor="white">
                                <Td color="black" fontWeight="bold">Subscriber {index + 1}</Td>
                                <Td color="black" fontWeight="bold">{address}</Td>
                                <Td color="black"
                                    fontWeight="bold">{ethers.utils.formatEther(premiumsPerSubscriber[address] || 0)}
                                    <Icon
                                        as={FaEthereum}/></Td>
                                <Td color="black"
                                    fontWeight="bold">{convertEpochToReadableDate(timePerSubscriber[address])}</Td>
                                <Td color="black"
                                    fontWeight="bold">{ethers.utils.formatEther(coveragePerSubscriber[address] || 0)}
                                    <Icon
                                        as={FaEthereum}/>
                                </Td>
                                <Td color="black"
                                    fontWeight="bold"> {ethers.utils.formatEther((investmentFundedPerSubscriber[address].mul(ethers.utils.parseEther("100")).div(investmentBalance)))} %
                                </Td>
                                <Td color="black"
                                    fontWeight="bold"> {ethers.utils.formatEther(investmentFundedPerSubscriber[address])}
                                    <Icon
                                        as={FaEthereum}/>
                                </Td>
                                <Td color="black"
                                    fontWeight="bold">{ethers.utils.formatEther(claimedPerSubscriber[address])} <Icon
                                    as={FaEthereum}/>
                                </Td>
                            </Tr>
                            <Tr>
                                <Td colSpan={3}>
                                    <Collapse in={selectedRow === index} animateOpacity>
                                        <Box p={4} shadow="md">
                                            <Text>Address: {address}</Text>
                                        </Box>
                                    </Collapse>
                                </Td>
                            </Tr>
                        </React.Fragment>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default SubscribersTable;
