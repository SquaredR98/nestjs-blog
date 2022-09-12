import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {}

  login(email: string, password: string){
    return this.http.post<any>('/users/login', {email, password}).pipe(
      map((token) => {
        localStorage.setItem('accessToken', token.accessToken);
        return token;
      })
    )
  }
}
