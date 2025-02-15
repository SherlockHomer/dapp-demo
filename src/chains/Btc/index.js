import { Space } from 'antd-mobile';
import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import useConnect from './hooks/useConnect';
import useNetwork from './hooks/useNetwork';
import Account from './components/account';
import Network from './components/network';
import DontHaveWallet from '../../components/DontHaveWallet';
import Connect from './components/connect';
import SwitchChain from './components/switchChain';
import SignMessage from './components/signMessage';
import Psbt from './components/psbt';
import Send from './components/send';
import ComingSoon from './components/comingSoon';
import Rpc from './components/rpc';

const key = 'Btc';

function Btc() {
  const [provider, setProvider] = useState(null);
  const [fractalProvider, setFractalProvider] = useState(null);
  const {
    account, publicKey, connect, disconnect,
  } = useConnect(provider);
  const { chain, getNetwork } = useNetwork(provider);

  useEffect(() => {
    if (!window?.okxwallet?.bitcoin && !window?.okxwallet?.fractalbitcoin) {
      return;
    }
    const init = async () => {
      if (window.okxwallet?.bitcoin) {
        setProvider(window.okxwallet.bitcoin); // set window.okxwallet.bitcoin as provider
      }
      if (window.okxwallet?.fractalBitcoin) {
        setFractalProvider(window.okxwallet.fractalBitcoin); // set window.okxwallet.fractalBitcoin as fractalProvider
      }
    };

    init();
  }, []);

  if (!window?.okxwallet?.bitcoin) {
    return <DontHaveWallet chain={key} />;
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <>
        <Connect account={account} connect={connect} disconnect={disconnect} />
        {provider ? (
          <>
            <Account account={account} publicKey={publicKey} />
            <Network chain={chain} />

            <SwitchChain
              provider={provider}
              disabled={!account}
              getNetwork={getNetwork}
            />
            <SignMessage
              provider={provider}
              fractalProvider={fractalProvider}
              disabled={!account}
            />
            <Psbt
              provider={provider}
              fractalProvider={fractalProvider}
              account={account}
              disabled={!account}
            />
            <Send
              provider={provider}
              fractalProvider={fractalProvider}
              account={account}
              disabled={!account}
            />
            <Rpc
              provider={provider}
              fractalProvider={fractalProvider}
              disabled={!account}
            />
            <ComingSoon provider={provider} disabled />
          </>
        ) : (
          <Spin />
        )}
      </>
    </Space>
  );
}

export default {
  key,
  children: <Btc />,
};
