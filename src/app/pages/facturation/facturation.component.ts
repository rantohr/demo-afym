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
      amount: 120.00,
      reminderInterval: 20,
      mailModel: 'Modèle 01',
    },
    {
      clientNumber: '002',
      clientName: 'Client B',
      creationDate: '2025-02-20',
      state: 'Signé',
      signatureDate: '2025-02-22',
      amount: 450.00,
      reminderInterval: 20,
      mailModel: 'Modèle 01',
    },
    {
      clientNumber: '003',
      clientName: 'Client C',
      creationDate: '2025-03-05',
      state: 'En attente',
      signatureDate: '2025-03-07',
      amount: 900.00,
      reminderInterval: 20,
      mailModel: 'Modèle 01',
    },
    {
      clientNumber: '004',
      clientName: 'Client D',
      creationDate: '2025-04-10',
      state: 'Perdu',
      signatureDate: '2025-04-12',
      amount: 300.00,
      reminderInterval: 20,
      mailModel: 'Modèle 01',
    },
    {
      clientNumber: '005',
      clientName: 'Client E',
      creationDate: '2025-05-01',
      state: 'En attente',
      signatureDate: '2025-05-03',
      amount: 700.00,
      reminderInterval: 20,
      mailModel: 'Modèle 01',
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
      data: this.initData.find(d => d.clientNumber === params.data.clientNumber)
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // handle me
      }
    });
  }

  openSendDialog(params: any): void {
    const dialogRef = this.dialog.open(SendFacturationDialogComponent, {
      data: this.initData.find(d => d.clientNumber === params.data.clientNumber)
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
      name: "clientNumber",
      label: "N° Client",
      type: "number",
      required: true,
    },
    {
      name: "clientName",
      label: "Client",
      type: "text",
      required: true,
    },
    { name: '', type: 'ghost' },
    {
      name: "signatureDate",
      label: "Date de signature",
      type: "date",
    },
    {
      name: "amount",
      label: "Montant HT",
      type: "number",
    },
    {
      name: "state",
      label: "Etat",
      type: "select",
      required: true,
      options: [
        { value: "Signé", label: "Signé" },
        { value: "En attente", label: "En attente" },
        { value: "Perdu", label: "Perdu" }
      ]
    },
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
      <h3>Envoi de mail de relance</h3>
      <app-generic-form [fields]="formFields" (submitForm)="handleForm($event)"></app-generic-form>
    </div>
  `,
  styleUrls: ['./facturation.component.scss']
})
export class SendFacturationDialogComponent {
  formFields: FormField[] = [
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
      value: "Votre document pour signature",
      type: "text",
      required: true,
    },
    { name: '', type: 'ghost' },
    {
      name: "body",
      label: "Corps",
      value: `Vous êtes signataire du document ci-après.\nMerci de bien vouloir le signer électroniquement en cliquant sur le lien ci-dessous.\nCordialement,`,
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
      label: "Notifier le signataire par SMS",
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