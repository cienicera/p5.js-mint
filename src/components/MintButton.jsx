import React, { useState } from 'react';
import { Button, Card, Typography } from 'antd';
import TransactionStatus from './TransactionStatus';
import { useTransactionStatus } from '../hooks/useTransactionStatus';

const { Title } = Typography;

const MintButton = ({ nftContract, mintData }) => {
  const [showStatus, setShowStatus] = useState(false);
  const { 
    status, 
    txHash, 
    error, 
    startTransaction, 
    cancelTransaction, 
    retryTransaction 
  } = useTransactionStatus();

  const handleMint = async () => {
    try {
      setShowStatus(true);
      
      const transaction = {
        contractAddress: nftContract,
        entrypoint: 'mint',
        calldata: [mintData.amount]
      };

      await startTransaction(transaction);
    } catch (error) {
      console.error('Mint failed:', error);
    }
  };

  const handleCancel = () => {
    cancelTransaction();
    setShowStatus(false);
  };

  const handleRetry = () => {
    retryTransaction({
      contractAddress: nftContract,
      entrypoint: 'mint',
      calldata: [mintData.amount]
    });
  };

  return (
    <div>
      <Card>
        <Title level={4}>Mint Your NFT</Title>
        <Button 
          type="primary" 
          size="large"
          onClick={handleMint}
          style={{ width: '100%' }}
        >
          Mint Now
        </Button>
      </Card>

      {showStatus && (
        <TransactionStatus
          status={status}
          txHash={txHash}
          error={error}
          onRetry={handleRetry}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default MintButton;
