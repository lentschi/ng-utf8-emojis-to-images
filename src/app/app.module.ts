import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { Utf8EmojisToImagesModule } from '../../projects/ng-utf8-emojis-to-images/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PickerModule,
    FormsModule,
    Utf8EmojisToImagesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
