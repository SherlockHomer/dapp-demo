import { useState, useEffect } from 'react';

export default (provider) => {
  const [account, setAccount] = useState('');
  const [publicKey, setPublicKey] = useState(null);

  const handleConnectedCallback = async (val) => {
    console.log('handleConnect: ', val);
    setAccount(val);
  };

  const handleAccountChanged = async (val) => {
    console.log('handleAccountChanged: ', val);
    setAccount(val);
    const newPublicKey = await provider.getPublicKey();
    setPublicKey(newPublicKey);
  };

  const requestAccounts = async () => {
    console.log('btc - requestAccounts');
    const accounts = await provider.requestAccounts();
    console.log('btc - requestAccounts - accounts: ', accounts);
    setAccount(accounts[0]);
    const key = await provider.getPublicKey();
    setPublicKey(key);
  };

  const connect = async () => {
    if (!provider) return;
    await provider.connect();
    const accounts = await provider.getAccounts();
    handleConnectedCallback(accounts[0]);
  };

  const getPublicKey = async () => {
    if (!provider) return;
    const res = await provider.getPublicKey();
    console.log('publicKey: ', res);
    setPublicKey(res);
  };

  const getAccounts = async () => {
    if (!provider) return;
    const res = await provider.getAccounts();
    console.log('btc - getAccounts: ', res);
  };

  const disconnect = async () => {
    if (!provider) return;
    await provider.disconnect();

    // reload
    window.location.reload();
  };

  useEffect(() => {
    console.log('useConnect: ', provider);
    if (!provider || !provider?.on) return;

    // subscribe to connect event
    provider.on('connect', handleConnectedCallback);

    // subscribe to accountChanged
    provider.on('accountChanged', (newAccount) => {
      handleAccountChanged(newAccount);
    });

    // subscribe to accountsChanged
    provider.on('accountsChanged', (newAccounts) => {
      console.log('btc - accountsChanged: ', newAccounts);
    });

    // request account
    requestAccounts();

    if (provider.connected) {
      // get public key
      getPublicKey();

      // getAccounts
      getAccounts();
    }
  }, [provider]);

  return {
    account,
    publicKey,
    connect,
    disconnect,
  };
};
