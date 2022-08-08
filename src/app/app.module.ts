import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {SharedModule} from './shared/shared.module';
import {InscriptionComponent} from './inscription/inscription.component';
import {SplashComponent} from './splash/splash.component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ResponseInterceptor} from './shared/utils/response-interceptor';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserRdvComponent } from './user-rdv/user-rdv.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, LoginComponent, InscriptionComponent, SplashComponent, UserProfileComponent,UserRdvComponent],
  imports: [BrowserModule, IonicModule.forRoot(),
    ReactiveFormsModule,
    FormsModule, AppRoutingModule, SharedModule],
  exports: [IonicModule],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true}],
  bootstrap: [AppComponent],
})
export class AppModule {
}
