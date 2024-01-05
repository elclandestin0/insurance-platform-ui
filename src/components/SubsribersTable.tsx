import React, { useState } from 'react';
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
import { FaEthereum } from 'react-icons/fa';
import { ethers } from 'ethers';
import { convertEpochToReadableDate } from '@/utils/helpers';

const SubscribersTable = ({ subscribers, premiumsPerSubscriber, timePerSubscriber }) => {
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (index) => {
    setSelectedRow(selectedRow === index ? null : index);
  };

  return (
    <Box w="full">
      <Table variant="unstyled">
        <Thead>
          <Tr>
            <Th>Subscriber ID</Th>
            <Th>Address</Th>
            <Th>Premium paid</Th>
            <Th>Last paid date</Th>
            <Th isNumeric>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {subscribers.map((address, index) => (
            <React.Fragment key={index}>
              <Tr onClick={() => handleRowClick(index)} cursor="pointer">
                <Td>Subscriber {index + 1}</Td>
                <Td>{address}</Td>
                <Td>{ethers.utils.formatEther(premiumsPerSubscriber[address] || 0)} <Icon as={FaEthereum} /></Td>
                <Td>{convertEpochToReadableDate(timePerSubscriber[address])}</Td>
                <Td isNumeric>
                  <Button size="sm">View Details</Button>
                </Td>
              </Tr>
              <Tr>
                <Td colSpan={3}>
                  <Collapse in={selectedRow === index} animateOpacity>
                    <Box p={4} mt={2} shadow="md" borderWidth="1px">
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
