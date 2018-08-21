import { ReservarSalaComponent } from './reservar-sala/reservar-sala.component';
import { SalasComponent } from './salas/salas.component';
import { FuncionarioComponent } from './funcionario/funcionario.component';
import { Routes } from '@angular/router';
import { LiberarEntradaComponent } from 'app/pages/liberar-entrada/liberar-entrada.component';

export const PagesRoutes: Routes = [{
    path: 'funcionarios',
    component: FuncionarioComponent,
},
{
    path: 'salas',
    component: SalasComponent
},
{
    path: 'entradas',
    component: LiberarEntradaComponent
},
{
    path: 'reservas',
    component: ReservarSalaComponent
}];
