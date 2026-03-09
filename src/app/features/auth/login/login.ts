import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {

  errorMessage: string = '';
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {

    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

  }

  submit() {

    if (this.form.invalid) return;

    this.errorMessage = '';

    this.authService.login(this.form.value).subscribe({

      next: () => {
        this.router.navigate(['/tasks']);
      },

      error: (err) => {

        console.log("LOGIN ERROR:", err);

        this.errorMessage = err.error || "Invalid username or password";

        // Force UI update
        this.cdr.detectChanges();

      },

    });

  }

}