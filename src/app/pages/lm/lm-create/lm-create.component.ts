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
    {
      name: "state",
      label: "Etat",
      type: "select",
      required: true,
      options: [
        { value: "Signé", label: "Signé" },
        { value: "En attente", label: "En attente" },
        { value: "Refusé", label: "Refusé" }
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
}
