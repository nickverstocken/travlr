import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsertripsComponent } from './usertrips/usertrips.component';
import { TripdetailComponent } from './tripdetail/tripdetail.component';
import { LandingComponent } from './landing/landing.component';
import {AuthGuard} from './guard/auth.guard';
const routes: Routes = [
    {path: '', component: LandingComponent},
    {path: 'login', component: LoginComponent},
    {path: ':userid/trips', component: UsertripsComponent, canActivate: [AuthGuard]},
    {path: ':userid/trips/:tripid', component: TripdetailComponent, canActivate: [AuthGuard]},
    {path: 'landing', component: LandingComponent},

    {path: '**', redirectTo: '/login'}
];

export const Routing = RouterModule.forRoot(routes);