import { Injectable } from '@angular/core';
import { Payload } from '../models/models-sistema/jwtpayload';
import jwtDecode from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly ROLE = 'role';
  private readonly ID = 'id';
  public jwtPayload: Payload | undefined;

  private isAuthenticatedSubject: BehaviorSubject<boolean>;

  constructor() {
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(!!this.getToken());
  }

  // Role
  public getRole(): string {
    const role = localStorage.getItem(this.ROLE);
    return role || ''; // Retorna a string do papel ou uma string vazia
  }

  public setRole(role: string): void {
    localStorage.setItem(this.ROLE, role);
  }

  public removeRole(): void {
    localStorage.removeItem(this.ROLE);
  }

  // Token
  public getToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  public setToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    this.isAuthenticatedSubject.next(true); // Notifica os assinantes que o usuário está autenticado
  }

  public removeToken(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    this.isAuthenticatedSubject.next(false); // Notifica os assinantes que o usuário não está autenticado
  }

  public isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
  
  public decodeToken(): void {
    const token = this.getToken();
    if (token) {
      this.jwtPayload = jwtDecode(token);
    }
  }

  public getId(): number {
    const idValue = localStorage.getItem(this.ID);
    return Number(idValue);
}

  public setId(id: number): void {
    localStorage.setItem(this.ID, `${id}`);
  }

  public removeId(): void {
    localStorage.removeItem(this.ID);
  }
}
