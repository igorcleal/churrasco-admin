import { SharedModule } from './../shared/shared.module';
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SignInComponent } from "app/auth/signin/signin.component";
import { AuthRoutes } from 'app/auth/auth.routing';
import { SignUpComponent } from 'app/auth/signup/signup.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AuthRoutes),
        SharedModule
    ],
    declarations: [SignInComponent,
        SignUpComponent]
})

export class AuthModule { }
