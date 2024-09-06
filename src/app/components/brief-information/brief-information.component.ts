import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { CreditService } from '../../services/credit.service';
import { AggregationService } from '../../services/filter-breif.service'; 
import { Credit, AggregatedCredit, GroupedCredits } from '../../types/credit';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-brief-information',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './brief-information.component.html',
  styleUrls: ['./brief-information.component.scss'],
})
export class BriefInformationComponent implements OnInit, OnDestroy {
  credits: Credit[] = [];
  aggregatedData: AggregatedCredit[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private dataService: CreditService,
    private aggregationService: AggregationService
  ) {}

  ngOnInit(): void {
    const creditsSubscription = this.dataService
      .getCredits()
      .subscribe((data) => {
        this.credits = data;
        const groupedCredits = this.aggregationService.groupCreditsByYearMonth(this.credits);
        this.aggregatedData = this.transformGroupedData(groupedCredits);
        this.sortAggregatedData();
      });

    this.subscription.add(creditsSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private transformGroupedData(grouped: GroupedCredits): AggregatedCredit[] {
    return Object.keys(grouped).flatMap((year) =>
      Object.keys(grouped[year] || {}).map((month) => {
        const entry = grouped[year][month] || {
          total: 0,
          count: 0,
          totalPercent: 0,
        };
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

  private sortAggregatedData(): void {
    this.aggregatedData.sort((a, b) => {
      const dateA = new Date(parseInt(a.year), parseInt(a.month) - 1);
      const dateB = new Date(parseInt(b.year), parseInt(b.month) - 1);

      return dateA.getTime() - dateB.getTime();
    });
  }
}