import { Component, OnInit } from '@angular/core';
import { Credit } from '../../types/credit';
import { CommonModule } from '@angular/common';
import { CreditService } from '../../services/credit.service';
import { NgFor } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-general-table',
  standalone: true,
  imports: [CommonModule, NgFor, ReactiveFormsModule, NgbPaginationModule],
  templateUrl: './general-table.component.html',
  styleUrls: ['./general-table.component.scss'],
})
export class GeneralTableComponent implements OnInit {
  credits: Credit[] = [];
  filteredCredits: Credit[] = [];
  filterForm: FormGroup;
  paginatedData: Credit[] = [];
  itemsPerPage = 10;
  currentPage = 1;
  totalItems = 0;

  constructor(private dataService: CreditService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      issuanceDate: [''],
      returnDate: [''],
      overdueStatus: [''],
      itemsPerPage: [10]
    });
  }

  ngOnInit(): void {
    this.dataService.getCredits().subscribe((data) => {
      this.credits = data;
      this.filteredCredits = data;
      this.totalItems = data.length;
      this.updatePaginatedData();
    });

    this.filterForm.get('itemsPerPage')?.valueChanges.subscribe(value => {
      this.itemsPerPage = value;
      this.updatePaginatedData();
    });
  }

  applyFilters(): void {
    const { issuanceDate, returnDate, overdueStatus } = this.filterForm.value;
    const today = new Date();

    this.filteredCredits = this.credits.filter((credit) => {
      const issuanceDateMatch =
        !issuanceDate ||
        new Date(credit.issuance_date) >= new Date(issuanceDate);
      const returnDateMatch =
        !returnDate || new Date(credit.return_date) <= new Date(returnDate);

      let overdueMatch = true;
      if (overdueStatus === 'overdue') {
        overdueMatch =
          !credit.actual_return_date && new Date(credit.return_date) < today;
      } else if (overdueStatus === 'notOverdue') {
        overdueMatch = credit.actual_return_date !== null;
      }

      return issuanceDateMatch && returnDateMatch && overdueMatch;
    });

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
