import { postIncreaseRequest } from '@/apis/request';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react'; // 상태 관리를 위해 추가

const usePostIncreaseRequest = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null); // 에러 상태 추가

  const mutation = useMutation({
    mutationFn: postIncreaseRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REQUEST_LIST],
      });
      router.push('/request');
    },
    onError: (_error) => {
      const errorMessage = '용돈이 필요하면 부모님께 요청하기를 이용해 보세요';
      setError(errorMessage);
    },
  });

  const clearError = () => {
    setError(null);
  };

  return {
    ...mutation,
    error,
    clearError,
  };
};

export default usePostIncreaseRequest;
