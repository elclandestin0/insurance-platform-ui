import React, { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';

const PolicyCTAComponent = ({ ownership }) => {
    return (
        <Button colorScheme="blue">
            {ownership ? 'Manage Your Policy' : 'Subscribe to Policy'}
        </Button>
    );
};

export default PolicyCTAComponent;
