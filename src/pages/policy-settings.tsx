import React, { useEffect, useState } from 'react';
import { Grid, Stat, StatLabel, StatNumber, Icon, Box } from '@chakra-ui/react';
import { FaEthereum } from 'react-icons/fa';
import { ethers } from "ethers";
import usePolicyContract from '@/hooks/usePolicyContract'; // Import the custom hook
import { useRouter } from 'next/router';
import SubscribersAccordion from '@/components/SubsribersTable';
import styles from "@/pages/page.module.css"; // Make sure the path is correct

const PolicySettings: React.FC = () => {
    const {fetchPremiumsPaid, isLoading, error, fetchSubscribers } = usePolicyContract();
    const router = useRouter();
    const [subscribersCount, setSubscribersCount] = useState(null);
    const [subscribers, setSubscribers] = useState(null);
    const [totalPremiumsPaid, setTotalPremiumsPaid] = useState<ethers.BigNumber>(ethers.BigNumber.from(0));
    const { policyId } = router.query;

    
    useEffect(() => {
        const fetchAllSubscribersAndPremiums = async () => {
            if (!policyId || isLoading) {
                return;
            }
    
            try {
                const _subscribers = await fetchSubscribers(policyId);
                let _totalPremiums = ethers.BigNumber.from(0);
    
                for (let i = 0; i < _subscribers.length; i++) {
                    const premiumPaid = await fetchPremiumsPaid(policyId, _subscribers[i]);
                    _totalPremiums = _totalPremiums.add(premiumPaid);
                }
    
                setSubscribers(_subscribers);
                setSubscribersCount(_subscribers.length);
                setTotalPremiumsPaid(_totalPremiums);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
    
        fetchAllSubscribersAndPremiums();
    }, [isLoading, fetchPremiumsPaid, fetchSubscribers, policyId]); // Include all used variables in the dependency array
    

    if (isLoading) {
        return <Box>Loading...</Box>;
    }

    if (error) {
        return <Box>Error: {error.message}</Box>;
    }

    return (
        <div className={styles.subscribersContainer}>
            <Box p={5} w="full">
                <Grid templateColumns={{ sm: '1fr', md: '1fr 1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
                    <Stat>
                        <StatLabel>Total Subscribers</StatLabel>
                        <StatNumber>{subscribersCount}</StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel>Total Premiums Paid</StatLabel>
                        {totalPremiumsPaid != null && (
                            <StatNumber>{ethers.utils.formatEther(totalPremiumsPaid)} <Icon as={FaEthereum} /></StatNumber>
                        )}
                    </Stat>
                </Grid>
            </Box>
            {subscribers != null && (
                <SubscribersAccordion subscribers={subscribers} />
            )}
        </div>
    );
}

export default PolicySettings;
