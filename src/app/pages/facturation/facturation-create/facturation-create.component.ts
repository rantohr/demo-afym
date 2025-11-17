import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormField, GenericFormComponent } from '../../../components/generic-form/generic-form.component';

@Component({
  selector: 'app-facturation-create',
  standalone: true,
  imports: [CommonModule, GenericFormComponent],
  templateUrl: './facturation-create.component.html',
  styleUrl: '../facturation.component.scss'
})
export class FacturationCreateComponent {

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
    { name: "", type: "ghost" },
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
  ];

  constructor(private router: Router) { }

  navigate() {
    this.router.navigate(['/facturation']);
  }

  handleForm(data: any) {
    console.log('Form submitted:', data);
  }

  handleMailForm(data: any) {
    console.log('Form submitted:', data);
  }
}
