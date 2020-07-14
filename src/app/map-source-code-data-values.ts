export class MapSourceCodeDataValues {
  obj = {};

  // Variables for formulae 
// onshoreOffshoreResult:any;
// FTEPercent:any;
// contractorPercent:any;
// ITSpendRevMean:any;
// InfraAppManagement:any;
// ITSpendPerUserMeanCY:any;

// ITSpendPersonnel:any;
// ITSpendHardware:any;
// ITSpendSoftware:any;
// ItSpendOutsourced:any;
// ITSpendOther:any;

// OutsourcedMean:any;
// CapExMean:any;
// OpExMean:any;

// RunMean:any;
// ChangeMean:any;
// TransformMean:any;
// attritionMean:any;

  mapData(scenarioData): any {
    
    for (let element of scenarioData) {
      
      if (element.value==undefined||element.value == null || element.value == "") {
        element.value = -9999;
      }
      if(element.key != "PR0900"){
        this.obj[element.key] = parseFloat(element.value);
      }else{
        this.obj[element.key] = element.value;
      }
      
    }

    return this.obj;

  }
}
