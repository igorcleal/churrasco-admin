import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private auth: AngularFireAuth,
        private user: UserService,
        private router: Router) {

    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.auth.authState
            .take(1)
            // tslint:disable-next-line:no-shadowed-variable
            .map(state => !!state)
            .do(authenticated => {

                console.log('authenticated: ' + authenticated);

                if (!authenticated) {
                    this.router.navigate(['/signin']);
                }
            });
    }
}
