# ng-utf8-emojis-to-images

Angular6+ pipe based on the library [@ctrl/ngx-emoji-mart](https://www.npmjs.com/package/@ctrl/ngx-emoji-mart) to transform HTML containing unicode emojis to HTML containing emoji image elements

## Demo

For a demo either just checkout this project and run `npm install && npm run start` or visit [the StackBlitz demo page](https://stackblitz.com/github/lentschi/ng-utf8-emojis-to-images?file=src%2Fapp%2Fapp.component.html).

## Installation

For use in an existing angular project run `npm install --save ng-utf8-emojis-to-images @ctrl/ngx-emoji-mart`

Then add the installed module to your `app.module.ts`:

```typescript
import { Utf8EmojisToImagesModule } from 'ng-utf8-emojis-to-images';

// ...

@NgModule({
  // ...
  imports: [
    // ...
    Utf8EmojisToImagesModule
  ]
  // ...
})
export class AppModule {}

```


## Usage

### Without parameters

Anywhere in your template:

```html
<div [innerHTML]="'<a title=\'Ang🧛‍♀️ular\'>Hello</a> 👌 Ang🧛‍♀️ular 👌!' | utf8EmojisToImages"></div>
```

By default the pipe will use the apple sheet
(hosted at https://unpkg.com/emoji-datasource-apple@5.0.1/img/apple/sheets-256/64.png) - for other available sheets see https://missive.github.io/emoji-mart/

### With all available parameters (all of them optional!)

```html
<div [innerHTML]="html | utf8EmojisToImages:set:size:sheetSize:backgroundImageFn:sheetRows:sheetColumns"></div>
```

### Usage from within the component

As with any pipe you can also use this one directly from your component if you follow those steps:

1. Add the pipe to you components/modules providers: `providers: [ Utf8EmojisToImagesPipe ]`
2. Simply inject it in the component's constructor - e.g.:

```typescript
constructor(pipe: Utf8EmojisToImagesPipe) {
  const convertedHTML = pipe.emojisToImages('<a title="Ang🧛‍♀️ular">Hello</a> 👌 Ang🧛‍♀️ular 👌!');
  console.log('Converted HTML: ', convertedHTML);
}
```

### Parameters explained

| parameter | meaning |
| ---- | ---- |
| set | emoji mart set to use for image representation
| size | size of an emoji image in px
| sheetSize | size of each original image - will be resized to size
| backgroundImageFn | function to retrieve bg URL or path (see docs at https://github.com/TypeCtrl/ngx-emoji-mart)
| sheetRows | number of emoji rows in image provided by `backgroundImageFn`
| sheetColumns | number of emoji rows in image provided by `backgroundImageFn`


## Build & publish on npm

In case you want to contribute/fork:

1. Adept version and author in `./projects/ng-utf8-emojis-to-images/package.json` and commit to your forked repository.
1. Run `npm install`.
1. Run `npm run build-lib` which outputs the build to `./dist/ng-utf8-emojis-to-images`.
1. Copy README.md to `./dist/ng-utf8-emojis-to-images` and modify it accordingly.
1. Run `cd ./dist/ng-utf8-emojis-to-images && npm publish`.

## Thank you...

- ... __Scott Cooper__ for writing the [ngx-emoji-mart](https://github.com/TypeCtrl/ngx-emoji-mart) package which is internally used by this module.
- ... __Etienne Lemay__ for writing the [emoji-mart](https://github.com/missive/emoji-mart) package which provides the base of `ngx-emoji-mart`.

## License

MIT
