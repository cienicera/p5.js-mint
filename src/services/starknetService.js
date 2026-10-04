import { Provider, Account, stark } from 'starknet';

class StarknetService {
  constructor() {
    this.provider = new Provider({ network: 'mainnet' });
    this.account = null;
  }

  async connectWallet() {
    try {
      if (window.starknet) {
        await window.starknet.enable();
        this.account = new Account(this.provider, window.starknet.account);
        return true;
      }
      throw new Error('Starknet wallet not found');
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  }

  async sendTransaction(transaction) {
    if (!this.account) {
      throw new Error('Wallet not connected');
    }

    try {
      const response = await this.account.execute(transaction);
      return response;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }

  async waitForTransaction(txHash, options = {}) {
    const { retries = 30, interval = 5000 } = options;
    
    for (let i = 0; i < retries; i++) {
      try {
        const receipt = await this.provider.getTransactionReceipt(txHash);
        if (receipt && receipt.status) {
          return receipt;
        }
      } catch (error) {
        console.log(`Attempt ${i + 1} failed, retrying...`);
      }
      
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    throw new Error('Transaction timeout');
  }

  async getTransactionStatus(txHash) {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      return receipt.status;
    } catch (error) {
      console.error('Error getting transaction status:', error);
      throw error;
    }
  }
}

export default new StarknetService();
