import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { TravlrApiService } from './services/travlr-api.service';
import {AuthService} from './services/auth.service'
import {AuthGuard} from './guard/auth.guard';;
import { MapComponent } from './map/map.component';
import { UsertripsComponent } from './usertrips/usertrips.component';
import { TripdetailComponent } from './tripdetail/tripdetail.component';
import { TripcardComponent } from './tripcard/tripcard.component';
import { SlickModule } from 'ngx-slick';
import { LoginComponent } from './login/login.component';
import { Routing } from './app.routes';
import { InViewportModule } from 'ng-in-viewport';
import 'intersection-observer';
import { LandingComponent } from './landing/landing.component';
import { RouterwrapComponent } from './routerwrap/routerwrap.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MapComponent,
    UsertripsComponent,
    TripdetailComponent,
    TripcardComponent,
    LoginComponent,
    LandingComponent,
    RouterwrapComponent
  ],
  imports: [
    BrowserModule,
      HttpModule,
      Routing,
      FormsModule,
      SlickModule.forRoot(),
      InViewportModule.forRoot()
  ],
  providers: [TravlrApiService, AuthGuard, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
