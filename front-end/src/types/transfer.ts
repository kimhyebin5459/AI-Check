export interface Transfer {
  name: string;
  image: string;
  accountNo: string;
  amount: number;
}

export interface TransferPostForm {
  receiverAccountNo: string;
  amount: number;
}
