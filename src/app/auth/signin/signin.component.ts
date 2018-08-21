import { UserService } from './../../services/user.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html'
})
export class SignInComponent implements OnInit {

  formErrors = {
    'email': '',
    'password': ''
  };
  validationMessages = {
    'email': {
      'required': 'Please enter your email',
      'email': 'please enter your vaild email'
    },
    'password': {
      'required': 'please enter your password',
      'pattern': 'The password must contain numbers and letters',
      'minlength': 'Please enter more than 4 characters',
      'maxlength': 'Please enter less than 25 characters',
    }
  };

  userForm: FormGroup;

  constructor(private af: AngularFireAuth,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.userForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]
      ],
      'password': ['', [
        Validators.minLength(6),
        Validators.maxLength(25)
      ]
      ],
    });

  }

  login() {

    this.af.auth.signInWithEmailAndPassword(this.userForm.value.email, this.userForm.value.password)
      .then((res) => {
        console.log(res);
        this.userService.setUserLoggedIn();
        this.userService.recuperarUsuario(res.uid).subscribe((user: any) => {
          this.userService.usuarioLogado = user;
          localStorage.setItem('usuarioLogado', JSON.stringify(user));
          this.router.navigate(['/dashboard/dashboard-default']);
        });
      }).catch(err => {
        console.error(err);
      });

  }

}
