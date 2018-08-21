import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CrudComponent } from './crud.component';
import { CrudRoutes } from './crud.routing';
import { SharedModule } from '../shared/shared.module';
import { ProfissoesService } from 'app/services/profissoes.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CrudRoutes),
    SharedModule
  ],
  declarations: [CrudComponent],
  providers: [ProfissoesService]
})
export class CrudModule { }
