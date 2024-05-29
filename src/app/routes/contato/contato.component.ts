import { pessoa } from 'src/app/models/pessoa';
import { contato } from '../../models/contatos';
import { usuario } from 'src/app/models/usuario';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Subscription, debounceTime, map, startWith, switchMap } from 'rxjs';
import { Mascara } from 'src/app/models/models-sistema/mascara';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {
  @Input() userId?: number; //ajustar
  @Output() contactUpdated = new EventEmitter<void>(); //ajustar
  
  public usaurio!: usuario;
  public contato!: contato;
  public myForm!: FormGroup;
  public editForm!: FormGroup;
  public subscription?: Subscription;
  public dataContatos: contato[] = [];
  public editingContato?: contato | null;
  public filteredOptions!: Observable<pessoa[]>;
  public pessoaSelecionada: pessoa | null = null;
  public displayedColumns: string[] = [ 'tag', 'tipoContato', 'contato', 'editar', 'remover'];
  public formVisible: boolean = false;


  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      nome: ['']
    });

    this.editForm = this.fb.group({
      email: ['', [Validators.email]],
      tag: [''],
      tipoContato: [''],
      telefone: [''],
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

  
  public cancelEdit(): void {
    this.editingContato = null;
    this.formVisible = false;
    this.myForm.reset(); 
    this.editForm.reset();
  }

  public editContato(contato: contato) {
    this.editingContato = contato;
    this.editForm.patchValue({
      email: contato.email,
      tag: contato.tag,
      tipoContato: contato.tipoContato,
      telefone: contato.telefone
    });
    this.formVisible = true;
  }

  phoneMask(): void {
    const phoneControl = this.editForm.get('telefone');
    if (phoneControl) {
      let value = phoneControl.value;
      value = Mascara.phoneMask(value);
      phoneControl.setValue(value, { emitEvent: false });
    }
  }

  getContatoValue(contato: contato): any {
    if (contato.tipoContato === 'TELEFONE') {
      return contato.telefone;
    } else if (contato.tipoContato === 'EMAIL') {
      return contato.email;
    } else {
      return ''; 
    }
  }
  

  public listarContatos(id?: number) {
    this.subscription = this.http.get<contato[]>(`/api/contato/listar/${id}`)
      .subscribe({
        next: (res) => {
          this.formVisible = true;
          this.dataContatos = res;
          this.pessoaSelecionada = res.length > 0 ? res[0].pessoa : null;
        },
        error: (err) => {
          alert("Erro ao carregar a lista de contatos." + err)
        },
      })
  }

  public deletarContatos(id: number) {
    this.subscription = this.http.delete<void>(`/api/contato/remover/${id}`)
      .subscribe({
        next: () => {
          this.dataContatos = this.dataContatos.filter(contato => contato.id !== id);
          alert("Contato deletado com sucesso!")
        },
        error: (err) => {
          alert("Erro ao remover o contato." + err)
        },
      });
  }

  public saveContato() {
    if (this.editForm.valid) {
      this.editingContato!.email = this.editForm.value.email;
      this.editingContato!.tag = this.editForm.value.tag;
      this.editingContato!.telefone = this.editForm.value.telefone;
      this.editingContato!.tipoContato = this.editForm.value.tipoContato;

      this.http.post<contato>('/api/contato/salvar',  this.editingContato)
        .subscribe({
          next: (res) => {
            const index = this.dataContatos.findIndex(c => c.id === res.id);
            if (index > -1) {
              this.dataContatos[index] = res;
            }
            this.editingContato = null;
            alert("Contato alterado com sucesso!")
          },
          error: (err) => {
            alert("Erro ao salvar o contato.")
          },
        });
    }
  }
}