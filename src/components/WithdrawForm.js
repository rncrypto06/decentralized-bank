import { useState } from "react"

const WithdrawForm = ({ onWithdraw }) => {
  const [amountToWithdraw, setAmountToWithdraw] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    onWithdraw({ amountToWithdraw });
    setAmountToWithdraw('');
  }

  return (
    <form className='withdraw-form' onSubmit={onSubmit}>
      <div className='form-control'>
        <label>Enter the amount of Matic to Withdraw</label>
        <input
          type='decimal'
          value={amountToWithdraw}
          className='form-control'
          placeholder='Enter Amount'
          pattern="^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$"
          onChange={(e) => setAmountToWithdraw(e.target.value)}
        />
      </div>
      <button type='submit' className='btn'>Withdraw</button>
    </form>
  )
}

export default WithdrawForm
