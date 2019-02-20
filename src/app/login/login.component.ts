import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../services/auth-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginError: boolean;
  form: FormGroup;

  constructor( private authService: AuthService, private router: Router)  { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      pass: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    this.authService.userLogin().subscribe((userData: any) => {
      const usersArray = userData.users;
      usersArray.forEach(user => {
        const userKey = String(Object.keys(user));
        if ( userKey === this.form.value.email && user[userKey].pass ===  this.form.value.pass) {
          this.loginError = false;
          localStorage.setItem('userPartner', user[userKey].partner);
          this.router.navigate(['/home/ubersicht']);
        } else {
          this.loginError = true;
        }
      });
    });
  }

}
