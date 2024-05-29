import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Observable, startWith, debounceTime, switchMap, map } from "rxjs";
import { objectFoto } from "src/app/models/objectFoto";
import { pessoa } from "src/app/models/pessoa";
import { TokenService } from "src/app/services/token.service";

@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.css']
})
export class PessoasComponent implements OnInit {
  public myForm!: FormGroup;
  private foto?: objectFoto;
  public editForm!: FormGroup;
  public formVisible: boolean = false;
  public selectedFile: File | null = null;
  public filteredOptions!: Observable<pessoa[]>;
  public pessoa: pessoa | null = null;
  private objectFoto?: objectFoto;
  private pessoaID?: number;

  constructor(
    private tokenService: TokenService,
    private fb: FormBuilder, private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      nome: ['']
    });

    this.editForm = this.fb.group({
      file: [''],
      nome: [''],
      bairro: [''],
      cep: [''],
      cidade: [''],
      estado: [''],
      id: [null],
      id_endereco: [null],
      logradouro: [''],
      numero: [0],
      pais: [''],
      cpf: ['']
    });

    this.filteredOptions = this.myForm.get('nome')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => this._filter(value || ''))
    );
  }

  private _filter(value: string): Observable<pessoa[]> {
    const filterValue = value.trim().toLowerCase();

    return this.http.post<pessoa[]>('/api/pessoa/pesquisar', { nome: filterValue }).pipe(
      map((response: pessoa[]) => response)
    );
  }

  visible() {
    this.formVisible = true;
  }

  public editPessoa(pessoa: pessoa): void {
    this.pessoa = pessoa;

    this.editForm.patchValue({
      nome: pessoa.nome,
      bairro: pessoa.endereco.bairro,
      cep: pessoa.endereco.cep,
      cidade: pessoa.endereco.cidade,
      estado: pessoa.endereco.estado,
      logradouro: pessoa.endereco.logradouro,
      numero: pessoa.endereco.numero,
      pais: pessoa.endereco.pais,
      cpf: pessoa.cpf,
      id: pessoa.id,
      id_endereco: pessoa.endereco.id
    });
    this.formVisible = true;
  }

  public cancelEdit(): void {
    this.pessoa = null;
    this.formVisible = false;
    this.editForm.reset();
  }

  public onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  public onSavePessoa(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pessoa = {
        id: this.editForm.value.id,
        nome: this.editForm.value.nome,
        cpf: this.editForm.value.cpf,
        endereco: {
          id: this.editForm.value.id_endereco,
          cep: this.editForm.value.cep,
          bairro: this.editForm.value.bairro,
          cidade: this.editForm.value.cidade,
          estado: this.editForm.value.estado,
          logradouro: this.editForm.value.logradouro,
          numero: this.editForm.value.numero,
          pais: this.editForm.value.pais,
        },
        foto: this.objectFoto?.object
      };
  
      this.http.post<pessoa>('/api/pessoa/salvar', this.pessoa).subscribe({
        next: (res) => {
          this.pessoa = res;
          this.pessoaID = res.id;
          this.formVisible = false;
          this.editForm.reset();
          alert('Pessoa editada com sucesso.');
          resolve(); 
          window.location.reload();
        },
        error: (error) => {
          alert('Erro ao editar pessoa:');
          reject(error); 
        }
      });
    });
  }

  public onSalveFoto(id?: number) {
    if (!this.selectedFile) {
      // alert('Nenhum arquivo selecionado');
      return;
    }
  
    const formData: FormData = new FormData();
    formData.append('foto', this.selectedFile);
    this.http.post<objectFoto>(`/api/foto/upload/${id}`, formData).subscribe({
      next: (res) => {
        this.objectFoto = res;
      },
      error: (error) => {
        alert('Erro ao editar pessoa: ' + error.message);
      }
    });
  }

  public onSave() {
    if (this.pessoa == null) {
      this.onSavePessoa();
    }
    else {
      this.onSalveFoto(this.pessoa.id!);
      this.onSavePessoa()
    }
  }

  public removerPessoa(id?: number): void {
    this.http.delete(`/api/pessoa/remover/${id}`).subscribe({
      next: () => {
        alert('Pessoa removida com sucesso.');
        this.formVisible = false;
      },
      error: (err) => {
        alert('Erro ao remover pessoa' + err);
      }
    });
  }

  public onPessoaSelected(pessoa: pessoa): void {
    this.editPessoa(pessoa);
  }
}
