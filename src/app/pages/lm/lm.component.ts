import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, GetRowIdFunc, GetRowIdParams, GridApi, GridOptions, GridReadyEvent, Theme } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from "ag-grid-community";
import { AG_GRID_LOCALE_FR } from "@ag-grid-community/locale";
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { DeleteConfirmationDialogComponent } from '../../components/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-lm',
  standalone: true,
  imports: [CommonModule, AgGridAngular, FormsModule, MatFormFieldModule, MatSelectModule, MatTabsModule, MatButtonModule],
  templateUrl: './lm.component.html',
  styleUrl: './lm.component.scss'
})
export class LmComponent {
  selectedEtat = 'Tous';
  states = ['Tous', 'Signé', 'En attente', 'Perdu'];
  missions = ['Comptable', 'Fiscale', 'Sociale', 'Juridique', 'Exceptionnelle'];

  theme: Theme | "legacy" = themeQuartz.withParams({
    accentColor: "#006b7a",
  });
  localeText: {
    [key: string]: string;
  } = AG_GRID_LOCALE_FR;
  private _gridApi!: GridApi;
  gridOptions: GridOptions<any> = {
    suppressCellFocus: true,
    defaultColDef: {
      autoHeaderHeight: true,
      wrapHeaderText: true,
    },
  };

  initData = [
    {
      clientNumber: '001',
      clientName: 'Client A',
      creationDate: '2025-01-15',
      state: 'Signé',
      signatureDate: '2025-01-18',
      amount: 120.00
    },
    {
      clientNumber: '002',
      clientName: 'Client B',
      creationDate: '2025-02-20',
      state: 'Signé',
      signatureDate: '2025-02-22',
      amount: 450.00
    },
    {
      clientNumber: '003',
      clientName: 'Client C',
      creationDate: '2025-03-05',
      state: 'En attente',
      signatureDate: '2025-03-07',
      amount: 900.00
    },
    {
      clientNumber: '004',
      clientName: 'Client D',
      creationDate: '2025-04-10',
      state: 'Perdu',
      signatureDate: '2025-04-12',
      amount: 300.00
    },
    {
      clientNumber: '005',
      clientName: 'Client E',
      creationDate: '2025-05-01',
      state: 'En attente',
      signatureDate: '2025-05-03',
      amount: 700.00
    }
  ];

  rowData: any[] = [];

  colDefs: ColDef[] = [
    {
      field: "clientNumber", headerName: "N° Client",
      filter: "agTextColumnFilter", flex: 1
    },
    {
      field: "clientName", headerName: "Client",
      filter: "agTextColumnFilter", flex: 1
    },
    {
      field: "creationDate", headerName: "Date de création", cellRenderer: (params: any) => params.value.split('-').reverse().join('/'),
      filter: "agDateColumnFilter", flex: 1
    },
    {
      field: "state", headerName: "Etat", flex: 1,
      cellRenderer: (params: any) => {
        let color = '#b00000';
        let emoji = '❌';
        switch (params.value) {
          case 'Signé':
            color = '#008500';
            emoji = '✅';
            break;
          case 'En attente':
            color = '#767676';
            emoji = '⌛';
            break;
          default:
            color = '#b00000';
            break;
        }
        return `<span style="border: 1px solid ${color};
          width: 95px;
          border-radius: 4px;
          display: block;
          display: flex;
          align-items: center;
          padding-left: 3px;
          height: 33px;">${emoji} ${params.value}</span>
        `;
      }
    },
    {
      field: "signatureDate", headerName: "Date de signature", cellRenderer: (params: any) => params.value.split('-').reverse().join('/'),
      filter: "agDateColumnFilter", flex: 1
    },
    {
      field: "amount", headerName: "Montant HT", cellRenderer: (params: any) => `${params.value} €`,
      filter: "agNumberColumnFilter", flex: 1,
    },
    {
      field: "edit", headerName: "", width: 30,
      cellRenderer: (params: any) => `<i class="fa-solid fa-pen-to-square" style="cursor: pointer;"></i>`
    },
    {
      field: "delete", headerName: "", width: 30,
      cellRenderer: (params: any) => {
        const icon = document.createElement('i');
        icon.classList.add('fa-solid', 'fa-trash-can');
        icon.style.cursor = 'pointer';
        icon.style.color = 'red';
        icon.addEventListener('click', () => this.openConfirmDialog(params));
        return icon;
      }
    },
  ];

  constructor(public dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.rowData = JSON.parse(JSON.stringify(this.initData));
  }

  getRowId(params: GetRowIdParams): GetRowIdFunc {
    return params.data.id;
  };

  onGridReady(params: GridReadyEvent) {
    this._gridApi = params.api;
  }

  onFilter() {
    this.rowData = this.initData.filter(i => i.state === this.selectedEtat || this.selectedEtat === 'Tous');
  }

  openConfirmDialog(params: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const rowIndex = params.rowIndex;
        params.api.applyTransaction({ remove: [params.node.data] });
        console.log('Deleted item at row index:', rowIndex);
      }
    });
  }

  create() {
    this.router.navigate(['/creation-lettre-de-mission']);
  }

  navigate() {
    this.router.navigate(['/lettre-de-mission']);
  }
}
