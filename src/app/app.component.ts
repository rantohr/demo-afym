import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

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
  activeMenu = 'dashboard';

  constructor(private router: Router) {}

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

  toggleCrm() {
    this.showCrm = !this.showCrm;
    this.sidebarItems[1].showSubItems = this.showCrm;
  }

  setActiveMenu(item: any) {
    if (item.disabled) return;
    this.activeMenu = item.id;
    this.router.navigate([item.link]);  
  }
}
