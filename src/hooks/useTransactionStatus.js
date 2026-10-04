import { useState, useEffect } from 'react';
import starknetService from '../services/starknetService';

export const useTransactionStatus = () => {
  const [status, setStatus] = useState('idle');
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);
  const [blockNumber, setBlockNumber] = useState(null);

  const startTransaction = async (transaction) => {
    try {
      setStatus('pending');
      setError(null);
      setTxHash(null);
      setBlockNumber(null);

      const response = await starknetService.sendTransaction(transaction);
      setTxHash(response.transactionHash);

      // Listen for transaction confirmation
      const receipt = await starknetService.waitForTransaction(response.transactionHash);
      
      if (receipt.status === 'accepted_on_chain') {
        setStatus('confirmed');
        setBlockNumber(receipt.block_number);
      } else {
        setStatus('failed');
        setError(`Transaction failed with status: ${receipt.status}`);
      }
    } catch (err) {
      setStatus('failed');
      setError(err.message || 'Transaction failed');
    }
  };

  const cancelTransaction = () => {
    setStatus('idle');
    setTxHash(null);
    setError(null);
    setBlockNumber(null);
  };

  const retryTransaction = (transaction) => {
    startTransaction(transaction);
  };

  return {
    status,
    txHash,
    error,
    blockNumber,
    startTransaction,
    cancelTransaction,
    retryTransaction
  };
};
