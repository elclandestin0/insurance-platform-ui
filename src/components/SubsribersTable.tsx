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
import {ethers} from 'ethers';
import {convertEpochToReadableDate} from '@/utils/helpers';

const SubscribersTable = ({subscribers, premiumsPerSubscriber, timePerSubscriber, coveragePerSubscriber, claimedPerSubscriber}) => {
    const [selectedRow, setSelectedRow] = useState(null);

    const handleRowClick = (index) => {
        setSelectedRow(selectedRow === index ? null : index);
    };

    useEffect(() => {
        console.log(coveragePerSubscriber);
    }, [coveragePerSubscriber])

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
                                        as={FaEthereum}/></Td>
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
