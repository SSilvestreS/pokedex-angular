import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokemonListComponent } from './pokemon-list.component';
import { PokemonDetailComponent } from './pokemon-detail.component';

const routes: Routes = [{ path: '', component: PokemonListComponent },
{ path: 'pokemon/:id', component: PokemonDetailComponent },{ path: '**', redirectTo: '' }];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}