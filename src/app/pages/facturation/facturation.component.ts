import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
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
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { FormField, GenericFormComponent } from '../../components/generic-form/generic-form.component';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-facturation',
  standalone: true,
  imports: [CommonModule, AgGridAngular, FormsModule, MatFormFieldModule, MatSelectModule, MatTabsModule, MatButtonModule],
  templateUrl: './facturation.component.html',
  styleUrl: './facturation.component.scss'
})
export class FacturationComponent {
  selectedEtat = 'Tous';
  states = ['Tous', 'Payée', 'Brouillon', 'Envoyée', 'Perdu'];
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
      id: 1,
      creationDate: "2025-01-12",
      billNumber: "FAC-2025-001",
      clientName: "Dupont SA",
      amountHT: 1200,
      amountTTC: 1440,
      state: "Payée",
      reminderInterval: 15,
      mailModel: "Modèle 01"
    },
    {
      id: 2,
      creationDate: "2025-01-15",
      billNumber: "FAC-2025-002",
      clientName: "Alpha Consulting",
      amountHT: 850,
      amountTTC: 1020,
      state: "Envoyée",
      reminderInterval: 7,
      mailModel: "Modèle 02"
    },
    {
      id: 3,
      creationDate: "2025-01-20",
      billNumber: "FAC-2025-003",
      clientName: "Martin & Co",
      amountHT: 460,
      amountTTC: 552,
      state: "Brouillon",
      reminderInterval: 0,
      mailModel: "Modèle 03"
    },
    {
      id: 4,
      creationDate: "2025-02-01",
      billNumber: "FAC-2025-004",
      clientName: "Société Leroy",
      amountHT: 2300,
      amountTTC: 2760,
      state: "Perdu",
      reminderInterval: 30,
      mailModel: "Modèle 01"
    },
    {
      id: 5,
      creationDate: "2025-02-05",
      billNumber: "FAC-2025-005",
      clientName: "TechVision",
      amountHT: 995,
      amountTTC: 1194,
      state: "Envoyée",
      reminderInterval: 10,
      mailModel: "Modèle 04"
    },
    {
      id: 6,
      creationDate: "2025-02-07",
      billNumber: "FAC-2025-006",
      clientName: "Bâtiments Durand",
      amountHT: 1500,
      amountTTC: 1800,
      state: "Payée",
      reminderInterval: 0,
      mailModel: "Modèle 01"
    },
    {
      id: 7,
      creationDate: "2025-02-10",
      billNumber: "FAC-2025-007",
      clientName: "Gamma Transport",
      amountHT: 300,
      amountTTC: 360,
      state: "Envoyée",
      reminderInterval: 14,
      mailModel: "Modèle 02"
    },
    {
      id: 8,
      creationDate: "2025-02-12",
      billNumber: "FAC-2025-008",
      clientName: "Studio Horizon",
      amountHT: 780,
      amountTTC: 936,
      state: "Brouillon",
      reminderInterval: 0,
      mailModel: "Modèle 03"
    },
    {
      id: 9,
      creationDate: "2025-02-14",
      billNumber: "FAC-2025-009",
      clientName: "Agence Nova",
      amountHT: 640,
      amountTTC: 768,
      state: "Perdu",
      reminderInterval: 21,
      mailModel: "Modèle 04"
    },
    {
      id: 10,
      creationDate: "2025-02-15",
      billNumber: "FAC-2025-010",
      clientName: "Solutions Dumas",
      amountHT: 1120,
      amountTTC: 1344,
      state: "Envoyée",
      reminderInterval: 5,
      mailModel: "Modèle 02"
    }
  ];

  rowData: any[] = [];

  colDefs: ColDef[] = [
    {
      field: "creationDate", headerName: "Date de création", cellRenderer: (params: any) => params.value.split('-').reverse().join('/'),
      filter: "agDateColumnFilter", flex: 1
    },
    {
      field: "billNumber", headerName: "Facture",
      filter: "agTextColumnFilter", flex: 1
    },
    {
      field: "clientName", headerName: "Client",
      filter: "agTextColumnFilter", flex: 1
    },
    {
      field: "amountHT", headerName: "Montant HT", cellRenderer: (params: any) => `${params.value} €`,
      filter: "agNumberColumnFilter", flex: 1,
    },
    {
      field: "amountTTC", headerName: "Montant TTC", cellRenderer: (params: any) => `${params.value} €`,
      filter: "agNumberColumnFilter", flex: 1,
    },
    {
      field: "state", headerName: "Etat", flex: 1,
      cellRenderer: (params: any) => {
        let color = '#b00000';
        let emoji = '❌';
        switch (params.value) {
          case 'Payée':
            color = '#008500';
            emoji = '✅';
            break;
          case 'Brouillon':
            color = '#767676';
            emoji = '⌛';
            break;
          case 'Envoyée':
            color = '#ea9029ff';
            emoji = '📤';
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
      field: "send", headerName: "", width: 30,
      cellRenderer: (params: any) => {
        const icon = document.createElement('i');
        icon.classList.add('fa-solid', 'fa-paper-plane');
        icon.style.cursor = 'pointer';
        icon.style.color = '#009688';
        icon.addEventListener('click', () => this.openSendDialog(params));
        return icon;
      }
    },
    {
      field: "edit", headerName: "", width: 30,
      cellRenderer: (params: any) => {
        const icon = document.createElement('i');
        icon.classList.add('fa-solid', 'fa-pen-to-square');
        icon.style.cursor = 'pointer';
        icon.addEventListener('click', () => this.openEditDialog(params));
        return icon;
      }
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

  openEditDialog(params: any): void {
    const dialogRef = this.dialog.open(EditFacturationDialogComponent, {
      data: this.initData.find(d => d.id === params.data.id)
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // handle me
      }
    });
  }

  openSendDialog(params: any): void {
    const dialogRef = this.dialog.open(SendFacturationDialogComponent, {
      data: this.initData.find(d => d.id === params.data.id)
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // handle me
      }
    });
  }

  create() {
    this.router.navigate(['/creation-facturation']);
  }

  navigate() {
    this.router.navigate(['/facturation']);
  }
}


@Component({
  selector: 'app-edit-facturation-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, GenericFormComponent],
  template: `
    <div class="edit-dialog">
      <h3>Modification de facture</h3>
      <h3>Informations</h3>
      <app-generic-form [fields]="formFields" (submitForm)="handleForm($event)"></app-generic-form>
      <br><hr>
      <h3>Paramétrage de mail de relance</h3>
      <app-generic-form style="width: -webkit-fill-available;" [fields]="mailFormFields" (submitForm)="handleMailForm($event)"></app-generic-form>
    </div>
  `,
  styleUrls: ['./facturation.component.scss']
})
export class EditFacturationDialogComponent {
  formFields: FormField[] = [
    {
      name: "billNumber",
      label: "N° Facture",
      type: "select",
      required: true,
      options: [
        { value: "FAC-2025-001", label: "FAC-2025-001" },
        { value: "FAC-2025-002", label: "FAC-2025-002" },
        { value: "FAC-2025-003", label: "FAC-2025-003" },
      ]
    },
    {
      name: "clientName",
      label: "Client",
      type: "select",
      required: true,
      options: [
        { value: "Dupont SA", label: "Dupont SA" },
        { value: "Alpha Consulting", label: "Alpha Consulting" },
        { value: "Martin & Co", label: "Martin & Co" },
        { value: "TechVision", label: "TechVision" }
      ]
    },
    { name: "", type: "ghost" },
    {
      name: "amountHT",
      label: "Montant HT",
      type: "number",
      required: true,
    },
    {
      name: "amountTTC",
      label: "Montant TTC",
      type: "number",
      required: true,
    },
    {
      name: "state",
      label: "État",
      type: "select",
      required: true,
      options: [
        { value: "Payée", label: "Payée" },
        { value: "Brouillon", label: "Brouillon" },
        { value: "Envoyée", label: "Envoyée" },
        { value: "Perdu", label: "Perdu" }
      ]
    }
  ];

  mailFormFields: FormField[] = [
    {
      name: "reminderInterval",
      label: "Interval de Relance (en j)",
      type: "number",
      required: true,
    },
    {
      name: "mailModel",
      label: "Modèle de mail",
      type: "select",
      required: true,
      options: [
        { value: "Modèle 01", label: "Modèle 01" },
        { value: "Modèle 02", label: "Modèle 02" },
        { value: "Modèle 03", label: "Modèle 03" },
      ]
    },
    { name: '', type: 'ghost' },
  ];

  @ViewChild('firstInput') firstInput!: ElementRef;

  constructor(public dialogRef: MatDialogRef<EditFacturationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    for (let key in data) {
      const idx = this.formFields.findIndex(e => e.name === key);
      const idx2 = this.mailFormFields.findIndex(e => e.name === key);
      if (Object.hasOwn(data, key)) {
        if (idx > -1) this.formFields[idx].value = data[key];
        else if (idx2 > -1) this.mailFormFields[idx2].value = data[key];
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  handleForm(data: any) {
    console.log('Form submitted:', data);
  }

  handleMailForm(data: any) {
    console.log('Form submitted:', data);
  }
}

@Component({
  selector: 'app-send-facturation-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, GenericFormComponent],
  template: `
    <div class="send-dialog">
      <h3>Envoi manuel du mail de relance</h3>
      <app-generic-form [fields]="formFields" (submitForm)="handleForm($event)"></app-generic-form>
    </div>
  `,
  styleUrls: ['./facturation.component.scss']
})
export class SendFacturationDialogComponent {
  formFields: FormField[] = [
    {
      name: "mailModel",
      label: "Modèle de mail",
      type: "select",
      required: true,
      options: [
        { value: "Modèle 01", label: "Modèle 01" },
        { value: "Modèle 02", label: "Modèle 02" },
        { value: "Modèle 03", label: "Modèle 03" },
      ]
    },
    { name: '', type: 'ghost' },
    { name: '', type: 'ghost' },
    {
      name: "email",
      label: "Email",
      value: "eve@afym.eu",
      type: "text",
      required: true,
    },
    {
      name: "subject",
      label: "Sujet",
      value: "Rappel pour le paiement de la facture FAC-2025-001",
      type: "text",
      required: true,
    },
    { name: '', type: 'ghost' },
    {
      name: "body",
      label: "Corps",
      value: `Bonjour,\nNous n’avons pas encore reçu le règlement de la facture n° [Numéro], arrivée à échéance le [Date].\nPouvez-vous nous confirmer sa prise en charge ?\nCordialement,`,
      type: "textarea",
      required: true,
      fullSize: true
    },
    {
      name: "mobile",
      label: "Mobile",
      type: "text",
    },
    {
      name: "sms",
      label: "Notifier le client par SMS",
      type: "checkbox",
    },
  ];

  constructor(public dialogRef: MatDialogRef<SendFacturationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  handleForm(data: any) {
    console.log('Form submitted:', data);
  }
}