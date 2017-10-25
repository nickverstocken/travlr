import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsertripsComponent } from './usertrips/usertrips.component';
import { TripdetailComponent } from './tripdetail/tripdetail.component';
import { LandingComponent } from "./landing/landing.component"
const routes: Routes = [
    {path: '', component: LandingComponent},
    {path: 'login', component: LoginComponent},
    {path: 'trips', component: UsertripsComponent},
    {path: 'trips/1', component: TripdetailComponent},
    {path: 'landing', component: LandingComponent}
];

export const Routing = RouterModule.forRoot(routes);