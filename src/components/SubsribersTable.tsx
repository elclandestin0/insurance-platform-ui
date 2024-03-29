import React, {useEffect, useState} from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Box,
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
    calculatedRewardsPerSubscriber: BigNumber[];
    availableRewardsPerSubscriber: BigNumber[];
}

const SubscribersTable: React.FC<SubscribersTableProps> = ({
                                                               subscribers,
                                                               premiumsPerSubscriber,
                                                               timePerSubscriber,
                                                               coveragePerSubscriber,
                                                               claimedPerSubscriber,
                                                               investmentBalance,
                                                               investmentFundedPerSubscriber,
                                                               calculatedRewardsPerSubscriber,
                                                               availableRewardsPerSubscriber
                                                           }) => {
    const [selectedRow, setSelectedRow] = useState(null);
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
                        <Th> % of rewards stake </Th>
                        <Th>Total claimed</Th>
                        <Th>Calculated rewards</Th>
                        <Th>Available rewards</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {subscribers.map((address, index) => (
                        <React.Fragment key={index}>
                            <Tr key={address} onClick={() => handleRowClick(index)} cursor="pointer" border="2px"
                                borderColor="teal" backgroundColor="#27405d">
                                <Td color="white" fontWeight="normal">Subscriber {index + 1}</Td>
                                <Td color="white" fontWeight="normal">{address}</Td>
                                <Td color="white"
                                    fontWeight="normal">{parseFloat(ethers.utils.formatEther(premiumsPerSubscriber[address] || 0)).toFixed(2)}
                                    <Icon
                                        as={FaEthereum}/></Td>
                                <Td color="white"
                                    fontWeight="normal">{convertEpochToReadableDate(timePerSubscriber[address])}</Td>
                                <Td color="green.300"
                                    fontWeight="normal">{parseFloat(ethers.utils.formatEther(coveragePerSubscriber[address] || 0)).toFixed(2)}
                                    <Icon
                                        as={FaEthereum}/>
                                </Td>
                                <Td color="white"
                                    fontWeight="normal"> {parseFloat(ethers.utils.formatEther(investmentFundedPerSubscriber[address] || 0)).toFixed(2)}
                                    <Icon
                                        as={FaEthereum}/>
                                </Td>
                                <Td color="white"
                                    fontWeight="normal"> {parseFloat(ethers.utils.formatEther((investmentFundedPerSubscriber[address].mul(ethers.utils.parseEther("100")).div(investmentBalance)))).toFixed(2)} %
                                </Td>
                                <Td color="white"
                                    fontWeight="normal">{parseFloat(ethers.utils.formatEther(claimedPerSubscriber[address] || 0)).toFixed(2)}
                                    <Icon
                                        as={FaEthereum}/>
                                </Td>
                                <Td color="white"
                                    fontWeight="normal">{parseFloat(ethers.utils.formatEther(calculatedRewardsPerSubscriber[address] || 0)).toFixed(2)}
                                    <Icon as={FaEthereum}/>
                                </Td>
                                <Td color="white"
                                    fontWeight="normal">{parseFloat(ethers.utils.formatEther(availableRewardsPerSubscriber[address] || 0)).toFixed(2)}
                                    <Icon as={FaEthereum}/>
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
