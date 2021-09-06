import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import addresses from './environment/contract-address.json';
import Bank from './blockchain/artifacts/blockchain/contracts/Bank.sol/Bank.json';
import Token from './blockchain/artifacts/blockchain/contracts/Token.sol/Token.json';

const CHAIN_ID = 80001;

function App() {

  const [userTotalAssets, setUserTotalAssets] = useState(0);  //referencing  mapping(address => uint256) public accounts;
  const [totalAsset, setTotalAsset] = useState(0);            // referencing address(this).balance;
  const [amountDeposited, setAmountDeposited] = useState(0);
  const [amountWithdrawn, setAmountWithdrawn] = useState(0);
  const [yieldTokens, setYieldTokens] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
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

  const withdraw = async (e) => {
    e.preventDefault();

    try {
      const tx = await bankContract.withdraw(ethers.utils.parseEther(withdrawalAmount), addresses.tokencontract);
      await tx.wait();
      setUserTotalAssets(ethers.utils.formatEther(await bankContract.accounts(await signer.getAddress())));
      setTotalAsset(ethers.utils.formatEther(await bankContract.totalAssets()));
      setYieldTokens(ethers.utils.formatEther(await tokenContract.balanceOf(await signer.getAddress())));
    } catch (error) {
      alert(error.data.message.toString());
    }
 
    setAmountWithdrawn(withdrawalAmount);
    setWithdrawalAmount('');
  };

  const deposit = async (e) => {
    e.preventDefault();
    const tx = await bankContract.deposit(
      {value: ethers.utils.parseEther(depositAmount)}
    );
    await tx.wait();
    setUserTotalAssets(ethers.utils.formatEther(await bankContract.accounts(await signer.getAddress())));
    setTotalAsset(ethers.utils.formatEther(await bankContract.totalAssets()));
    setYieldTokens(ethers.utils.formatEther(await tokenContract.balanceOf(await signer.getAddress())));
    
    setAmountDeposited(depositAmount);
    setDepositAmount('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Decentralized Bank Dapp</h1>
        <h3>A Reach Hardhat Project</h3>
        <p>User Total Asset: {userTotalAssets}</p>
        <p>Total Asset: {totalAsset}</p>
        <p>Last amount deposited: {amountDeposited}</p>
        <p>Last amount withdrawn: {amountWithdrawn}</p>
        <p>Amount of Yield Tokens: {yieldTokens}</p>
        <form className='deposit-form' onSubmit={(e) => deposit(e)}>
          <div className='form-control'>
            <label>Enter the amount of Matic to deposit</label>
            <input
              type='decimal'
              value={depositAmount}
              className='form-control'
              placeholder='Enter Amount'
              pattern="^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$"
              onChange={(e) => setDepositAmount(e.target.value)}
            />
          </div>
            <button type='submit' className='btn'>Deposit</button>
        </form>

        <form className='withdraw-form' onSubmit={(e) => withdraw(e)}>
          <div className='form-control'>
            <label>Enter the amount of Matic to Withdraw</label>
            <input
              type='decimal'
              value={withdrawalAmount}
              className='form-control'
              placeholder='Enter Amount'
              pattern="^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$"
              onChange={(e) => setWithdrawalAmount(e.target.value)}
            />
          </div>
            <button type='submit' className='btn'>Withdraw</button>
        </form>
      </header>
    </div>
  );
}

export default App;
