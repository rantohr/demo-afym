import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, GetRowIdFunc, GetRowIdParams, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AG_GRID_LOCALE_FR } from "@ag-grid-community/locale";
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-lm',
  standalone: true,
  imports: [CommonModule, AgGridAngular, FormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './lm.component.html',
  styleUrl: './lm.component.scss'
})
export class LmComponent {
  selectedEtat = 'Tous';
  states = ['Tous', 'Signé', 'En attente', 'Perdu'];

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
      amount: 12000.50
    },
    {
      clientNumber: '002',
      clientName: 'Client B',
      creationDate: '2025-02-20',
      state: 'Signé',
      signatureDate: '2025-02-22',
      amount: 4500.75
    },
    {
      clientNumber: '003',
      clientName: 'Client C',
      creationDate: '2025-03-05',
      state: 'En attente',
      signatureDate: '2025-03-07',
      amount: 9800.00
    },
    {
      clientNumber: '004',
      clientName: 'Client D',
      creationDate: '2025-04-10',
      state: 'Perdu',
      signatureDate: '2025-04-12',
      amount: 15000.30
    },
    {
      clientNumber: '005',
      clientName: 'Client E',
      creationDate: '2025-05-01',
      state: 'En attente',
      signatureDate: '2025-05-03',
      amount: 7800.00
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
    { field: "state", headerName: "Etat", flex: 1 },
    {
      field: "signatureDate", headerName: "Date de signature", cellRenderer: (params: any) => params.value.split('-').reverse().join('/'),
      filter: "agDateColumnFilter", flex: 1
    },
    {
      field: "amount", headerName: "Montant HT",
      filter: "agNumberColumnFilter", flex: 1
    },
  ];

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
}
