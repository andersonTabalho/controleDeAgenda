import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Mascara } from 'src/app/models/models-sistema/mascara';
import { objectUsuario } from 'src/app/models/objectUsuario';
import { usuario } from 'src/app/models/usuario';
import { UsuarioTipos } from 'src/app/models/usuarioTipos';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public myForm!: FormGroup;
  public formUser!: FormGroup;
  public subscription?: Subscription;
  public dataSource = new MatTableDataSource<usuario>([]);
  public displayedColumns: string[] = ['id', 'nome', 'email', 'telefone', 'cpf'];
  public usuarioTipos?: UsuarioTipos;
  public objectUsuario?: objectUsuario;
  public mostrarForm = false;
  public creatingUser = false;
  public updatingUser = false;
  public formVisible: boolean = false;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.listarUsuarios();
    this.myForm = this.fb.group({
      termo: [''],
      filtroNome: ['']
    });

    this.formUser = this.fb.group({
      tipos: [''],
      id: [''],
      cpf: ['', [Validators.pattern(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)]],
       dataNascimento: [''],
       email: ['', [Validators.email]],
      nome: [''],
      password: [''],
      telefone: ['', [Validators.pattern(/^\(\d{2}\) \d{5}\-\d{4}$/)]],
      username: [''],
    });

    this.myForm.get('filtroNome')!.valueChanges.subscribe(value => {
      this.applyFilter(value);
    });

    this.dataSource.filterPredicate = (data: usuario, filter: string) => {
      const normalizedData = this.normalize(data.nome);
      return normalizedData.includes(filter);
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public cancelEdit(): void {
    this.formVisible = false;
    this.formUser.reset(); 
    this.mostrarForm = false; 
  }


  toggleForm() {
    this.mostrarForm = !this.mostrarForm;
    if (this.mostrarForm) {
      this.creatingUser = false;
      this.updatingUser = false;
    }
  }

  setFormForCreate() {
    this.creatingUser = true;
    this.updatingUser = false;
    this.mostrarForm = true;
  }

  setFormForUpdate() {
    this.creatingUser = false;
    this.updatingUser = true;
    this.mostrarForm = true;
  }

  applyFilter(filterValue: string) {
    filterValue = this.normalize(filterValue.trim().toLowerCase());
    this.dataSource.filter = filterValue;
  }

  normalize(value: string): string {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  phoneMask(): void {
    const telefoneControl = this.formUser.get('telefone');
    if (telefoneControl) {
      let value = telefoneControl.value;
      value = Mascara.phoneMask(value);
      telefoneControl.setValue(value, { emitEvent: false });
    }
  }

  
  CpfMask(): void {
    const cpfControl = this.formUser.get('cpf');
    if (cpfControl) {
      let value = cpfControl.value;
      value = Mascara.cpfMask(value);
      cpfControl.setValue(value, { emitEvent: false });
    }
  }

  public listarUsuarios() {
    this.subscription = this.http.post<usuario[]>(`/api/usuario/pesquisar`, { termo: '' })
      .subscribe({
        next: (res) => {
          alert("Operação realizada com sucesso!")
          this.dataSource.data = res;
        },
        error: (err) => {
          alert("Erro ao carregar a lista de usuários: " + err);
        },
      });
  }

  public criarUsuario() {
    const dataNascimento = this.formUser.value.dataNascimento;
    const formattedDataNascimento = new Date(dataNascimento).toISOString().split('T')[0]; 
    this.usuarioTipos = {
      tipos: [this.formUser.value.tipos],
      usuario: {
        id: this.creatingUser ? undefined : this.formUser.value.id,
        cpf: this.formUser.value.cpf,
        dataNascimento: formattedDataNascimento,
        email: this.formUser.value.email,
        nome: this.formUser.value.nome,
        password: this.formUser.value.password,
        telefone: this.formUser.value.telefone,
        username: this.formUser.value.username,
      }
    };

    this.subscription = this.http.post<objectUsuario>(`/api/usuario/salvar`, this.usuarioTipos)
      .subscribe({
        next: (res) => {
          this.objectUsuario = res;
          alert(res.message);
          this.mostrarForm = false;
          this.creatingUser = false;
          this.updatingUser = false;
          this.listarUsuarios();
        },
        error: (err) => {
          alert("Erro ao salvar o usuário: ");
        },
      });
  }
}
