import { NavRoute } from './models/models-sistema/nav.route';
import { CadastroComponent } from './routes/cadastro/cadastro.component';
import { ContatoComponent } from './routes/contato/contato.component';
import { HomeComponent } from './routes/home/home.component';
import { PessoasComponent } from './routes/pessoas/pessoas.component';
import { UsuarioComponent } from './routes/usuario/usuario.component';

export const RoleUSER = 'ROLE_USER';
export const RoleADMIN = 'ROLE_ADMIN';

export const LevelUSER = [RoleUSER, RoleADMIN];
export const LevelADMIN = [RoleADMIN];

export const ROUTES: readonly NavRoute[] = [
  {
    icon: 'home',
    name: 'Home',
    route: '',
    component: HomeComponent,
    authLevel: LevelUSER // Acesso permitido para ROLE_USER e superior
  },
  {
    icon: 'manage_accounts',
    name: 'Meu Cadastro',
    route: 'cadastro',
    component: CadastroComponent,
    authLevel: LevelUSER // Acesso permitido para ROLE_USER e superior
  },
  {
    icon: 'group',
    name: 'Usuários',
    route: 'usuario',
    component: UsuarioComponent,
    authLevel: LevelADMIN // Acesso permitido para ROLE_ADMIN e superior
  },
  {
    icon: 'diversity_3',
    name: 'Pessoas',
    route: 'pessoas',
    component: PessoasComponent,
    authLevel: LevelUSER // Acesso permitido para ROLE_USER e superior
  },
  {
    icon: 'contact_page',
    name: 'Contatos',
    route: 'contato',
    component: ContatoComponent,
    authLevel: LevelUSER // Acesso permitido para ROLE_DEV e superior
  }
];
