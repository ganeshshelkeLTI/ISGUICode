/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:popover-note.component.ts **/
/** Description:  **/
/** Created By: 106##### Created Date: 28/09/2018 **/
/** Update By:  106##### Update Date:  28/09/2018 **/
/** Developed at:  **/
/*******************************************************/

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'popover-note',
  templateUrl: './popover-note.component.html',
  styleUrls: ['./popover-note.component.css']
})
export class PopoverNoteComponent implements OnInit {

  componentPopHoverId;
  componentPopHoverText;

  constructor() { }
  @Input() popHoverId:String;
  @Input() popHoverText:String;


  ngOnInit() {
    this.componentPopHoverId = this.popHoverId;
    this.componentPopHoverText = this.popHoverText;
  }

}
