import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NavRoute } from './models/models-sistema/nav.route';
import { ROUTES } from './app.config'; // Importe a constante ROUTES do arquivo app.config.ts
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'agenda';
  public currentRoute: string;
  public routes?: readonly NavRoute[]; 
  public routeActivated?: string;
  public subscription?: Subscription;
  public errStr?: string;
  public name?: string | undefined;
  public isMenuOpen = false;
  public isLoggedIn: boolean = false; 

  constructor(
    private router: Router,
    private readonly authService: AuthService,
    public readonly tokenService: TokenService
  ) {
    this.subscription = this.tokenService.isAuthenticated().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.onRoutesAndRolesChange();
      }
    });

    this.currentRoute = this.router.url;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((res: any) => {
      this.currentRoute = res.url.split('/')[1];

      var titulo = (this.currentRoute.charAt(0).toUpperCase() + this.currentRoute.slice(1)).replace(/([A-Z])/g, ' $1');
      // Se a rota for "/", mostra "Home" (ou o título desejado para a página inicial)
      this.onClickRoute(titulo);
    });
  }

  ngOnInit() {
    this.onRoutesAndRolesChange(); // Chama para inicializar as rotas
  }

  public onClickRoute(route: NavRoute | string) {
    this.routeActivated = typeof route === 'string' ? route : route.name;
  }

  public logout() {
    this.tokenService.removeToken();
    this.tokenService.removeRole();
    this.tokenService.removeId();
    this.router.navigate(['/login']); // Redireciona para a página de login após fazer logout
  }

  private onRoutesAndRolesChange() {
    this.subscription = this.tokenService.isAuthenticated().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        const userRole = this.tokenService.getRole(); // Obtém o papel do usuário
        if (userRole) {
          this.routes = ROUTES.filter(route =>
            AuthService.canRoleActivate(userRole, route.authLevel)
          );
        } else {
          // Caso o papel do usuário não seja encontrado, defina as rotas como undefined
          this.routes = undefined;
        }
      } else {
        // Se o usuário não estiver autenticado, defina as rotas como undefined
        this.routes = undefined;
      }
    });
  }
}