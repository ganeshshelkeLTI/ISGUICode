import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-master',
  templateUrl: './admin-master.component.html',
  styleUrls: ['./admin-master.component.css']
})
export class AdminMasterComponent implements OnInit {
  private mode: string = "industry";
  private show: boolean = false;
  private disableCompareButton: boolean;
  private disableNewScenarioBtn: boolean = true;
  private isEditDisabled: boolean = true;
  industryChecked: boolean = true;
  scenarios:any;

  options: boolean = true;
  showIndustries: boolean = true;
  selectedValue : any;
  private count = 0;
  setsenarioId: any;
  private industries = {}
  private regions = {

  }

  private scanrio = {

  }

  private selectedIndustries: any = [];
  private selectedRegion: any[] = [];
  private selectedScanrio: any[] = [];
  private flagForOption: boolean;

  constructor() { }

  ngOnInit() {
  }
  toggleFilter(flagVal) {
    let object = this;
    object.showIndustries = flagVal;

    if (object.showIndustries === true) object.resetOptions("industry");
    else
      object.resetOptions("region")
  }

  //it will reset op
  resetOptions(mode): void {
    let object = this;
    object.disableCompareButton = true;
    object.disableNewScenarioBtn = true;
    if (mode === "industry") {
      object.selectedIndustries.forEach(element => {
        element.value = false;
      });
    } else {
      object.selectedRegion.forEach(element => {
        element.value = false;
      });
    }

    if (mode == "scanerio") {
      object.selectedScanrio.forEach(element => {
        element.value = false;
        this.isEditDisabled = true;
      });
    }
  }

}
