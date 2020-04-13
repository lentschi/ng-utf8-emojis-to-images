import { NgModule } from '@angular/core';
import { Utf8EmojisToImagesPipe } from './pipes/utf8-emojis-to-images.pipe';
import { PickerModule } from '@ctrl/ngx-emoji-mart';


@NgModule({
  declarations: [Utf8EmojisToImagesPipe],
  imports: [
    PickerModule,
  ],
  exports: [Utf8EmojisToImagesPipe]
})
export class Utf8EmojisToImagesModule { }
