import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LevelUSER, ROUTES } from './app.config';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './routes/login/login.component';
import { CreateContatoComponent } from './routes/create-contato/create-contato.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [AuthGuard],
    data: {roles: undefined}
  },
  {
    path: 'create-contact',
    component: CreateContatoComponent,
    canActivate: [AuthGuard],
    data: {roles: LevelUSER},
  },
  {
    path: '**', 
    redirectTo: 'login', 
    pathMatch: 'full',
    data: {roles: undefined}
  }
];

const navRoutes: Routes = ROUTES.map(nav => {
  return {
    path: nav.route,
    component: nav.component,
    canActivate: [AuthGuard],
  };
});

@NgModule({
  imports: [RouterModule.forRoot(navRoutes.concat(routes))],
  exports: [RouterModule],
})

export class AppRoutingModule { }
