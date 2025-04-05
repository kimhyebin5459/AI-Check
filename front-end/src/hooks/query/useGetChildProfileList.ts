import { getChildProfileList } from '@/apis/user';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';

const useGetChildProfileList = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHILD_LIST],
    queryFn: () => getChildProfileList(),
  });
};

export default useGetChildProfileList;
