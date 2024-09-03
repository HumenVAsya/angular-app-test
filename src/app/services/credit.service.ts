import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credit } from '../types/credit';

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private apiUrl = 'https://raw.githubusercontent.com/LightOfTheSun/front-end-coding-task-db/master/db.json'
  constructor(private http: HttpClient) { }

  getCredits(): Observable<Credit[]> {
    return this.http.get<Credit[]>(this.apiUrl);
  }
}
