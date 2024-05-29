import { Router } from '@angular/router';
import { pessoa } from 'src/app/models/pessoa';
import { usuario } from 'src/app/models/usuario';
import { HttpClient } from '@angular/common/http';
import { contato } from 'src/app/models/contatos';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { objectUsuario } from 'src/app/models/objectUsuario';
import { TokenService } from 'src/app/services/token.service';
import { Mascara } from 'src/app/models/models-sistema/mascara';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription, debounceTime, map, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-create-contato',
  templateUrl: './create-contato.component.html',
  styleUrls: ['./create-contato.component.css']
})
export class CreateContatoComponent implements OnInit, OnDestroy {
  private pessoa!: pessoa;
  public usuario!: usuario;
  private contato!: contato;
  public hidePassword = true;
  public myGroup!: FormGroup;
  public hideNewPassword = true;
  public subscription?: Subscription;
  public filteredOptions!: Observable<pessoa[]>;
  public pessoaSelecionada: pessoa | null = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.myGroup = this.fb.group({
      nome: [''],
      id: [null],
      privado: [false],
      tag: [''],
      telefone: ['', [Validators.pattern(/^\(\d{2}\) \d{5}\-\d{4}$/)]],
      tipoContato: [''],
      email: ['', [Validators.email]],
    });

    // Definindo o ID do usuário logado no formulário
    const userId = this.tokenService.getId();
    if (userId) {
      this.myGroup.patchValue({ id: userId });
    } else {
      alert('ID do usuário não é válido');
    }

    this.filteredOptions = this.myGroup.get('nome')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => this._filter(value || ''))
    );

    this.onUsuario()
  }

  onUsuario(){
    this.subscription = this.http.get<objectUsuario>(`/api/usuario/buscar/ ${this.tokenService.getId()}`).subscribe({
      next: (value) => {
        this.usuario = value.object.usuario;
      },
      error: (err) => {
        alert("Erro ao carregar informações do usuário." + err)
      },
    })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private _filter(value: string): Observable<pessoa[]> {
    const filterValue = value.trim().toLowerCase();

    return this.http.post<pessoa[]>('/api/pessoa/pesquisar', { nome: filterValue }).pipe(
      map((response: pessoa[]) => response)
    );
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

  selecionaPessoa(pessoa: pessoa) {
    this.pessoa = pessoa;
    this.pessoaSelecionada = pessoa;
    this.myGroup.patchValue({ nome: pessoa.nome });
  }

  public cancelEdit(): void {
    this.pessoaSelecionada = null;
    this.myGroup.reset();
    const userId = this.tokenService.getId();
    if (userId) {
      this.myGroup.patchValue({ id: userId });
    }
  }

  onSubmit(): void {
    if (this.myGroup.valid) {
      this.contato = {
          email: this.myGroup.value.email,
          id: this.tokenService.getId(),
          pessoa: this.pessoa,
          privado: this.myGroup.value.privado,
          tag: this.myGroup.value.tag,
          telefone: this.myGroup.value.telefone,
          tipoContato: this.myGroup.value.tipoContato,
          usuario: this.usuario,
      }

      this.subscription = this.http.post('/api/contato/salvar', this.contato).subscribe(
        response => {
          alert("Dados atualizados com sucesso!!");
          this.router.navigate(['/contato']); 
        },
        error => {
          alert('Erro ao atualizar o cadastro');
        }
      );
    } else {
      alert('Formulário inválido');
    }
  }
}
