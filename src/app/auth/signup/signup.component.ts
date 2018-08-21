import { Condominio } from './../../model/condominio';
import { CondominiosService } from './../../services/condominios.service';
import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'app/model/usuario';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms/src/model';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements OnInit {

  form: FormGroup;
  listCondominios;

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get nome() { return this.form.get('nome'); }
  get telefone() { return this.form.get('telefone'); }
  get idCondominio() { return this.form.get('idCondominio'); }

  constructor(private af: AngularFireAuth,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private condominiosService: CondominiosService) { }

  ngOnInit() {
    this.buildForm();
    this.condominiosService.getAll().subscribe(condominios => {
      this.listCondominios = condominios;
      console.log(condominios);
    })
  }

  buildForm() {
    this.form = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email]
      ],
      'password': ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(25)]
      ],
      'nome': ['', [Validators.required]],
      'telefone': ['', [Validators.required]],
      'idCondominio': ['', [Validators.required]]
    });
  }

  signUp() {
    if (this.form.invalid) {
      return;
    }

    this.af.auth.createUserWithEmailAndPassword(this.email.value, this.password.value)
      .then((res) => {

        const usuario: Usuario = new Usuario();
        usuario.email = res.email;
        usuario.id = res.uid;
        usuario.nome = this.nome.value;
        usuario.telefone = this.telefone.value;
        usuario.condominio = new Condominio();
        usuario.condominio.id = this.idCondominio.value;
        usuario.condominio.nome = this.getCondominioSelecionado(this.idCondominio.value).nome;

        this.userService.criarUsuario(usuario).then((response) => {
          this.userService.usuarioLogado = usuario;
          localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
          this.router.navigate(['dashboard/dashboard-default']);
        });

      }).catch(err => {
        console.error(err);
      });
  }

  getCondominioSelecionado(idCondominio): Condominio {

    for (const element of this.listCondominios) {
      if (element.id == idCondominio) {
        return element;
      }
    }
    return null;
  }

}
