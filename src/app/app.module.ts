import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { environment } from '../environments/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'

import { NgxLoadingModule } from "ngx-loading";

// Initialize Firebase
const app = initializeApp(environment.firebaseConfig);
const analytics = getAnalytics(app);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AngularEditorModule,
    NgbModule,
    NgxLoadingModule.forRoot({})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
