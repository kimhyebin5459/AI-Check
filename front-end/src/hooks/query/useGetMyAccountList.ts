import { getMyAccountList } from '@/apis/account';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';

const useGetMyAccountList = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.MY_ACCOUNT_LIST],
    queryFn: () => getMyAccountList(),
  });
};

export default useGetMyAccountList;
