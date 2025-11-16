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
    { name: 'firstName', label: 'First Name', type: 'text', required: true },
    { name: 'age', label: 'Age', type: 'number' },
    { name: 'birthDate', label: 'Birth Date', type: 'date' },
    {
      name: 'country',
      label: 'Country',
      type: 'select',
      options: [
        { label: 'France', value: 'fr' },
        { label: 'Madagascar', value: 'mg' },
        { label: 'Japan', value: 'jp' },
      ],
    },
    { name: 'ghost1', type: 'ghost' },
    { name: 'ghost2', type: 'ghost' },
    { name: 'subscribe', label: 'Subscribe to newsletter', type: 'checkbox' },
  ];

  constructor(private router: Router) { }

  navigate() {
    this.router.navigate(['/lettre-de-mission']);
  }

  handleForm(data: any) {
    console.log('Form submitted:', data);
  }
}
