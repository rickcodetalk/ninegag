import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {MomentModule} from 'angular2-moment';
//import { InfiniteScrollModule } from 'angular2-infinite-scroll';

import { AppComponent } from './app.component';
import { Main } from './main';

import { MainService } from './main.service';


@NgModule({
  declarations: [
    AppComponent,
    Main,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MomentModule,
    //InfiniteScrollModule
  ],
  providers: [MainService],
  bootstrap: [AppComponent]
})
export class AppModule { }
