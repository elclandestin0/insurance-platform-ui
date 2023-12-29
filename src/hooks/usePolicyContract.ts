import { useState, useEffect, useCallback } from 'react';
import { useContracts } from './useContracts'; // Import your useContracts hook
import { useMetaMask } from '@/contexts/MetaMaskContext'; // Import the MetaMask context


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

    return { policies, isLoading, error, checkPolicyOwnership };
};

export default usePolicyContract;
