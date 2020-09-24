import { RendererFactory2 } from '@angular/core';
import { InlineSVGDirective } from './inline-svg.directive';
export declare class InlineSVGService {
    private _renderer;
    constructor(rendererFactory: RendererFactory2);
    insertEl(dir: InlineSVGDirective, parentEl: HTMLElement, content: Element, replaceContents: boolean, prepend: boolean): void;
}
