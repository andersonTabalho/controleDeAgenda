import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { objectUsuario } from 'src/app/models/objectUsuario';
import { TokenService } from 'src/app/services/token.service';
import { Mascara } from 'src/app/models/models-sistema/mascara';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NovaSenha } from 'src/app/models/models-sistema/novaSenha';
import { AtualizarCadastro } from 'src/app/models/models-antigas/atualizarCadastro';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  public myGroup!: FormGroup;
  public mySenha!: FormGroup;
  public hidePassword = true;
  public hideNewPassword = true;
  public usuario?: objectUsuario;
  public subscription?: Subscription;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    this.buscarUsuario();
  }

  ngOnInit(): void {
    this.myGroup = this.fb.group({
      id: [null],
      cpf: ['', [Validators.pattern(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)]],
      dataNascimento: [''],
      email: ['', [Validators.email]],
      nome: [''],
      telefone: ['', [Validators.pattern(/^\(\d{2}\) \d{5}\-\d{4}$/)]],
      username: ['']
    });

    this.mySenha = this.fb.group({
      newPassword: ['', [Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]],
      password: [''],
      username: [''],
    });

    // Definindo o ID do usuário logado no formulário
    const userId = this.tokenService.getId();
    if (userId) {
      this.myGroup.patchValue({ id: userId });
    } else {
      alert('ID do usuario nao é valido');
    }
  }

  CpfMask(): void {
    const cpfControl = this.myGroup.get('cpf');
    if (cpfControl) {
      let value = cpfControl.value;
      value = Mascara.cpfMask(value);
      cpfControl.setValue(value, { emitEvent: false });
    }
  }

  phoneMask(): void {
    const phoneControl = this.myGroup.get('telefone');
    if (phoneControl) {
      let value = phoneControl.value;
      value = Mascara.phoneMask(value);
      phoneControl.setValue(value, { emitEvent: false });
    }
  }

  buscarUsuario(): void {
    this.subscription = this.http.get<objectUsuario>(`/api/usuario/buscar/${this.tokenService.getId()}`)
      .subscribe({
        next: (res) => {
          this.usuario = res;
          this.myGroup.patchValue({
            id: this.usuario.object.usuario.id,
            cpf: this.usuario.object.usuario.cpf,
            dataNascimento: this.usuario.object.usuario.dataNascimento,
            email: this.usuario.object.usuario.email,
            nome: this.usuario.object.usuario.nome,
            telefone: this.usuario.object.usuario.telefone,
            username: this.usuario.object.usuario.username
          });
        },
        error: (err) => {
          alert('erro ao chamar' + err);
        }
      });
  }

  onSubmit(): void {
    if (this.myGroup.valid) {
      const cadastroData: AtualizarCadastro = this.myGroup.value;
      this.subscription = this.http.put('/api/usuario/atualizar', cadastroData).subscribe({
        next: (res) => {
          alert("Dados atualizados com sucesso!!");
        },
        error: (err) => {
          alert('Erro ao atualizar o cadastro');
        },
      });
    }
  }

  senhaNova(): void {
    if (this.mySenha.valid) {
      const novaSenha: NovaSenha = this.mySenha.value;
      this.subscription = this.http.post('/api/usuario/alterarSenha', novaSenha).subscribe({
        next: (res) => {
          alert("Senha atualizada com sucesso!!");
        },
        error: (err) => {
          alert('Erro ao atualizar a senha');
        },
      });
    }
  }
}
