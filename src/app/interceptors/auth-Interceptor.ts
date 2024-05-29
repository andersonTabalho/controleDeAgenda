import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export function AuthInterceptor(): HttpInterceptor {
  const baseUrl = 'https://demometaway.vps-kinghost.net:8485';

  return {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const modifiedReq = req.clone({ url: baseUrl + req.url });
      return next.handle(modifiedReq);
    }
  };
}
