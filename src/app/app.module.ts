import { ToastService } from './services/toast.service';
import { AuthGuard } from './auth.guard';
import { UserService } from './services/user.service';
import { AngularFirestore, AngularFirestoreModule } from 'angularfire2/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { SharedModule } from './shared/shared.module';
import { BreadcrumbsComponent } from './layouts/admin/breadcrumbs/breadcrumbs.component';
import { TitleComponent } from './layouts/admin/title/title.component';
import { ScrollModule } from './scroll/scroll.module';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FirebaseConfig } from 'environments/firebase.config';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { FuncionarioComponent } from './pages/funcionario/funcionario.component';
import { LoadingComponent } from './components/loading/loading.component';
import { UtilsService } from 'app/services/utils.service';
import { CondominiosService } from './services/condominios.service';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    BreadcrumbsComponent,
    TitleComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes),
    FormsModule,
    HttpModule,
    ScrollModule,
    AngularFireModule.initializeApp(FirebaseConfig),
    AngularFirestoreModule
  ],
  exports: [ScrollModule],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    UserService,
    AngularFireAuth,
    AuthGuard,
    UtilsService,
    ToastService,
    CondominiosService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
