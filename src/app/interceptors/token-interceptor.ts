import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private readonly tokenService: TokenService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.tokenService.getToken();

    if (accessToken) {
      // Create new headers with the Authorization token
      const headers = request.headers.set('Authorization', `Bearer ${accessToken}`);

      // Clone the request and set the new headers
      const clonedRequest = request.clone({ headers });

      return next.handle(clonedRequest);
    } else {
      return next.handle(request);
    }
  }
}
