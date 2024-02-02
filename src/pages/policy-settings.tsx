import React, {useEffect, useState} from 'react';
import {Grid, Stat, StatLabel, StatNumber, Icon, Box, Flex, Heading} from '@chakra-ui/react';
import {FaEthereum} from 'react-icons/fa';
import {BigNumber, ethers} from "ethers";
import usePolicyContract from '@/hooks/usePolicyContract';
import {useRouter} from 'next/router';
import SubscribersTable from '@/components/SubsribersTable';
import styles from "@/pages/page.module.css";
import PoolsTable from "@/components/PoolsTable";
import usePoolContract from "@/hooks/usePoolContract";
import {policyMakerAddress, wethAddress} from "@/contracts/addresses";
import useTokenContract from "@/hooks/useTokenContract";
import {useMetaMask} from "@/contexts/MetaMaskContext";

const PolicySettings: React.FC = () => {
    const {
        fetchPremiumsPaid,
        isLoading,
        error,
        fetchSubscribers,
        fetchLastPaidTime,
        fetchCoverageFundBalance,
        fetchInvestmentFundBalance,
        fetchTotalCoverage,
        fetchTotalClaimed,
        fetchAmountInvestmentFunded,
        fetchTotalPoolSupplied,
        fetchTotalAccrued,
        fetchCalculatedRewards,
        fetchRewards,
        fetchPolicy
    } = usePolicyContract();
    const {account} = useMetaMask();
    const {fetchPoolReserveData, isPoolLoading} = usePoolContract();
    const {fetchTokenBalance} = useTokenContract();
    const router = useRouter();
    const [subscribersCount, setSubscribersCount] = useState(null);
    const [subscribers, setSubscribers] = useState(null);
    const [premiumsPerSubscriber, setPremiumsPerSubscriber] = useState<BigNumber[]>(null);
    const [timePerSubscriber, setTimePerSubscriber] = useState<BigNumber[]>(null);
    const [coveragePerSubscriber, setCoveragePerSubscriber] = useState<BigNumber[]>(null);
    const [claimedPerSubscriber, setClaimedPerSubscriber] = useState<BigNumber[]>(null);
    const [calculatedRewardsPerSubscriber, setCalculatedRewardsPerSubscriber] = useState<BigNumber[]>(null);
    const [availableRewardsPerSubscriber, setAvailableRewardsPerSubscriber] = useState<BigNumber[]>(null);
    const [investmentFundedPerSubscriber, setInvestmentFundedPerSubscriber] = useState<BigNumber[]>(null);
    const [totalPremiumsPaid, setTotalPremiumsPaid] = useState<BigNumber>(BigNumber.from(0));
    const [coverageBalance, setCoverageBalance] = useState<BigNumber>(BigNumber.from(0));
    const [investmentBalance, setInvestmentBalance] = useState<BigNumber>(BigNumber.from(0));

    // Aave pool data
    const [accruedToTreasury, setAccruedToTreasury] = useState<BigNumber>(BigNumber.from(0));
    const [aTokenBalance, setATokenBalance] = useState<BigNumber>(BigNumber.from(0));
    const [poolSupplied, setPoolSupplied] = useState<BigNumber>(BigNumber.from(0));
    const [totalAccrued, setTotalAccrued] = useState<BigNumber>(BigNumber.from(0));

    const {policyId} = router.query;

    useEffect(() => {
        const fetchAllData = async () => {
            if (!policyId || isLoading || isPoolLoading) return;
            const policy = await fetchPolicy(policyId);
            if (ethers.utils.getAddress(account) != policy?.creator) router.push('/policy-creators');
            try {
                const _subscribers = await fetchSubscribers(policyId);
                if (!_subscribers) return;

                let _totalPremiums = ethers.BigNumber.from(0);
                let _premiumsPerSubscriber = {};
                let _timePerSubscriber = {};
                let _coveragePerSubscriber = {};
                let _claimedPerSubscriber = {};
                let _investmentFundedPerSubscriber = {};
                let _calculatedRewardsPerSubscriber = {}
                let _availableRewardsPerSubscriber = {}

                const _coverageBalance = await fetchCoverageFundBalance(policyId);
                const _investmentBalance = await fetchInvestmentFundBalance(policyId);
                const _reserveData = await fetchPoolReserveData(wethAddress);
                const _tokenBalance = await fetchTokenBalance(policyMakerAddress);
                const _poolSupplied = await fetchTotalPoolSupplied(policyId);
                const _totalAccrued = await fetchTotalAccrued(policyId);
                const _rewards = await fetchCalculatedRewards(policyId);

                for (const [index, subscriber] of _subscribers.entries()) {
                    const premiumPaid = await fetchPremiumsPaid(policyId, subscriber);
                    const lastPaidTime = await fetchLastPaidTime(policyId, subscriber);
                    const coverageAmount = await fetchTotalCoverage(policyId, subscriber);
                    const claimed = await fetchTotalClaimed(policyId, subscriber);
                    const investmentFunded = await fetchAmountInvestmentFunded(policyId, subscriber);
                    const availableReward = await fetchRewards(policyId, subscriber);
                    const reward = _rewards[index].reward;

                    _totalPremiums = _totalPremiums.add(premiumPaid);
                    _premiumsPerSubscriber[subscriber] = premiumPaid;
                    _timePerSubscriber[subscriber] = lastPaidTime;
                    _coveragePerSubscriber[subscriber] = coverageAmount;
                    _claimedPerSubscriber[subscriber] = claimed;
                    _investmentFundedPerSubscriber[subscriber] = investmentFunded;
                    _calculatedRewardsPerSubscriber[subscriber] = reward;
                    _availableRewardsPerSubscriber[subscriber] = availableReward;
                }

                setCoverageBalance(_coverageBalance);
                setInvestmentBalance(_investmentBalance);
                setSubscribers(_subscribers);
                setSubscribersCount(_subscribers.length);
                setTotalPremiumsPaid(_totalPremiums);
                setPremiumsPerSubscriber(_premiumsPerSubscriber);
                setTimePerSubscriber(_timePerSubscriber);
                setCoveragePerSubscriber(_coveragePerSubscriber);
                setClaimedPerSubscriber(_claimedPerSubscriber);
                setInvestmentFundedPerSubscriber(_investmentFundedPerSubscriber)
                setCalculatedRewardsPerSubscriber(_calculatedRewardsPerSubscriber);
                setAvailableRewardsPerSubscriber(_availableRewardsPerSubscriber);
                setAccruedToTreasury(_reserveData.accruedToTreasury);
                setATokenBalance(_tokenBalance);
                setPoolSupplied(_poolSupplied);
                setTotalAccrued(_totalAccrued);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchAllData();
    }, [isLoading, fetchPremiumsPaid, fetchSubscribers, fetchTotalCoverage, fetchLastPaidTime, policyId]);


    if (isLoading) {
        return <Box>Loading...</Box>;
    }

    if (error) {
        return <Box>Error: {error.message}</Box>;
    }

    return (
        <Flex className={styles.subscribersContainer} height="100vh">
            <Box p={5} w="full">
                <Heading as="h1" size="xl" mb={10}>
                    Policy Management Console
                </Heading>
                <Grid templateColumns={{sm: '1fr', md: '1fr 1fr', lg: 'repeat(2, 1fr)'}} gap={6}>
                    <Stat>
                        <StatLabel>Total Subscribers</StatLabel>
                        <StatNumber>{subscribersCount}</StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel>Total Premiums Paid</StatLabel>
                        {totalPremiumsPaid != null && (
                            <StatNumber>{ethers.utils.formatEther(totalPremiumsPaid) || 0} <Icon as={FaEthereum}/>
                            </StatNumber>
                        )}
                    </Stat>
                    <Stat>
                        <StatLabel>Total Coverage Balance</StatLabel>
                        {coverageBalance != null && (
                            <StatNumber>{ethers.utils.formatEther(coverageBalance) || 0} <Icon
                                as={FaEthereum}/></StatNumber>
                        )}
                    </Stat>
                </Grid>
            </Box>
            {subscribers != null && (
                <SubscribersTable subscribers={subscribers} premiumsPerSubscriber={premiumsPerSubscriber}
                                  timePerSubscriber={timePerSubscriber} coveragePerSubscriber={coveragePerSubscriber}
                                  claimedPerSubscriber={claimedPerSubscriber}
                                  investmentBalance={investmentBalance.add(poolSupplied)}
                                  investmentFundedPerSubscriber={investmentFundedPerSubscriber}
                                  calculatedRewardsPerSubscriber={calculatedRewardsPerSubscriber}
                                  availableRewardsPerSubscriber={availableRewardsPerSubscriber}/>
            )}
            <Box flex="1" w="full" mt={4}> {/* This Box will take up the remaining space */}
                <Grid mb={4} templateColumns={{sm: '1fr', md: '1fr 1fr', lg: 'repeat(2, 1fr)'}} gap={6}>
                    <Stat>
                        <StatLabel>Total Investment Balance</StatLabel>
                        <StatNumber>{ethers.utils.formatEther(investmentBalance) || 0} <Icon
                            as={FaEthereum}/></StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel>Total Supplied</StatLabel>
                        <StatNumber>{ethers.utils.formatEther(poolSupplied) || 0} <Icon
                            as={FaEthereum}/></StatNumber>
                    </Stat>
                </Grid>
                <PoolsTable investmentBalance={investmentBalance} policyId={policyId} aTokenBalance={totalAccrued}/>
            </Box>
        </Flex>
    );
}

export default PolicySettings;
