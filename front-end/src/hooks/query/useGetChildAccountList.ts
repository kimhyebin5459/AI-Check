import { getChildAccountList } from '@/apis/account';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';

const useGetChildAccountList = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHILD_ACCOUNT_LIST],
    queryFn: () => getChildAccountList(),
  });
};

export default useGetChildAccountList;
