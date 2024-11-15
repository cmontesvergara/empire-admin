import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppsComponent } from './apps.component';
import { FileRenamerComponent } from './pages/file-renamer/file-renamer.component';
import { CssUnitChangerComponent } from './pages/sign-in/css-unit-changer.component';

const routes: Routes = [
  {
    path: '',
    component: AppsComponent,
    children: [
      { path: '', redirectTo: 'css-unit-changer', pathMatch: 'full' },
      { path: 'css-unit-changer', component: CssUnitChangerComponent, data: { returnUrl: window.location.pathname } },
      { path: 'file-renamer', component: FileRenamerComponent },

      { path: '**', redirectTo: 'sign-in', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppsRoutingModule {}
