import { Injectable } from '@angular/core';
import { Credit, GroupedCredits } from '../types/credit';

@Injectable({
  providedIn: 'root',
})
export class AggregationService {
  constructor() {}

  groupCreditsByYearMonth(credits: Credit[]): GroupedCredits {
    return credits.reduce<GroupedCredits>((acc, item) => {
      if (!item.issuance_date || !item.body || !item.percent) {
        return acc;
      }

      const date = new Date(item.issuance_date);
      const year = date.getFullYear().toString();
      const month = String(date.getMonth() + 1).padStart(2, '0');

      if (!acc[year]) {
        acc[year] = {};
      }

      if (!acc[year][month]) {
        acc[year][month] = { total: 0, count: 0, totalPercent: 0 };
      }

      acc[year][month].count += 1;
      acc[year][month].total += item.body;
      acc[year][month].totalPercent += item.percent;

      if (item.actual_return_date) {
        acc[year][month].returnedCount =
          (acc[year][month].returnedCount || 0) + 1;
      }

      return acc;
    }, {});
  }
}