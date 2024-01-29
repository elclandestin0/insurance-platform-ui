import {useEffect, useState} from 'react';
import {useContracts} from './useContracts'; // Import your useContracts hook


const useTokenContract = () => {
    const {aWethContract} = useContracts();
    const [isLoading, setIsAwethLoading] = useState(true);
    const [error, setError] = useState<unknown>();

    const fetchTokenBalance = async (address: string): Promise<any> => {
        if (!aWethContract) {
            console.error("Contract not initialized.");
            return null;
        }
        try {
            // Invest in Aave Pool
            return await aWethContract.balanceOf(address);
        } catch (error) {
            console.error("Error fetching pool reserve data:", error);
            setError(error);
            return [];
        }
    };


    useEffect(() => {
        if (aWethContract) {
            setIsAwethLoading(false); // Set loading state before fetching
        }
    }, [aWethContract]);

    return {fetchTokenBalance, isLoading, error};
};

export default useTokenContract;
