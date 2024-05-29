import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;
  public isLoad: boolean = false;
  public errStr: String | undefined;
  public subscription?: Subscription;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService, 
  ) { 
    this.subscription = this.tokenService.isAuthenticated().subscribe( value => this.isAuthenticated(value));
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberAccount: ['']
    });
    
    // Verifica se existem credenciais no localStorage e preenche o formulário com eles, se disponíveis
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");

    if (storedUsername && storedPassword) {
      this.loginForm.patchValue({
        username: storedUsername,
        password: storedPassword,
        rememberAccount: true
      });
    }
  }

  isAuthenticated(value : boolean) {
    if (value) {
      this.router.navigate(["/"]);
    }
  }

  // Método para acessar os campos do formulário no template
  get formControls() {
    return this.loginForm.controls;
  }

  // Manipulação de erros
  public handleError(err: HttpErrorResponse) {
    if (err.status === 401){
      this.errStr = `Usuário ou senha incorretos!`;
    }
    else {
      this.errStr = `Erro: ` + err.status
    }
  }

  onLogin(): void {
    this.subscription = this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
      next: () => {
        this.router.navigate(["/usuario"]);
        if (this.loginForm.value.rememberAccount == true) {
          localStorage.setItem("username", this.loginForm.value.username)
          localStorage.setItem("password", this.loginForm.value.password)
        }
        else {
          localStorage.removeItem("username");
          localStorage.removeItem("password");
        }
      },
      error: (err) => {
        this.handleError(err);
      },
    });
  }
}
