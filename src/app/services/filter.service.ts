import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Credit } from '../types/credit'

@Injectable({
  providedIn: 'root'
})
export class CreditFilterService {
  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      issuanceDate: [''],
      returnDate: [''],
      overdueStatus: [''],
      itemsPerPage: [10]
    });
  }

  getFilterForm(): FormGroup {
    return this.filterForm;
  }

  applyFilters(credits: Credit[]): Credit[] {
    const { issuanceDate, returnDate, overdueStatus } = this.filterForm.value;
    const today = new Date();

    return credits.filter((credit) => {
      const issuanceDateMatch = !issuanceDate || new Date(credit.issuance_date) >= new Date(issuanceDate);
      const returnDateMatch = !returnDate || new Date(credit.return_date) <= new Date(returnDate);

      let overdueMatch = true;
      if (overdueStatus === 'overdue') {
        overdueMatch = !credit.actual_return_date && new Date(credit.return_date) < today;
      } else if (overdueStatus === 'notOverdue') {
        overdueMatch = credit.actual_return_date !== null;
      }

      return issuanceDateMatch && returnDateMatch && overdueMatch;
    });
  }
}