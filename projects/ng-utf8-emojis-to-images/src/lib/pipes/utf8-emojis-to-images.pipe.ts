import { Pipe, PipeTransform, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { emojis, EmojiService, CompressedEmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';

/**
 * Angular pipe to transform HTML containing unicode emojis to
 * HTML containing emoji image elements
 *
 */
/** @dynamic */
@Pipe({
  name: 'utf8EmojisToImages'
})
export class Utf8EmojisToImagesPipe implements PipeTransform {
  private static cachedEmojiRegex: RegExp;


  /**
   * Utility method to get all text node descendants of a DOM node
   * @param node the DOM node to get text nodes for
   */
  public static getAllTextNodes(node: Node) {
    const all = [];
    for (node = node.firstChild; node; node = node.nextSibling) {
      if (node.nodeType === Node.TEXT_NODE) {
        all.push(node);
      } else {
        all.push(...Utf8EmojisToImagesPipe.getAllTextNodes(node));
      }
    }
    return all;
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private sanitizer: DomSanitizer,
    private emojiService: EmojiService
  ) { }

  /**
   * Pipe transform entry point
   * @param html HTML to parse
   * @param set emoji mart set to use for image representation
   * @param size size of an emoji image in px
   * @param sheetSize sheetSize (size of each original image - will be resized to size)
   * @param backgroundImageFn function to retrieve bg URL or path (see docs at https://github.com/TypeCtrl/ngx-emoji-mart)
   * @param sheetRows number of emoji rows in image provided by `backgroundImageFn`
   * @param sheetColumns number of emoji columns in image provided by `backgroundImageFn`
   */
  public transform(
    html: string,
    set: '' | 'apple' | 'facebook' | 'twitter' | 'google' = 'apple',
    size?: number,
    sheetSize?: 16 | 20 | 32 | 64,
    backgroundImageFn?: (set: string, sheetSize: number) => string,
    sheetRows?: number,
    sheetColumns?: number): SafeHtml {

    return this.sanitizer.bypassSecurityTrustHtml(
      this.emojisToImages(
        html,
        set,
        size,
        sheetSize,
        backgroundImageFn,
        sheetRows,
        sheetColumns
      )
    );
  }

  /**
   * Replaces all unicode emojis available through emoji-mart with a span displaying
   * the image representation of that emoji
   * @param html HTML to parse
   * @param set emoji mart set to use for image representation
   * @param size size of an emoji image in px
   * @param sheetSize sheetSize (size of each original image - will be resized to size)
   * @param backgroundImageFn function to retrieve bg URL or path (see docs at https://github.com/TypeCtrl/ngx-emoji-mart)
   */
  public emojisToImages(
    html: string,
    set?: '' | 'apple' | 'facebook' | 'twitter' | 'google',
    size?: number,
    sheetSize?: 16 | 20 | 32 | 64,
    backgroundImageFn?: (set: string, sheetSize: number) => string,
    sheetRows?: number,
    sheetColumns?: number
  ): string {
    // Ensure most html entities are parsed to unicode:
    const div = <Element> this.document.createElement('div');
    div.innerHTML = html;

    const textNodes = Utf8EmojisToImagesPipe.getAllTextNodes(div);
    for (let currentItem of textNodes) {
      let match: RegExpExecArray;
      while ((match = this.emojiRegex.exec(currentItem.textContent)) !== null) {
        const unicodeEmoji = currentItem.textContent.substr(match.index, match[0].length);
        const hexCodeSegments = [];
        let j = 0;
        while (j < unicodeEmoji.length) {
          const segment = unicodeEmoji.codePointAt(j).toString(16).toUpperCase();
          hexCodeSegments.push(segment);

          j += Math.ceil(segment.length / 4);
        }
        const hexCode = hexCodeSegments.join('-');
        const matchingData = this.findEmojiData(hexCode);
        if (matchingData) {
          const span = document.createElement('span');
          span.setAttribute('contenteditable', 'false');
          span.className = 'emoji-pipe-image';

          const styles = this.emojiService.emojiSpriteStyles(
            matchingData.sheet,
            set,
            size,
            sheetSize,
            sheetRows,
            backgroundImageFn,
            sheetColumns
          );
          Object.assign(span.style, styles);

          const text = currentItem.textContent;
          currentItem.textContent = text.substr(0, match.index);
          currentItem.parentNode.insertBefore(span, currentItem.nextSibling);
          currentItem = this.document.createTextNode(text.substr(match.index + match[0].length));
          span.parentNode.insertBefore(currentItem, span.nextSibling);

          this.emojiRegex.lastIndex = 0;
        }
      }
    }

    return div.innerHTML;
  }

  /**
   * Regex matching all unicode emojis contained in emoji-mart
   */
  private get emojiRegex(): RegExp {
    if (Utf8EmojisToImagesPipe.cachedEmojiRegex) {
      return Utf8EmojisToImagesPipe.cachedEmojiRegex;
    }

    let characterRegexStrings: string[] = [];
    for (const emoji of emojis) {
      characterRegexStrings.push(this.emojiService.unifiedToNative(emoji.unified).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

      if (emoji.skinVariations) {
        for (const skinVariation of emoji.skinVariations) {
          characterRegexStrings.push(this.emojiService.unifiedToNative(skinVariation.unified).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        }
      }
    }

    characterRegexStrings = characterRegexStrings.sort((a, b) => {
      if (a.length > b.length) {
        return -1;
      }

      if (b.length > a.length) {
        return 1;
      }

      return 0;
    });

    const strings = characterRegexStrings;
    const reString = '(' + strings.join('|') + ')';
    Utf8EmojisToImagesPipe.cachedEmojiRegex = new RegExp(reString, 'gu');

    return Utf8EmojisToImagesPipe.cachedEmojiRegex;
  }

  /**
   * Find raw emoji-mart data for a specific emoji hex code
   * @param hexCode String representation of the emoji hex code
   */
  private findEmojiData(hexCode: string): CompressedEmojiData {
    for (const emojiData of emojis) {
      if (emojiData.unified === hexCode) {
        return emojiData;
      }

      if (emojiData.skinVariations) {
        for (const skinVariation of emojiData.skinVariations) {
          if (skinVariation.unified === hexCode) {
            const skinData = Object.assign({}, emojiData);
            skinData.sheet = skinVariation.sheet;
            return skinData;
          }
        }
      }
    }

    return null;
  }
}
