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
  useDisclosure
} from '@chakra-ui/react';

const SubscribersTable = ({ subscribers }) => {
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
            <Th isNumeric>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {subscribers.map((address, index) => (
            <React.Fragment key={index}>
              <Tr onClick={() => handleRowClick(index)} cursor="pointer">
                <Td>Subscriber {index + 1}</Td>
                <Td>{address}</Td>
                <Td isNumeric>
                  <Button size="sm">View Details</Button>
                </Td>
              </Tr>
              <Tr>
                <Td colSpan={3}>
                  <Collapse in={selectedRow === index} animateOpacity>
                    <Box p={4} mt={2} shadow="md" borderWidth="1px">
                      {/* Here you can fetch and display more details about the subscriber */}
                      <Text>Address: {address}</Text>
                      {/* Fetch and display more data about the subscriber using their address */}
                      {/* Add more details you want to show here */}
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
