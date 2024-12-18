import { message } from 'antd';
import { useEffect, useState } from 'react';

export default () => {
  let tronWeb;

  const [account, setAccount] = useState(window.tronWeb.defaultAddress?.base58);
  const handleConnect = async () => {
    const resp = await tronLink.request({ method: 'tron_requestAccounts' });
    const { code } = resp;

    code && code !== 200 && message.error(code);
    // tronWeb = tronLink.tronWeb;
    setAccount(window.tronWeb.defaultAddress?.base58 || '');
  };

  useEffect(() => {
    window.addEventListener('message', ({ data }) => {
      if (data.message?.action === 'accountsChanged') {
        console.log('postEvent accountsChanged event', data.message?.data);
        setAccount(window.tronWeb.defaultAddress?.base58 || '');
      }
      if (data.message?.action === 'disconnect') {
        console.log('postEvent disconnect event');
      }
      if (data.message?.action === 'connect') {
        console.log('postEvent connect event');
      }
    });
    window.tron.on('accountsChanged', (addr) => {
      console.log('accountsChanged event -> addr', addr);
    });
    window.tron.on('connect', (addr) => {
      console.log('connect event -> addr', addr);
    });
    window.tron.on('disconnect', () => {
      setAccount('');
      console.log('disconnect event');
    });

    window.tron.on('chainChanged', (chain) => {
      console.log('chainChanged -> chain', chain);
    });
  }, []);

  return { account, handleConnect };
};
