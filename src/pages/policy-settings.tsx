import React, { useEffect, useState } from 'react';
import { Box, Grid, Stat, StatLabel, StatNumber, Icon } from '@chakra-ui/react';
import { FaEthereum } from 'react-icons/fa';
import { ethers } from "ethers";
import usePolicyContract from '@/hooks/usePolicyContract'; // Import the custom hook
import { useRouter } from 'next/router';

const PolicySettings: React.FC = () => {
    const {fetchPremiumsPaid, isLoading, error, fetchSubscribers } = usePolicyContract();
    const router = useRouter();
    const [subscribersCount, setSubscribersCount] = useState(null);
    const [subscribers, setSubscribers] = useState(null);
    const [totalPremiumsPaid, setTotalPremiumsPaid] = useState<ethers.BigNumber>(ethers.BigNumber.from(0));
    const { policyId } = router.query;

    
    useEffect(() => {
        if (!isLoading) {
            let _subscribers = 0;
            let _totalPremiums = ethers.BigNumber.from(0);
            
            const fetchAllSubscribers = async (policyId: any) => {
                _subscribers = await fetchSubscribers(policyId);
                setSubscribers(_subscribers);
                setSubscribersCount(_subscribers.length);
            }

            const fetchPremiums = async () => {
                console.log(subscribers);
                if (!subscribers) return;
                for (let i = 0; i < subscribers.length; i++) {
                    console.log(subscribers[i]);
                    const premiumPaid = await fetchPremiumsPaid(policyId, subscribers[i]);
                    _totalPremiums += premiumPaid;
                }
                setTotalPremiumsPaid(_totalPremiums);
             };

            fetchAllSubscribers(policyId)
            .then(() => {
                fetchPremiums()
                .catch((err: Error)=>{
                    console.log("Error fetching premiums: ", err);
                });
            })
            .catch((err: Error) => {
                console.log(subscribers.length);
                console.error('Error fetching subscribers:', err);
            });
            
        }
    }, [isLoading, fetchPremiumsPaid, fetchSubscribers, policyId]);

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
                    <StatNumber>{subscribersCount}</StatNumber>
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
