import React, { useState } from 'react'

const DepositForm = ({onDeposit}) => {
  const [amountToDeposit, setAmountToDeposit] = useState('')

  const onSubmit = e => {
    e.preventDefault();
    onDeposit({ amountToDeposit });
    setAmountToDeposit('');
  }

  return (
    <form className='deposit-form' onSubmit={onSubmit}>
      <div className='form-control'>
        <label>Enter the amount of Matic to deposit</label>
        <input
          type='decimal'
          value={amountToDeposit}
          className='form-control'
          placeholder='Enter Amount'
          pattern="^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$"
          onChange={(e) => setAmountToDeposit(e.target.value)}
        />
      </div>
        <button type='submit' className='btn'>Deposit</button>
    </form>
  )
}

export default DepositForm
