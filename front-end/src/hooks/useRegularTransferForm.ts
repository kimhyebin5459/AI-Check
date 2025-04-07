import { formatDay } from '@/utils/formatDay';
import useInput from './useInput';
import { useEffect, useRef } from 'react';
import { IntervalType } from '@/types/regularTransfer';

const useRegularTransferForm = (amount?: number, interval?: IntervalType, day?: string) => {
  const { value: selectedAmount, onChange: handleAmountChange } = useInput<number>(amount || 0);
  const { value: selectedInterval, setValue: setSelectedInterval } = useInput<IntervalType | undefined>(interval);
  const {
    value: selectedDay,
    onChange: handleDayChange,
    setValue: setSelectedDay,
  } = useInput<string>(day ? formatDay(day) : '');

  const prevSelectedInterval = useRef(selectedInterval);

  useEffect(() => {
    if (prevSelectedInterval.current !== selectedInterval) {
      setSelectedDay('');
    }
    prevSelectedInterval.current = selectedInterval;
  }, [selectedInterval, setSelectedDay]);

  const formatNumber = (num: string) => {
    if (!num) return '';
    return num.replace(/\D/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    const formattedValue = formatNumber(rawValue);
    handleAmountChange({ target: { value: formattedValue } } as React.ChangeEvent<HTMLInputElement>);
  };

  return {
    selectedAmount,
    selectedInterval,
    selectedDay,
    handleDayChange,
    handleChange,
    setSelectedInterval,
  };
};
export default useRegularTransferForm;
