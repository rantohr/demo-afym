import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LmComponent } from './pages/lm/lm.component';
import { LmCreateComponent } from './pages/lm/lm-create/lm-create.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'lettre-de-mission', component: LmComponent },
    { path: 'creation-lettre-de-mission', component: LmCreateComponent },
];
