import {Pipe} from '@angular/core'
import {CurrencyPipe, getCurrencySymbol} from '@angular/common';

export class CurrencySymbol {

    constructor(){
       let pipe:CurrencyPipe=new CurrencyPipe("");

     // console.log(getCurrencySymbol("USD","wide","en"));
    }
}
