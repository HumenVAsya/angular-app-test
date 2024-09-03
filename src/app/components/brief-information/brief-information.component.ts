import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { CreditService } from '../../services/credit.service';
import { Credit } from '../../types/credit';


interface GroupedCredits {
  [year: string]: {
    [month: string]: {
      total: number;
      count: number;
      totalPercent: number;
      returnedCount?: number;
    };
  };
}

interface AggregatedCredit {
  year: string;
  month: string;
  issuedCreditsCount: number;
  averageIssueAmount: number;
  totalIssuedAmount: number;
  totalPercent: number;
  returnedCreditsCount: number;
}

@Component({
  selector: 'app-brief-information',
  standalone: true,
  imports: [CommonModule, NgFor,],
  templateUrl: './brief-information.component.html',
  styleUrls: ['./brief-information.component.scss'],
})
export class BriefInformationComponent implements OnInit {
  credits: Credit[] = [];
  aggregatedData: AggregatedCredit[] = [];

  constructor(private dataService: CreditService) {}

  ngOnInit(): void {
    this.dataService.getCredits().subscribe((data) => {
      this.credits = data;
      this.aggregatedData = this.aggregateCreditData();
    });
  }

  aggregateCreditData(): AggregatedCredit[] {
    const grouped = this.credits.reduce<GroupedCredits>((acc, item) => {
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
        acc[year][month].returnedCount = (acc[year][month].returnedCount || 0) + 1;
      }

      return acc;
    }, {});

    return Object.keys(grouped).flatMap((year) =>
      Object.keys(grouped[year] || {}).map((month) => {
        const entry = grouped[year][month] || { total: 0, count: 0, totalPercent: 0 };
        const issuedCreditsCount = entry.count;
        const averageIssueAmount = entry.count ? entry.total / entry.count : 0;
        const totalIssuedAmount = entry.total;
        const totalPercent = entry.totalPercent;
        const returnedCreditsCount = entry.returnedCount || 0;

        return {
          year,
          month,
          issuedCreditsCount,
          averageIssueAmount,
          totalIssuedAmount,
          totalPercent,
          returnedCreditsCount,
        };
      })
    );
  }
}
