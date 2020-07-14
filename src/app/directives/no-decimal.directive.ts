/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:no-decimal.directive.ts **/
/** Description: This file is created to restrict the user adding decimal values like 20.12, though this file is not used. **/
/** Created By: 10651577  Created Date: 28/09/2018 **/
/** Update By:  10651577  Update Date:  28/09/2018 **/
/** Developed at:  **/
/*******************************************************/

import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNoDecimal]'
})
export class NoDecimalDirective {

  constructor(private el: ElementRef) { }
  @Input() OnlyNumber: boolean;

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    let e = <KeyboardEvent> event;
    if (this.OnlyNumber) {
      if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) ||
        // Allow: Ctrl+C
        (e.keyCode == 67 && e.ctrlKey === true) ||
        // Allow: Ctrl+X
        (e.keyCode == 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
          // let it happen, don't do anything
          return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
      }
  }

}
