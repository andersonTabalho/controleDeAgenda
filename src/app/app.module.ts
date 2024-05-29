import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LoginComponent } from './routes/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadastroComponent } from './routes/cadastro/cadastro.component';
import { UsuarioComponent } from './routes/usuario/usuario.component';
import { PessoasComponent } from './routes/pessoas/pessoas.component';
import { ContatoComponent } from './routes/contato/contato.component';
import { LogoutComponent } from './routes/logout/logout.component';
import { MatTableModule } from '@angular/material/table';
import { TokenInterceptor } from './interceptors/token-interceptor';
import { AuthInterceptor } from './interceptors/auth-Interceptor';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { HomeComponent } from './routes/home/home.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { CreateContatoComponent } from './routes/create-contato/create-contato.component';
import { MatSelectModule } from '@angular/material/select';
import { InfoContatoComponent } from './modal/info-contato/info-contato.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    CadastroComponent,
    UsuarioComponent,
    PessoasComponent,
    ContatoComponent,
    LogoutComponent,
    CreateContatoComponent,
    InfoContatoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatCheckboxModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatListModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSelectModule 
  ],
  providers: [
    { 
      provide: LOCALE_ID, useValue: 'pt-BR' 
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: AuthInterceptor,
      multi: true,
      deps: []
    },
    AuthService,
    TokenService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
