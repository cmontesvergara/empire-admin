import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnloggedLayoutComponent } from './unlogged-layout.component';

const routes: Routes = [

  {
    path: '',
    component: UnloggedLayoutComponent,
    loadChildren: () => import('../home/home.module').then((m) => m.HomeModule),
  },

  {
    path: 'components',
    component: UnloggedLayoutComponent,
    loadChildren: () => import('../uikit/uikit.module').then((m) => m.UikitModule),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnloggedLayoutRoutingModule {}
