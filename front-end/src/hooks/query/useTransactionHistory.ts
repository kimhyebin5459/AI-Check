import { useQuery } from '@tanstack/react-query';
import { getTransactionHistory } from '@/apis/moneycheck';
import { TransactionGroup, TransactionFilterType } from '@/types/transaction';
import { formatDateToParam } from '@/utils/fotmatDate';

const TRANSACTION_HISTORY_KEY = 'transactionHistory';

interface UseTransactionHistoryParams {
  childId?: number;
  startDate: Date;
  endDate: Date;
  type?: TransactionFilterType;
  enabled?: boolean;
}

const useTransactionHistory = ({
  childId,
  startDate,
  endDate,
  type = 'ALL',
  enabled = true,
}: UseTransactionHistoryParams) => {
  return useQuery<TransactionGroup[], Error>({
    queryKey: [TRANSACTION_HISTORY_KEY, childId, formatDateToParam(startDate), formatDateToParam(endDate), type],
    queryFn: async () => {
      const formattedStartDate = formatDateToParam(startDate);
      const formattedEndDate = formatDateToParam(endDate);

      return await getTransactionHistory({
        childId,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        type,
      });
    },
    enabled,
    staleTime: 1 * 60 * 1000,
  });
};

export default useTransactionHistory;
