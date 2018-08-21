import { ReservaSalaService } from './../services/reserva-sala.service';
import { LiberarEntradasService } from './../services/liberar-entradas.service';
import { FuncionariosService } from './../services/funcionarios.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ProfissoesService } from 'app/services/profissoes.service';
import { PagesRoutes } from 'app/pages/pages.routing';
import { FuncionarioComponent } from 'app/pages/funcionario/funcionario.component';
import { SalasComponent } from './salas/salas.component';
import { SalasListaComponent } from './salas/salas-lista/salas-lista.component';
import { SalasService } from 'app/services/salas.service';
import { LiberarEntradaComponent } from './liberar-entrada/liberar-entrada.component';
import { LiberarEntradaListaComponent } from './liberar-entrada/liberar-entrada-lista/liberar-entrada-lista.component';
import { ReservarSalaComponent } from './reservar-sala/reservar-sala.component';
import { ProdutosComponent } from './produtos/produtos.component';
import { ProdutosListaComponent } from './produtos/produtos-lista/produtos-lista.component';
import { ProdutosService } from 'app/services/produtos.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PagesRoutes),
    SharedModule
  ],
  declarations: [FuncionarioComponent,
    SalasComponent,
    SalasListaComponent,
    LiberarEntradaComponent,
    LiberarEntradaListaComponent,
    ReservarSalaComponent,
    ProdutosComponent,
    ProdutosListaComponent
  ],
  providers: [ProfissoesService,
    FuncionariosService,
    SalasService,
    LiberarEntradasService,
    ReservaSalaService,
    ProdutosService]
})
export class PagesModule { }
