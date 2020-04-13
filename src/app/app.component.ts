import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent  {
  htmlString = '<a title="Ang🧛‍♀️ular">Hello</a> 👌 Ang🧛‍♀️ular 👌!';
  sheet: '' | 'apple' | 'facebook' | 'twitter' |  'google' = 'apple';
  size = 22;
  sheetSize: 16 | 20 | 32 | 64 = 64;
  sheetRows = 57;
  sheetColumns = 57;
  backgroundUrl = 'https://unpkg.com/emoji-datasource-${set}@5.0.1/img/${set}/sheets-256/${sheetSize}.png';


  backgroundImageFn = (set: string, sheetSize: number) =>
    this.backgroundUrl.replace(/\$\{set\}/g, set).replace(/\$\{sheetSize\}/g, String(sheetSize))

  addEmoji(event) {
    this.htmlString = event.emoji.native + this.htmlString;
  }

  backgroundUrlChanged() {
    // Simply clone the current backgroundImageFn to make the pipe call it again immediately
    // (otherwise we'd have to wait until some other param is changed):
    this.backgroundImageFn = this.backgroundImageFn.bind(this);
  }
}
