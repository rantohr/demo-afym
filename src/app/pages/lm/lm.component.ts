import { ChangeDetectorRef, Component, ElementRef, inject, Inject, ViewChild } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-lm',
  standalone: true,
  imports: [CommonModule, AgGridAngular, FormsModule, MatFormFieldModule, MatSelectModule, MatTabsModule, MatButtonModule],
  templateUrl: './lm.component.html',
  styleUrl: './lm.component.scss'
})
export class LmComponent {
  private _snackBar = inject(MatSnackBar);
  
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
      id: '112',
      clientNumber: '001',
      clientName: 'Alpha Consulting',
      creationDate: '2025-01-15',
      state: 'Signé',
      signatureDate: '2025-01-18',
      amount: 120.00,
      reminderInterval: 20,
      mailModel: 'Modèle 01',
    },
    {
      id: '113',
      clientNumber: '002',
      clientName: 'Dupont SA',
      creationDate: '2025-02-20',
      state: 'Signé',
      signatureDate: '2025-02-22',
      amount: 450.00,
      reminderInterval: 20,
      mailModel: 'Modèle 01',
    },
    {
      id: '114',
      clientNumber: '003',
      clientName: 'Dupont SA',
      creationDate: '2025-03-05',
      state: 'En attente',
      signatureDate: '2025-03-07',
      amount: 900.00,
      reminderInterval: 20,
      mailModel: 'Modèle 01',
    },
    {
      id: '116',
      clientNumber: '004',
      clientName: 'Alpha Consulting',
      creationDate: '2025-04-10',
      state: 'Perdu',
      signatureDate: '2025-04-12',
      amount: 300.00,
      reminderInterval: 20,
      mailModel: 'Modèle 01',
    },
    {
      id: '117',
      clientNumber: '005',
      clientName: 'Martin & Co',
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
        this._snackBar.open("Lettre de mission supprimée ✅", undefined, { duration: 4000, horizontalPosition: "right", verticalPosition: "bottom" });
      }
    });
  }

  openEditDialog(params: any): void {
    const dialogRef = this.dialog.open(EditLmDialogComponent, {
      data: this.initData.find(d => d.id === params.data.id)
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._snackBar.open("Vos modifications ont bien été enregistrées ✅", undefined, { duration: 4000, horizontalPosition: "right", verticalPosition: "bottom" });
      }
    });
  }

  openSendDialog(params: any): void {
    const dialogRef = this.dialog.open(SendLmDialogComponent, {
      data: this.initData.find(d => d.id === params.data.id)
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._snackBar.open("Email envoyé et document généré ✅", undefined, { duration: 4000, horizontalPosition: "right", verticalPosition: "bottom" });
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


@Component({
  selector: 'app-edit-lm-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, GenericFormComponent],
  template: `
    <div class="edit-dialog">
      <h3>Modification de lettre de mission</h3>
      <app-generic-form [fields]="formFields" (submitForm)="handleForm($event)"></app-generic-form>
    </div>
  `,
  styleUrls: ['./lm.component.scss']
})
export class EditLmDialogComponent {
  formFields: FormField[] = [
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
    { name: '', type: 'ghost' },
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

  @ViewChild('firstInput') firstInput!: ElementRef;

  constructor(public dialogRef: MatDialogRef<EditLmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    for (let key in data) {
      const idx = this.formFields.findIndex(e => e.name === key);
      if (Object.hasOwn(data, key)) {
        if (idx > -1) this.formFields[idx].value = data[key];
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
    this.onConfirm();
  }
}

@Component({
  selector: 'app-send-lm-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, GenericFormComponent],
  template: `
    <div class="send-dialog">
      <h3>Faire signer un document</h3>
      <h4><i class="fa-regular fa-envelope"></i> Signature à distance / e-mail + SMS</h4>
      <app-generic-form [fields]="formFields" (submitForm)="handleForm($event)"></app-generic-form>
    </div>
  `,
  styleUrls: ['./lm.component.scss']
})
export class SendLmDialogComponent {
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

  constructor(public dialogRef: MatDialogRef<SendLmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  handleForm(data: any) {
    console.log('Form submitted:', data);
    this.onConfirm();
  }
}