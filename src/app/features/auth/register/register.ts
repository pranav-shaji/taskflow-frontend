import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  errorMessage = '';
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.errorMessage = '';

    this.authService.register(this.form.value).subscribe({
      next: () => {
        console.log('REGISTER SUCCESS - NAVIGATING');
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        if (err.status === 400) {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Something went wrong';
        }
      },
    });
  }
}
