import { useCallback, useEffect, useState } from 'react';
import { useContracts } from './useContracts'; // Import your useContracts hook
import { useMetaMask } from '@/contexts/MetaMaskContext';
import { ethers } from "ethers"; // Import the MetaMask context


const usePolicyContract = () => {
    const { policyMakerContract } = useContracts();
    const { account } = useMetaMask(); // Get the current account from MetaMask
    const [policies, setPolicies] = useState([]);
    const [ownedPolicies, setOwnedPolicies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const checkPolicyOwnership = useCallback(async (policyId: number, accountAddress: String) => {
        if (!policyMakerContract || !policyId || !accountAddress) {
            return false;
        }
        try {
            return await policyMakerContract.policyOwners(policyId, accountAddress);
        } catch (err) {
            console.error('Error checking policy ownership:', err);
            return false;
        }
    }, [policyMakerContract]);

    const fetchPolicies = async (): Promise<any[]> => {
        if (!policyMakerContract) {
            console.error("Contract not initialized.");
            return [];
        }
        try {
            const allPolicies = [];
            const nextIdBigNumber = await policyMakerContract.nextPolicyId();
            if (nextIdBigNumber != null) {
                for (let i = 1; i < nextIdBigNumber; i++) {
                    const policy = await policyMakerContract.policies(i.toString());
                    const formattedPolicy = {
                        id: i,
                        coverageAmount: policy.coverageAmount.toString(),
                        initialPremiumFee: policy.initialPremiumFee.toString(),
                        initialCoveragePercentage: policy.initialCoveragePercentage.toString(),
                        premiumRate: policy.premiumRate.toString(),
                        duration: Number(policy.duration),
                        penaltyRate: Number(policy.penaltyRate),
                        monthsGracePeriod: Number(policy.monthsGracePeriod),
                    };

                    allPolicies.push(formattedPolicy); // Update loading state
                }
                
                setPolicies(allPolicies);
                setIsLoading(false);

                return allPolicies;
            } else {
                console.error("nextPolicyId did not return a BigNumber.");
                return [];
            }
        } catch (error) {
            console.error("Error fetching all policies:", error);
            return [];
        }

    };

    const fetchPolicy = useCallback(async (policyId: String, address: String) => {
        if (!policyMakerContract || !policyId || !address) {
            return null;
        }
        try {
            const policy = await policyMakerContract.policies(policyId);
            return {
                id: policyId,
                coverageAmount: policy.coverageAmount.toString(),
                initialPremiumFee: policy.initialPremiumFee.toString(),
                initialCoveragePercentage: policy.initialCoveragePercentage.toString(),
                premiumRate: policy.premiumRate.toString(),
                duration: Number(policy.duration),
                penaltyRate: Number(policy.penaltyRate),
                monthsGracePeriod: Number(policy.monthsGracePeriod),
                coverageFundPercentage: Number(policy.coverageFundPercentage),
                investmentFundPercentage: Number(policy.coverageFundPercentage)
            };

        } catch (err) {
            console.error('Error checking for policy: ', err);
            return false;
        }
    }, [policyMakerContract]);

    const payInitialPremium = useCallback(async (policyId: any, premiumAmount: any) => {
        if (!policyMakerContract || !policyId || !premiumAmount) {
            console.error("Contract not initialized or invalid parameters.");
            return;
        }
        try {
            // Assuming you have ethers.js or a similar library
            console.log(premiumAmount);
            const transaction = await policyMakerContract.payInitialPremium(policyId, {
                from: account,
                value: ethers.utils.parseEther(premiumAmount)
            });
            await transaction.wait(); // Wait for the transaction to be mined
            console.log('Premium paid successfully');
        } catch (err) {
            console.error('Error paying initial premium:', err);
        }
    }, [policyMakerContract, account]);

    const payPremium = useCallback(async (policyId: any, premiumAmount: any) => {
        if (!policyMakerContract || !policyId || !premiumAmount) {
            console.error("Contract not initialized or invalid parameters.");
            return;
        }
        try {
            // Assuming you have ethers.js or a similar library
            console.log(premiumAmount);
            const transaction = await policyMakerContract.payPremium(policyId, {
                from: account,
                value: ethers.utils.parseEther(premiumAmount)
            });
            await transaction.wait(); // Wait for the transaction to be mined
            console.log('Premium paid successfully');
        } catch (err) {
            console.error('Error paying initial premium:', err);
        }
    }, [policyMakerContract, account]);

    const calculatePremium = useCallback(async (policyId: any) => {
        if (!policyMakerContract || !policyId || !account) {
            console.error("Contract not initialized or missing parameters.");
            return;
        }
        try {
            return await policyMakerContract.calculatePremium(policyId, account);
        } catch (err) {
            console.error('Error calculating premium:', err);
        }
    }, [policyMakerContract, account]);

    const fetchPremiumsPaid = useCallback(async (policyId: any, account: any) => {
        if (!policyMakerContract || !policyId) {
            console.error("Contract not initialized or missing parameters.");
            return ethers.BigNumber.from(0);
        }
        try {
            return await policyMakerContract.premiumsPaid(policyId, account);
        } catch (err) {
            console.error('Error retrieving premiums paid:', err);
            return ethers.BigNumber.from(0);
        }
    }, [policyMakerContract, account]);

    const fetchCoverageFundBalance = useCallback(async (policyId: any) => {
        if (!policyMakerContract || !policyId) {
            console.error("Contract not initialized or missing parameters.");
            return ethers.BigNumber.from(0);
        }
        try {
            return await policyMakerContract.coverageFundBalance(policyId);
        } catch (err) {
            console.error('Error retrieving premiums paid:', err);
            return ethers.BigNumber.from(0);
        }
    }, [policyMakerContract, account]);

    const fetchInvestmentFundBalance = useCallback(async (policyId: any) => {
        if (!policyMakerContract || !policyId) {
            console.error("Contract not initialized or missing parameters.");
            return ethers.BigNumber.from(0);
        }
        try {
            return await policyMakerContract.investmentFundBalance(policyId);
        } catch (err) {
            console.error('Error retrieving premiums paid:', err);
            return ethers.BigNumber.from(0);
        }
    }, [policyMakerContract]);

    const fetchLastPaidTime = useCallback(async (policyId: any, account: any) => {
        if (!policyMakerContract || !policyId) {
            console.error("Contract not initialized or missing parameters.");
            return ethers.BigNumber.from(0);
        }
        try {
            return await policyMakerContract.lastPremiumPaidTime(policyId, account);
        } catch (err) {
            console.error('Error retrieving premiums paid:', err);
            return ethers.BigNumber.from(0);
        }
    }, [policyMakerContract, account]);

    const fetchTotalCoverage = useCallback(async (policyId: any, account: any) => {
        if (!policyMakerContract || !policyId) {
            console.error("Contract not initialized or missing parameters.");
            return ethers.BigNumber.from(0);
        }
        try {
            return await policyMakerContract.calculateTotalCoverage(policyId, account);
        } catch (err) {
            console.error('Error retrieving premiums paid:', err);
            return ethers.BigNumber.from(0);
        }
    }, [policyMakerContract, account]);

    const fetchSubscribers = useCallback(async (policyId: any) => {
        const subscribersSet = new Set();
        if (!policyMakerContract || !policyId) {
            return;
        }

        try {
            // convert policyId to hex string and then pad it to 32 bytes
            const policyIdTopic = ethers.utils.hexZeroPad(ethers.BigNumber.from(policyId).toHexString(), 32);
            const filter = {
                fromBlock: 0,
                toBlock: 'latest',
                topics: [
                    ethers.utils.id("PremiumPaid(uint32,address,uint256,bool)"),
                    policyIdTopic,
                ],
            };

            const logs = await policyMakerContract.provider.getLogs(filter);
            logs.forEach((log) => {
                // Decode the log to get the claimant's address
                const decoded = policyMakerContract.interface.decodeEventLog("PremiumPaid", log.data, log.topics);
                subscribersSet.add(decoded.claimant);
            });
        } catch (err) {
            console.error('Error fetching subscribers:', err);
        }

        return Array.from(subscribersSet);
    }, [policyMakerContract]);

    useEffect(() => {
        if (policyMakerContract) {
            setIsLoading(true); // Set loading state before fetching
            fetchPolicies().catch(error => {
                console.error("Error fetching policies in useEffect:", error);
                setError(error); // Set error state if an error occurs
                setIsLoading(false); // Update loading state
            });
        }
    }, [policyMakerContract]);

    return { policies, isLoading, error, checkPolicyOwnership, payInitialPremium, fetchPolicy, payPremium, calculatePremium, fetchPremiumsPaid, fetchLastPaidTime, fetchSubscribers, fetchCoverageFundBalance, fetchInvestmentFundBalance, fetchTotalCoverage};
};

export default usePolicyContract;
