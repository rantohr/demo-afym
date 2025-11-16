import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgCharts } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AgCharts, FormsModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }],
})
export class DashboardComponent {
  factureCharts: { title: string, chart: AgChartOptions }[] = [];
  tresorerieChart: AgChartOptions = {};
  levels = [{ value: 'Admin', text: 'Admin' }, { value: 'Pro', text: 'Production' }, { value: 'Com', text: 'Commercial' },]
  selectedLevel = 'Admin';
  dateRange = { start: new Date('2025-01-01'), end: new Date('2025-12-31') };

  constructor() {
    this.factureCharts = [
      {
        title: 'Tenue Comptable & Fiscale', chart: {
          data: [
            { asset: "Facture réglée", amount: 60000 },
            { asset: "Facture non-réglée", amount: 40000 }
          ],
          series: [
            { type: "donut", angleKey: "amount", legendItemKey: "asset", fills: ['#00576e', '#65a397'] },
          ],
        }
      },
      {
        title: 'Mission Sociale', chart: {
          data: [
            { asset: "Facture réglée", amount: 34000 },
            { asset: "Facture non-réglée", amount: 40000 }
          ],
          series: [
            { type: "donut", angleKey: "amount", legendItemKey: "asset", fills: ['#00576e', '#65a397'] },
          ],
          theme: "ag-polychroma"
        }
      },
      {
        title: 'Mission Juridique', chart: {
          data: [
            { asset: "Facture réglée", amount: 67000 },
            { asset: "Facture non-réglée", amount: 86000 }
          ],
          series: [
            { type: "donut", angleKey: "amount", legendItemKey: "asset", fills: ['#00576e', '#65a397'] },
          ],
          theme: "ag-polychroma"
        }
      },
      {
        title: 'Mission Exceptionnelle', chart: {
          data: [
            { asset: "Facture réglée", amount: 1000 },
            { asset: "Facture non-réglée", amount: 11600 }
          ],
          series: [
            { type: "donut", angleKey: "amount", legendItemKey: "asset", fills: ['#00576e', '#65a397'] },
          ],
          theme: "ag-polychroma"
        }
      },
    ];

    this.tresorerieChart = {
      data: [
        { month: "Jan", comptabilite: 222, fiscalite: 400, juridique: 200, sociale: 244, exceptionnelle: 50 },
        { month: "Fév", comptabilite: 210, fiscalite: 245, juridique: 195, sociale: 235, exceptionnelle: 55 },
        { month: "Mar", comptabilite: 230, fiscalite: 265, juridique: 210, sociale: 250, exceptionnelle: 62 },
        { month: "Avr", comptabilite: 240, fiscalite: 275, juridique: 205, sociale: 258, exceptionnelle: 66 },
        { month: "Mai", comptabilite: 258, fiscalite: 290, juridique: 220, sociale: 268, exceptionnelle: 72 },
        { month: "Juin", comptabilite: 270, fiscalite: 295, juridique: 218, sociale: 280, exceptionnelle: 76 },
        { month: "Jul", comptabilite: 129, fiscalite: 305, juridique: 225, sociale: 290, exceptionnelle: 82 },
        { month: "Août", comptabilite: 280, fiscalite: 320, juridique: 238, sociale: 300, exceptionnelle: 78 },
        { month: "Sep", comptabilite: 292, fiscalite: 310, juridique: 245, sociale: 305, exceptionnelle: 88 },
        { month: "Oct", comptabilite: 24, fiscalite: 335, juridique: 250, sociale: 310, exceptionnelle: 95 },
        { month: "Nov", comptabilite: 320, fiscalite: 340, juridique: 260, sociale: 325, exceptionnelle: 102 },
        { month: "Déc", comptabilite: 220, fiscalite: 350, juridique: 270, sociale: 335, exceptionnelle: 110 }
      ],

      series: [
        { type: "line", xKey: "month", yKey: "comptabilite", yName: "Comptabilité" },
        { type: "line", xKey: "month", yKey: "fiscalite", yName: "Fiscalité" },
        { type: "line", xKey: "month", yKey: "juridique", yName: "Juridique" },
        { type: "line", xKey: "month", yKey: "sociale", yName: "Sociale" },
        { type: "line", xKey: "month", yKey: "exceptionnelle", yName: "Exceptionnelle" }
      ]
    };

  }
}
