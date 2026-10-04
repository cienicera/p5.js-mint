import React from 'react';
import { Progress, Alert, Button, Spin, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';

const { Paragraph, Title } = Typography;

const TransactionStatus = ({ status, txHash, error, onRetry, onCancel }) => {
  const getProgressStatus = () => {
    switch (status) {
      case 'pending': return 'active';
      case 'confirmed': return 'success';
      case 'failed': return 'exception';
      default: return 'normal';
    }
  };

  const getProgressPercent = () => {
    switch (status) {
      case 'pending': return 50;
      case 'confirmed': return 100;
      case 'failed': return 100;
      default: return 0;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'pending': return 'Processing Transaction';
      case 'confirmed': return 'Transaction Confirmed';
      case 'failed': return 'Transaction Failed';
      default: return 'Transaction Status';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending': return <LoadingOutlined spin />;
      case 'confirmed': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'failed': return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
      default: return null;
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 20, 
      right: 20, 
      width: 350, 
      zIndex: 1000,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <Alert
        message={getStatusMessage()}
        icon={getStatusIcon()}
        type={status === 'confirmed' ? 'success' : status === 'failed' ? 'error' : 'info'}
        action={
          <div style={{ display: 'flex', gap: '8px' }}>
            {status === 'pending' && (
              <Button size="small" danger onClick={onCancel}>
                Cancel
              </Button>
            )}
            {status === 'failed' && (
              <Button size="small" type="primary" onClick={onRetry}>
                Retry
              </Button>
            )}
          </div>
        }
        showIcon
      />
      <Progress 
        status={getProgressStatus()} 
        percent={getProgressPercent()} 
        style={{ marginTop: '8px' }}
      />
      {txHash && (
        <Paragraph style={{ marginTop: '8px', fontSize: '12px' }}>
          Transaction Hash: {txHash}
        </Paragraph>
      )}
      {error && (
        <Paragraph style={{ marginTop: '8px', fontSize: '12px', color: '#f5222d' }}>
          Error: {error}
        </Paragraph>
      )}
    </div>
  );
};

export default TransactionStatus;
