import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import usePolicyContract from '@/hooks/usePolicyContract';
import {ethers} from "ethers";
import {useMetaMask} from "@/contexts/MetaMaskContext"; // Import the usePolicyContract hook

const PolicyManager = () => {
    const router = useRouter();
    const { policyId } = router.query; // Retrieve the policyId from query parameters
    const { fetchPolicy } = usePolicyContract(); // Initialize the usePolicyContract hook
    const { account } = useMetaMask();
    const [policy, setPolicy] = useState(null);

    useEffect(() => {
        const loadPolicy = async () => {
            if (policyId) {
                const policyDetails = await fetchPolicy(policyId, account);
                setPolicy(policyDetails);
            }
        };

        loadPolicy();
    }, [policyId, fetchPolicy]);

    // Render your component with policy and owner details
    return (
        <div>
            {policy ? (
                <div>
                    {/* Render policy details here */}
                    <h1>Policy Details</h1>
                    <p>ID: {policy.id}</p>
                    <p>Coverage Amount: {ethers.utils.formatEther(policy.coverageAmount)}</p>
                    {/* Add more details as needed */}
                </div>
            ) : (
                <p>Loading policy details...</p>
            )}
        </div>
    );
};

export default PolicyManager;
