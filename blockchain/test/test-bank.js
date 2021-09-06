const { expect } = require("chai");
const { ethers } = require("hardhat");

//Describe
describe('Bank App', () => {

  let bank, token, owner, address_1, address_2;
  let addresses;

  beforeEach(async () => {
    const BankContract = await ethers.getContractFactory("Bank");
    bank = await BankContract.deploy();
    await bank.deployed();

    const TokenContract = await ethers.getContractFactory("Token");
    token = await TokenContract.deploy(bank.address);
    await token.deployed();

    [owner, address_1, address_2, ...addresses] = await ethers.getSigners();
  });

  describe('Deployment', () => {
    it("Should have totalAssets of 0", async () => {
      expect(await bank.totalAssets()).to.equal("0");
    });

    it("Should have 0 tokens, and 0 deposit in owner account", async () => {
      expect(await bank.accounts(owner.address)).to.equal("0");
      expect(await token.balanceOf(owner.address)).to.equal("0");
    });
    
    it("Should have 0 tokens, and 0 deposit in address_1 account", async () => {
      expect(await bank.accounts(address_1.address)).to.equal("0");
      expect(await token.balanceOf(address_1.address)).to.equal("0");
    });
    
    it("Should have 0 tokens, and 0 deposit in address_2 account", async () => {
      expect(await bank.accounts(address_2.address)).to.equal("0");
      expect(await token.balanceOf(address_2.address)).to.equal("0");
    });

    describe('Deposit and Withdrawal', () => {
      const oneEth = ethers.utils.parseEther("1.0");

      it("Should let owner deposite 1 ether, then totalAssets should be 1 ether and accounts[owner] should be 1 ether", async () => {
        await bank.connect(owner).deposit({ value: oneEth });
        expect(await bank.totalAssets()).to.equal(oneEth);
        expect(await bank.accounts(owner.address)).to.equal(oneEth);
      });

      it("Should let account_1 Deposit and withdraw 1 Ether, then have 1 Free", async () => {
        await bank.connect(address_1).deposit({ value: oneEth });
        await bank.connect(address_1).withdraw(oneEth, token.address);
        expect(await bank.totalAssets()).to.equal("0");
        expect(await token.balanceOf(address_1.address)).to.equal(oneEth);
      });
      
      it("Should fail when trying to withdraw money you haven't deposited", async () => {
        await expect(bank.connect(address_2).withdraw(oneEth, token.address)).to.be.revertedWith("Cannot withdraw more than deposited.");
      });
    })
    
  });
});
