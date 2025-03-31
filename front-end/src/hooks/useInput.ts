import { useState } from 'react';

const useInput = <T>(initialValue: T) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValue(e.target.value as T);
  };

  return { value, setValue, onChange };
};

export default useInput;
