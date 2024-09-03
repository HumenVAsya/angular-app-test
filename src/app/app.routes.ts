import { Routes } from '@angular/router';
import { BriefInformationComponent } from './components/brief-information/brief-information.component';
import { GeneralTableComponent } from './components/general-table/general-table.component';

export const routes: Routes = [
  { path: 'brief-info', component: BriefInformationComponent },
  { path: 'general-table', component: GeneralTableComponent },
  { path: '', redirectTo: '/general-table', pathMatch: 'full' }
];
