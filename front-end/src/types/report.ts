export type CategoryName = '교통' | '식비' | '교육' | '여가' | '생활';

export interface SecondCategory {
  secondCategoryId: number;
  displayName: string;
  amount: number;
  percentage: number;
}

export interface FirstCategory {
  firstCategoryId: number;
  displayName: CategoryName;
  amount: number;
  percentage: number;
  subCategories: SecondCategory[];
}

export interface Report {
  id: string;
  year: number;
  month: number;
  totalAmount: number;
  categories: FirstCategory[];
}

export interface CategoryReportResponse extends Report {
  name: string;
}

export interface PeerReportResponse extends Report {
  peerGroup: string;
}

export interface PeerReport {
  name: CategoryName;
  amount: number;
  peerAmount: number;
}
