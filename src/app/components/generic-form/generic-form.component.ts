import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

export interface FormField {
    name: string;
    type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'ghost';
    label?: string;
    required?: boolean;
    options?: { label: string; value: any }[];
}

@Component({
    selector: 'app-generic-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCheckboxModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatTabsModule, MatButtonModule, MatDatepickerModule],
    templateUrl: './generic-form.component.html',
    styleUrls: ['./generic-form.component.scss'],
    providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }]
})
export class GenericFormComponent {

    @Input() fields: FormField[] = [];
    @Output() submitForm = new EventEmitter<any>();

    form!: FormGroup;

    constructor(private fb: FormBuilder) { }

    ngOnInit() {
        const group: any = {};

        this.fields.forEach((field) => {
            group[field.name] = [
                '',
                field.required ? Validators.required : []
            ];
        });

        this.form = this.fb.group(group);
    }

    onSubmit() {
        if (this.form.valid) {
            this.submitForm.emit(this.form.value);
        } else {
            this.form.markAllAsTouched();
        }
    }
}