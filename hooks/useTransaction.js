import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "../constants/api";


export const useTransaction = (userId) => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0,
    });
    const [loading, setLoading] = useState(false);

    //useCallback to memoize the function and avoid unnecessary re-renders
    const fetchTransactions = useCallback (async () =>{
        try {
            const response = await fetch(`${API_URL}/transactions/${userId}`);
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    },[userId]);

    const fetchSummary = useCallback (async () =>{
         if (!userId) return;
        try {
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
            const data = await response.json();
            setSummary(data);
            
        } catch (error) {
            console.error("Error fetching summary:", error);
        }
    },[userId]);

    const loadData = useCallback( async () => {
        if(!userId) return;

        setLoading(true);
        try {
            // to use simmultaneously
            await Promise.all([fetchTransactions(), fetchSummary()]);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    }, [userId, fetchTransactions, fetchSummary]);

    const deleteTransaction = async (id) =>{
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`, {method: 'DELETE'});
            if(!response.ok) throw new Error("Failed to delete transaction");
            //refresh data after delete

          loadData();
        Alert.alert("Success", "Transaction deleted successfully");
        } catch (error) {
            console.error("Error while deleting transactions:", error);
            Alert.alert("Error",error.message);
        }
    }

    return {
        transactions,
        summary,
        loading,
        loadData,
        deleteTransaction
    }
}