import { useState, useEffect } from 'react';

const useTransferAmount = (initialAmount: number, balance: number) => {
  const [amount, setAmount] = useState(initialAmount);
  const [isWithdrawable, setIsWithdrawable] = useState(false);

  useEffect(() => {
    setIsWithdrawable(amount > 0 && amount <= balance);
  }, [amount, balance]);

  const handleNumberClick = (num: number) => {
    const next = amount * 10 + num;
    if (next.toString().length > 13) return;
    setAmount(next);
  };

  const handleNumberPlus = (num: number) => {
    const next = amount + num;
    if (next.toString().length > 13) return;
    setAmount(next);
  };

  const handleBackspace = () => {
    if (amount > 0) setAmount(Math.floor(amount / 10));
  };

  return {
    amount,
    isWithdrawable,
    handleNumberClick,
    handleNumberPlus,
    handleBackspace,
  };
};

export default useTransferAmount;
