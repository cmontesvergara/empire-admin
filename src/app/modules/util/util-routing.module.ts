import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchAppsComponent } from '../apps/pages/search-apps/search-apps.component';

const routes: Routes = [
  { path: '', redirectTo: 'app-gallery', pathMatch: 'full' },
  {
    path: 'app-gallery',
    component: SearchAppsComponent,
    data: {
      mode: 'enbedded',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilRoutingModule { }
