import { useState, useEffect, useCallback } from 'react';
import { useContracts } from './useContracts'; // Import your useContracts hook
import { useMetaMask } from '@/contexts/MetaMaskContext';
import {ethers} from "ethers"; // Import the MetaMask context


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
            const isOwner = await policyMakerContract.policyOwners(policyId, accountAddress);
            return isOwner;
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
            console.log(nextIdBigNumber);
            if (nextIdBigNumber != null) {
                for (let i = 1; i < nextIdBigNumber; i++) {
                    const policy = await policyMakerContract.policies(i.toString());
                    console.log(policy);
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

    return { policies, isLoading, error, checkPolicyOwnership, payInitialPremium };
};

export default usePolicyContract;
