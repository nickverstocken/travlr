import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ContentComponent } from './content/content.component';
import { TravlrApiService } from './services/travlr-api.service';
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
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContentComponent,
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
      SlickModule.forRoot(),
      InViewportModule.forRoot()
  ],
  providers: [TravlrApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
