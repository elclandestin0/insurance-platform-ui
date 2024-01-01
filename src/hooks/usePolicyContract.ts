import {useCallback, useEffect, useState} from 'react';
import {useContracts} from './useContracts'; // Import your useContracts hook
import {useMetaMask} from '@/contexts/MetaMaskContext';
import {ethers} from "ethers"; // Import the MetaMask context


const usePolicyContract = () => {
    const { policyMakerContract } = useContracts();
    const { account } = useMetaMask(); // Get the current account from MetaMask
    const [policies, setPolicies] = useState([]);
    const [ownedPolicies, setOwnedPolicies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [calculatedPremium, setCalculatedPremium] = useState('');
    
    
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
            const premium = await policyMakerContract.calculatePremium(policyId);
            // Format the calculated premium for display if necessary
            setCalculatedPremium(ethers.utils.formatEther(premium));
        } catch (err) {
            console.error('Error calculating premium:', err);
        }
    }, [policyMakerContract, account]);

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

    return { policies, isLoading, error, checkPolicyOwnership, payInitialPremium, fetchPolicy, payPremium, calculatePremium, calculatedPremium };
};

export default usePolicyContract;
