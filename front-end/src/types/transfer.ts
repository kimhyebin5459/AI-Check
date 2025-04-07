export interface Transfer {
  name: string;
  image: string | null;
  accountNo: string;
  amount: number;
}

export interface AccountContirmResponse {
  receiver: {
    name: string;
    image: string | null;
    accountNo: string;
  };
  sender: {
    accountNo: string;
    accountName: string;
    balance: number;
  };
}

export interface TransferPostForm {
  receiverAccountNo: string;
  amount: number;
}
