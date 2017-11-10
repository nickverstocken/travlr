import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ApiService } from './services/api.service';
import { TravlrApiService } from './services/travlr-api.service';
import {AuthService} from './services/auth.service';
import {AuthGuard} from './guard/auth.guard';
import { UsertripsComponent } from './usertrips/usertrips.component';
import { TripdetailComponent } from './tripdetail/tripdetail.component';
import { TripcardComponent } from './tripcard/tripcard.component';
import { LoginComponent } from './login/login.component';
import { Routing } from './app.routes';
import { InViewportModule } from 'ng-in-viewport';
// import 'intersection-observer';
import { LandingComponent } from './landing/landing.component';
import { FormsModule } from '@angular/forms';
import { AddTripComponent } from './add-trip/add-trip.component';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import { AddStopComponent } from './add-stop/add-stop.component';
import { AgmCoreModule } from '@agm/core';
import { MapboxMapComponent } from './mapbox-map/mapbox-map.component';
import { MultipleImageUploaderComponent } from './multiple-image-uploader/multiple-image-uploader.component';
import { FollowsModalComponent } from './follows-modal/follows-modal.component';
import { NgxCarouselModule } from 'ngx-carousel';
import 'hammerjs';
import { ImagesModalComponent } from './images-modal/images-modal.component';
import { MomentModule } from 'angular2-moment';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UsertripsComponent,
    TripdetailComponent,
    TripcardComponent,
    LoginComponent,
    LandingComponent,
    AddTripComponent,
    ImageUploaderComponent,
    AddStopComponent,
    MapboxMapComponent,
    MultipleImageUploaderComponent,
    FollowsModalComponent,
    ImagesModalComponent
  ],
  imports: [
    BrowserModule,
      BrowserAnimationsModule,
      HttpModule,
      HttpClientModule,
      Routing,
      FormsModule,
      InViewportModule.forRoot(),
      NgxMyDatePickerModule.forRoot(),
      AgmCoreModule.forRoot({
          apiKey: 'AIzaSyAoSQ1d_q1zShvfks5KP5UQ5cWsj7muOwU',
          libraries: ['places']
      }),
      NgxCarouselModule,
      MomentModule
  ],
  providers: [TravlrApiService, AuthGuard, AuthService, ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
