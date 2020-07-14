/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:isg-kpi-data.ts **/
/** Description:  **/
/** Created By: 106##### Created Date: 28/09/2018 **/
/** Update By:  106##### Update Date:  28/09/2018 **/
/** Developed at:  **/
/*******************************************************/

export interface IsgKpiData {
  itspendrev: {
    info: string,
    mean: number,
    lower: number,
    upper: number,
    infrastructure: {
      info: string,
      value: number,
      charts: _charts[]
    },
    applications: {
      info: string,
      value: number,
      charts: _charts[]
    },
    management: {
      info: string,
      value: number,
      charts: _charts[]
    }
  },
  itSpendPerUser: {
    info: string,
    lower: number,
    upper: number,
    mean: number,
    charts: _charts[]
  },
  itSpendByExpenditure: {
    info: string,
    personnel: number,
    hardware: number,
    software: number,
    outsourced:number,
    other: number
  },
  itSpendOutSourced : {
    info: string,
    mean: number,
    upper: number,
    lower: number
  },
  capexVsOpex : {
    info: string,
    capexmean: number,
    opexmean: number
  },
  itrunvschangevstransform : {
    itRun:{
      info:string,
      lower:number,
      mean:number,
      upper:number
    },
    itChange:{
      info:string,
      lower:number,
      mean:number,
      upper:number
    },
    itTransform:{
      info:string,
      lower:number,
      mean:number,
      upper:number
    }
  },
  itPersonnel : {
    info: string,
    totalemployeepercent: number,
    onshorepercent: number,
    offshorepercent: number,
    contractorpercent: number,
    attritionmean: number
  },
  userExperience : {
    info: string,
    mean: number,
    upper: number,
    lower: number,
    charts : {
      Pie1: _charts[],
      Pie2: _charts[],
      Pie3: _charts[],
    }
  },
  digitalSpend: {
    info: string,
    mean: number,
    lower: number,upper: number
  }
  charts:{
    ITSpendbyFunctionInfrastructure:any,
    ITSpendbyFunctionApplications:any,
    ITSpendbyFunctionManagement:any,
    UserExperienceIndexMean:any,
    ITSpendperUserCurrentYearMean:any
  }
}

export interface _charts {
  label: string;
  value: number;
}