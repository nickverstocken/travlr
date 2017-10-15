import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsertripsComponent } from './usertrips/usertrips.component';
import { TripdetailComponent } from './tripdetail/tripdetail.component';
const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'login', component: LoginComponent},
    {path: 'trips', component: UsertripsComponent},
    {path: 'trips/1', component: TripdetailComponent}
];

export const Routing = RouterModule.forRoot(routes);