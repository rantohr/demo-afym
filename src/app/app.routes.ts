import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LmComponent } from './pages/lm/lm.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'lettre-de-mission', component: LmComponent },
];
