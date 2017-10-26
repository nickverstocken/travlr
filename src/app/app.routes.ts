import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsertripsComponent } from './usertrips/usertrips.component';
import { TripdetailComponent } from './tripdetail/tripdetail.component';
import { LandingComponent } from './landing/landing.component';
import {AuthGuard} from './guard/auth.guard';
const routes: Routes = [
    {path: '', component: LandingComponent},
    {path: 'login', component: LoginComponent},
    {path: 'trips', component: UsertripsComponent, canActivate: [AuthGuard]},
    {path: 'trips/1', component: TripdetailComponent, canActivate: [AuthGuard]},
    {path: 'landing', component: LandingComponent}
];

export const Routing = RouterModule.forRoot(routes);