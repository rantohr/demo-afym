import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormField, GenericFormComponent } from '../../../components/generic-form/generic-form.component';

@Component({
  selector: 'app-lm-create',
  standalone: true,
  imports: [CommonModule, GenericFormComponent],
  templateUrl: './lm-create.component.html',
  styleUrl: '../lm.component.scss'
})
export class LmCreateComponent {

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
    { name: '', type: 'ghost' },
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
  ];

  constructor(private router: Router) { }

  navigate() {
    this.router.navigate(['/lettre-de-mission']);
  }

  handleForm(data: any) {
    console.log('Form submitted:', data);
  }
  
  handleMailForm(data: any) {
    console.log('Form submitted:', data);
  }
}
