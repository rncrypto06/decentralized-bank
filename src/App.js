import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import addresses from './environment/contract-address.json';
import Bank from './blockchain/artifacts/blockchain/contracts/Bank.sol/Bank.json';
import Token from './blockchain/artifacts/blockchain/contracts/Token.sol/Token.json';

import Header from './components/Header';
import DepositForm from './components/DepositForm';
import WithdrawForm from './components/WithdrawForm';

const CHAIN_ID = 80001;

function App() {

  const [userTotalAssets, setUserTotalAssets] = useState(0);  //referencing  mapping(address => uint256) public accounts;
  const [totalAsset, setTotalAsset] = useState(0);            // referencing address(this).balance;
  const [yieldTokens, setYieldTokens] = useState(0);

  const [signer, setSigner] = useState(undefined);
  const [bankContract, setBankContract] = useState(undefined);
  const [tokenContract, setTokenContract] = useState(undefined);
  

  useEffect(() => {
    const init = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      provider.on("network", (newNetwork, oldNetwork) => {
        if (oldNetwork) {
          window.location.reload();
        }
      });
      const signer = provider.getSigner();
      if (await signer.getChainId() !== CHAIN_ID) {
        alert("Please change your network to mumbai testnet!");
      }
      
      const bankContract = new ethers.Contract(addresses.bankcontract, Bank.abi, signer);
      const tokenContract = new ethers.Contract(addresses.tokencontract, Token.abi, signer);

      setUserTotalAssets(ethers.utils.formatEther(await bankContract.accounts(await signer.getAddress())));
      setTotalAsset(ethers.utils.formatEther(await bankContract.totalAssets()));
      setYieldTokens(ethers.utils.formatEther(await tokenContract.balanceOf(await signer.getAddress())));

      setSigner(signer);
      setBankContract(bankContract);
      setTokenContract(tokenContract);
    };
    init();
  }, [])

  const withdraw = async (val) => {

    try {
      const tx = await bankContract.withdraw(
        ethers.utils.parseEther(val.amountToWithdraw),
        addresses.tokencontract
      );
      await tx.wait();
      setUserTotalAssets(ethers.utils.formatEther(await bankContract.accounts(await signer.getAddress())));
      setTotalAsset(ethers.utils.formatEther(await bankContract.totalAssets()));
      setYieldTokens(ethers.utils.formatEther(await tokenContract.balanceOf(await signer.getAddress())));
    } catch (error) {
      alert(error.data.message.toString());
    }
  };

  const deposit = async (val) => {

    const tx = await bankContract.deposit(
      {value: ethers.utils.parseEther(val.amountToDeposit)}
    );
    await tx.wait();
    setUserTotalAssets(ethers.utils.formatEther(await bankContract.accounts(await signer.getAddress())));
    setTotalAsset(ethers.utils.formatEther(await bankContract.totalAssets()));
    setYieldTokens(ethers.utils.formatEther(await tokenContract.balanceOf(await signer.getAddress())));

  };

  return (
    <div className="container">
      <Header />
        <p>User Total Asset: {userTotalAssets}</p>
        <p>Total Asset: {totalAsset}</p>
        <p>Amount of Yield Tokens: {yieldTokens}</p>
        
      <DepositForm onDeposit={deposit} />
      <WithdrawForm onWithdraw={withdraw} />

    </div>
  );
}

export default App;
