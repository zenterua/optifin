import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient) {}

  userLogin() {
    return this.http.get('./users.json');
    // return this.http.get('http://moonart.net.ua/zenuk/Optifin/users.json').pipe(
    //   catchError(error => {
    //     return throwError(error);
    //   })
    // );
  }

  getUsers() {
    return this.http.get( `./crm/data.json`).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
    // return this.http.get('http://moonart.net.ua/zenuk/Optifin/crm/data.json').pipe(
    //   catchError(error => {
    //     return throwError(error);
    //   })
    // );
  }
}
