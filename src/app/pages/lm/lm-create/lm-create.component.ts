import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lm-create',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lm-create.component.html',
  styleUrl: '../lm.component.scss'
})
export class LmCreateComponent {

  constructor(private router: Router) { }

  navigate() {
    this.router.navigate(['/lettre-de-mission']);
  }
}
