import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UbersichtComponent } from './ubersicht/ubersicht.component';
import { RechnerLinksComponent } from './rechner-links/rechner-links.component';
import { ProfileinstellungenComponent } from './profileinstellungen/profileinstellungen.component';
import {KontakAndSupportComponent} from './kontak-and-support/kontak-and-support.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './services/auth-guard';

const AppRoutes: Routes = [
  { path: '', component: LoginComponent, data: {animation: 'a'}},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
      { path: 'ubersicht', component: UbersichtComponent, data: {animation: 'b'}},
      { path: 'rechnerLinks', component: RechnerLinksComponent, data: {animation: 'c'}},
      { path: 'profileinstellungen', component: ProfileinstellungenComponent, data: {animation: 'd'}},
      { path: 'kontakAndSupport', component: KontakAndSupportComponent, data: {animation: 'i'}}
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
