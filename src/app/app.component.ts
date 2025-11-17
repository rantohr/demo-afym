import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  showMenu = true;
  showCrm = true;

  sidebarItems = [
    {
      label: 'Tableau de bord',
      icon: 'fa-solid fa-chart-line',
      link: '/',
      id: 'dashboard'
    },
    {
      label: 'CRM',
      icon: 'fa-solid fa-user-group',
      link: '#',
      showSubItems: this.showCrm,
      subItems: [
        { label: 'Email', icon: 'fa-regular fa-envelope', link: '#' },
        { label: 'Contacts', icon: 'fa-regular fa-address-book', link: '#' },
        { label: 'Entreprise', icon: 'fa-regular fa-building', link: '#' },
        { label: 'Clients', icon: 'fa-solid fa-users', link: '#' },
        { label: 'Transactions', icon: 'fa-solid fa-arrow-right-arrow-left', link: '#' },
        { label: 'Temps', icon: 'fa-solid fa-clock', link: '#' },
      ]
    },
    {
      label: 'Lettre de mission',
      icon: 'fa-regular fa-newspaper',
      link: '/lettre-de-mission',
      id: 'lm'
    },
    {
      label: 'Facturation',
      icon: 'fa-solid fa-file-invoice',
      link: '/facturation',
      id: 'facturation'
    },
    {
      label: 'Production',
      icon: 'fa-solid fa-briefcase',
      link: '#',
      disabled: true
    },
    {
      label: 'Paramètres',
      icon: 'fa-solid fa-gear',
      link: '#',
      disabled: true
    }
  ];

  activeMenu: any = this.sidebarItems[0];

  constructor(private router: Router, public dialog: MatDialog) {
    setTimeout(() => this.openReminderDialog(), 3000);
  }

  toggleCrm() {
    this.showCrm = !this.showCrm;
    this.sidebarItems[1].showSubItems = this.showCrm;
  }

  setActiveMenu(item: any) {
    if (item.disabled) return;
    this.activeMenu = item;
    this.router.navigate([item.link]);
  }

  openReminderDialog(): void {
    const dialogRef = this.dialog.open(ReminderDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // handle me
      }
    });
  }
}


@Component({
  selector: 'app-reminder-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div class="reminder-dialog">
        <h3>Confirmation de mail de relance</h3>
        <i class="fa-solid fa-circle-info"></i>
        <div>
            Un e-mail de relance concernant la facture FAC-2025-01-S1FR4 du client Tiffany & Co va être envoyé.
        </div>
        <div>
            Souhaitez-vous poursuivre ?
        </div>
        <div style="margin-top: 1em;">
            <button mat-raised-button (click)="onCancel()" style="margin-right: 1em">Annuler</button>
            <button mat-raised-button class="confirm-btn" (click)="onConfirm()">Confirmer</button>
        </div>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class ReminderDialogComponent {

  constructor(public dialogRef: MatDialogRef<ReminderDialogComponent>) { }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}