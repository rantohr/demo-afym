
import { MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-delete-confirmation-dialog',
    standalone: true,
    imports: [CommonModule, MatButtonModule],
    template: `
    <div class="confirm-dialog">
        <h3>Confirmation de suppression</h3>
        <div>
            Etes-vous de vouloir supprimer cet élément?
        </div>
        <div style="margin-top: 1em;">
            <button mat-raised-button (click)="onCancel()" style="margin-right: 1em">Annuler</button>
            <button mat-raised-button style="color: white; background-color: red" (click)="onConfirm()">Supprimer</button>
        </div>
    </div>
  `,
    styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteConfirmationDialogComponent {

    constructor(public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>) { }

    onCancel(): void {
        this.dialogRef.close(false);
    }

    onConfirm(): void {
        this.dialogRef.close(true);
    }
}