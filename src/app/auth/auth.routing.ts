import { Routes } from "@angular/router";
import { SignInComponent } from "app/auth/signin/signin.component";
import { SignUpComponent } from "app/auth/signup/signup.component";

export const AuthRoutes: Routes = [
    {
        path: '',
        redirectTo: 'signin',
        pathMatch: 'full'
    },
    {
        path: 'signin',
        component: SignInComponent
    },
    {
        path: 'signup',
        component: SignUpComponent
    }
];
