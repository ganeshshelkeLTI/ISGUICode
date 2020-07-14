import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { Roles } from '../entities/roles'; // Temporary : need to remove

@Directive({
  selector: '[appAuthorizer]'
})
export class AuthorizerDirective implements OnInit {

  @Input('disable-access') functionality: string
  @Input('infratower') isInfratower: boolean;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {

    // let userLoginAccessData = JSON.parse(localStorage.getItem('userloginInfo'));
    // let access_permission_cio = userLoginAccessData["demo_sales_lite"];

    // if (access_permission_cio[this.functionality] == false) this.el.nativeElement.remove();
  }
}
