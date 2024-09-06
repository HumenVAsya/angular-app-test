import { Component, EventEmitter, Input, Output } from "@angular/core";
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"],
  imports: [NgbPaginationModule],
  standalone: true,
})
export class Pagination{
  @Input() totalItems = 0;
  @Input() itemsPerPage = 10;
  @Input() currentPage = 1;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }
}