import { Component, OnInit, OnDestroy } from '@angular/core';
import { Credit } from '../../types/credit';
import { CommonModule } from '@angular/common';
import { CreditService } from '../../services/credit.service';
import { NgFor } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '../pagination/pagination.component';
import { Subscription } from 'rxjs';
import { CreditFilterService } from '../../services/filter.service';

@Component({
  selector: 'app-general-table',
  standalone: true,
  imports: [CommonModule, NgFor, ReactiveFormsModule, NgbPaginationModule, Pagination],
  templateUrl: './general-table.component.html',
  styleUrls: ['./general-table.component.scss'],
})
export class GeneralTableComponent implements OnInit, OnDestroy {
  credits: Credit[] = [];
  filteredCredits: Credit[] = [];
  filterForm: FormGroup;
  paginatedData: Credit[] = [];
  itemsPerPage = 10;
  currentPage = 1;
  totalItems = 0;
  private subscription: Subscription = new Subscription();

  constructor(
    private dataService: CreditService,
    private creditFilterService: CreditFilterService,
  ) {
    this.filterForm = this.creditFilterService.getFilterForm();
  }

  ngOnInit(): void {
    this.subscription.add(
      this.dataService.getCredits().subscribe((data) => {
        this.credits = data;
        this.filteredCredits = data;
        this.totalItems = data.length;
        this.updatePaginatedData();
      })
    );

    this.subscription.add(
      this.filterForm.valueChanges.subscribe(() => {
        this.applyFilters();
      })
    );

    this.subscription.add(
      this.filterForm.get('itemsPerPage')?.valueChanges.subscribe(value => {
        this.itemsPerPage = value;
        this.updatePaginatedData();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  applyFilters(): void {
    const { issuanceDate, returnDate, overdueStatus } = this.filterForm.value;

    this.filteredCredits = this.credits;

    if (issuanceDate) {
      this.filteredCredits = this.filteredCredits.filter(credit => 
        new Date(credit.issuance_date) >= new Date(issuanceDate)
      );
    }

    if (returnDate) {
      this.filteredCredits = this.filteredCredits.filter(credit => 
        new Date(credit.return_date) <= new Date(returnDate)
      );
    }

    if (overdueStatus) {
      this.filteredCredits = this.filteredCredits.filter(credit => 
        overdueStatus === 'overdue' ? credit.actual_return_date : !credit.actual_return_date
      );
    }

    this.totalItems = this.filteredCredits.length;
    this.currentPage = 1;
    this.updatePaginatedData();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePaginatedData();
  }

  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.filteredCredits.slice(startIndex, endIndex);
  }

  onItemsPerPageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newItemsPerPage = +target.value;
    if (newItemsPerPage !== this.itemsPerPage) {
      this.itemsPerPage = newItemsPerPage;
      this.updatePaginatedData();
    }
  }
}