import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription, catchError, map, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { Token } from '../models/models-sistema/token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly LOGIN_URL = '/api/auth/login';
  public token?: Token;
  public errStr?: string;
  public name: string | undefined;
  public subscription?: Subscription;

  public static canRoleActivate(roles: string, tipos?: readonly string[]) {
    if (!tipos || !roles) {
      return true;
    }
    return tipos.some(route => roles.includes(route));
  }  

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { 
  }

  public login(username: string, password: string): Observable<Token> {
    return this.http.post<Token>(this.LOGIN_URL, { username, password }).pipe(
      map((res) => {
        this.token = res;
        this.tokenService.setRole(this.token.tipos);
        this.tokenService.setToken(this.token.accessToken);
        this.tokenService.setId(this.token.id);
        this.tokenService.decodeToken();
        return this.token;
      }),
      catchError((err) => {
        // this.handleError(err);
        console.log(err);
        return throwError(() => err);
      })
    );
  }

  public onContatos(id:number) {
    this.subscription = this.http.get<any>(`/api/contato/listar/${8}`).subscribe({
      next: (value) => {
        console.log(value);
      },
      error: (err) => {
        console.log(err)
      },
    })
  }
}
