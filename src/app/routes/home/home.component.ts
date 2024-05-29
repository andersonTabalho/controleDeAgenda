import { pessoa } from 'src/app/models/pessoa';
import { contato } from '../../models/contatos';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TokenService } from 'src/app/services/token.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable, Subscription, debounceTime, map, startWith, switchMap } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { InfoContatoComponent } from 'src/app/modal/info-contato/info-contato.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public userId: any;
  public contato?: contato;
  public myForm!: FormGroup;
  public editForm!: FormGroup;
  public contatoForm!: FormGroup;
  public contatos: contato[] = [];
  public favoritos: number[] = [];
  public showForm: boolean = false;
  public subscription?: Subscription;
  public dataContatos: contato[] = [];
  public formVisible: boolean = false;
  public editingContato?: contato | null;
  public filteredOptions!: Observable<pessoa[]>;
  public pessoaSelecionada: pessoa | null = null;
  public dataSource = new MatTableDataSource<contato>([]);
  public displayedColumns: string[] = ['favorita', 'id', 'tag', 'tipoContato', 'contato', 'detalhes', 'Excluir', 'Editar'];

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      nome: ['']
    });

    this.editForm = this.fb.group({
      email: [''],
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

  private updateDataSource(): void {
    this.dataSource.data = [...this.contatos];
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openInfoDialog(contato: contato): void {
    const dialogRef = this.dialog.open(InfoContatoComponent, {
      width: '600px',
      data: contato,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      const resulte = result;
    });
  }

  aplicaFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.normalize(filterValue.trim().toLowerCase());
  }

  filtro(): (data: contato, filter: string) => boolean {
    let filterFunction = function (data: contato, filter: string): boolean {
      let searchTerms = filter.split(' ');
      return searchTerms.every(term =>
        data.email?.toLowerCase().includes(term) ||
        data.pessoa.endereco.cidade.toLowerCase().includes(term) ||
        data.pessoa.endereco.estado.toLowerCase().includes(term) ||
        data.pessoa.endereco.cep.toLowerCase().includes(term) ||
        data.usuario.cpf.toLowerCase().includes(term) ||
        data.usuario.dataNascimento ||
        data.usuario.nome.toLowerCase().includes(term) ||
        data.pessoa.nome.toLowerCase().includes(term) ||
        data.id?.toString().toLowerCase().includes(term)
      );
    };
    return filterFunction;
  }

  normalize(value: string): string {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  favorito(contato: contato): boolean {
    return this.favoritos.includes(contato.id!);
  }

  toggleFavorite(contato: contato): void {
    if (this.favorito(contato)) {
      this.removeFavorito(contato);
    } else {
      this.addFavorito(contato);
    }
  }

  addFavorito(contato: contato): void {
    this.favoritos.push(contato.id!);
    this.createFavorite(contato);
  }

  removeFavorito(contato: contato): void {
    this.favoritos = this.favoritos.filter(id => id !== contato.id);
    this.removeFavorite(contato);
  }

  public listarContatos(id: number) {
    this.getContatos(id);
    this.getContatosFavorito();
  }

  public cancelEdit(): void {
    this.pessoaSelecionada = null;
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

  public saveContato() {
    if (this.editForm.valid) {
      this.editingContato!.email = this.editForm.value.email;
      this.editingContato!.tag = this.editForm.value.tag;
      this.editingContato!.telefone = this.editForm.value.telefone;
      this.editingContato!.tipoContato = this.editForm.value.tipoContato;

      this.http.post<contato>('/api/contato/salvar', this.editingContato)
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

  public deletarContatos(id: number) {
    this.subscription = this.http.delete<void>(`/api/contato/remover/${id}`)
      .subscribe({
        next: () => {
          this.dataContatos = this.dataContatos.filter(contato => contato.id !== id);
          alert("Contato deletado com sucesso!")
        },
        error: (err) => {
          alert("Erro ao remover o contato pois não contem foto.")
        },
      });
  }


  private createFavorite(contato: contato) {
    this.subscription = this.http.post<contato>(`/api/favorito/salvar`, contato).subscribe({
      next: () => {
        this.getContatosFavorito();
        alert("Contato salvo com sucesso!")
      },
      error: (err) => {
        alert('erro ao chamar');
      }
    })
  }

  private removeFavorite(contato: contato) {
    this.subscription = this.http.delete<contato>(`/api/favorito/remover/${contato.id}`).subscribe({
      next: () => {
        this.getContatosFavorito();
        alert("Contato eletado com sucesso.")
      },
      error: (err) => {
        alert('erro ao chamar');
      }
    })
  }

  private getContatos(id: number): void {
    this.subscription = this.http.get<contato[]>(`/api/contato/listar/${id}`)
      .subscribe({
        next: (res) => {
          this.formVisible = true;
          this.contatos = res;
          this.updateDataSource();
        },
        error: (err) => {
          alert('erro ao chamar');
        }
      });
  }

  private getContatosFavorito(): void {
    this.subscription = this.http.get<contato[]>(`/api/favorito/pesquisar`)
      .subscribe({
        next: (res) => {
          this.formVisible = true;
          this.favoritos = res.map(fav => fav.id!);
          this.updateDataSource();
        },
        error: (err) => {
          alert('erro ao chamar');
        }
      });
  }
}
