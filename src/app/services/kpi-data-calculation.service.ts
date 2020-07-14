import {
  Injectable
} from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import {
  Observable
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KpiDataCalculationService {

  public data1 = [{
      "key": "TDD400",
      "value": "25"
    },
    {
      "key": "TDD410",
      "value": "31"
    },
    {
      "key": "TDD420",
      "value": "52"
    },
    {
      "key": "TDD420",
      "value": "52"
    },
    {
      "key": "TDD400",
      "value": "52"
    },
    {
      "key": "TDD410",
      "value": "52"
    },
    {
      "key": "TDD420",
      "value": "52"
    }
  ]
  constructor() {}
  
  createMappedKpi(scenarioData) {
    
  }
}
