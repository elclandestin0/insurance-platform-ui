import React, { useEffect, useState } from 'react';
import { Box, Grid, Stat, StatLabel, StatNumber, Icon } from '@chakra-ui/react';
import { FaEthereum } from 'react-icons/fa';
import { ethers } from "ethers";
import usePolicyContract from '@/hooks/usePolicyContract'; // Import the custom hook
import { useRouter } from 'next/router';

const PolicySettings: React.FC = () => {
    const {fetchPremiumsPaid, isLoading, error, fetchSubscribers } = usePolicyContract();
    const router = useRouter();
    const [totalSubscribers, setTotalSubscribers] = useState(null);
    const [totalPremiumsPaid, setTotalPremiumsPaid] = useState<ethers.BigNumber>(ethers.BigNumber.from(0));
    const { policyId } = router.query;

    
    useEffect(() => {
        if (!isLoading) {
            let subscribers = 0;
            let totalPremiums = ethers.BigNumber.from(0);
            
            const fetchAllSubscribers = async (policyId: any) => {
                subscribers = await fetchSubscribers(policyId);
            }

            const fetchPremiums = async () => {
                let totalPremiums = 0;
                if (!totalSubscribers) return;
                for (let i = 0; i < totalSubscribers.length; i++) {
                    totalPremiums += await fetchPremiumsPaid(policyId, totalSubscribers[i]);
                }
                console.log(totalPremiums);
             };

            // fetchPremiums().catch((err) => {
            //     console.error('Error fetching premiums:', err);
            // });

            fetchAllSubscribers(policyId)
            .then(()=> {
                setTotalSubscribers(subscribers.length);
            }).then(()=>{
                fetchPremiums();
            })
            .catch((err) => {
                console.log(subscribers.length);
                console.error('Error fetching subscribers:', err);
            });
            
            setTotalPremiumsPaid(totalPremiums);
        }
    }, [isLoading, fetchPremiumsPaid, fetchSubscribers, policyId, totalSubscribers]);

    if (isLoading) {
        return <Box>Loading...</Box>;
    }

    if (error) {
        return <Box>Error: {error.message}</Box>;
    }

    return (
        <Box p={5}>
            <Grid templateColumns={{ sm: '1fr', md: '1fr 1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
                <Stat>
                    <StatLabel>Total Subscribers</StatLabel>
                    <StatNumber>{totalSubscribers}</StatNumber>
                </Stat>
                <Stat>
                    <StatLabel>Total Premiums Paid</StatLabel>
                    <StatNumber>{ethers.utils.formatEther(totalPremiumsPaid)} <Icon as={FaEthereum} /></StatNumber>
                </Stat>
            </Grid>
        </Box>
    );
}

export default PolicySettings;
