export interface Credit {
  id: number;
  user: string;
  issuance_date: string;
  return_date: string;
  actual_return_date: string;
  body: number;
  percent: number;
}

export interface GroupedCredits {
  [year: string]: {
    [month: string]: {
      total: number;
      count: number;
      totalPercent: number;
      returnedCount?: number;
    };
  };
}

export interface AggregatedCredit {
  year: string;
  month: string;
  issuedCreditsCount: number;
  averageIssueAmount: number;
  totalIssuedAmount: number;
  totalPercent: number;
  returnedCreditsCount: number;
}
