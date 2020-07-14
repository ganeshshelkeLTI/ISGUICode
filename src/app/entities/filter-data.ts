/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:filter-data.ts **/
/** Description:  **/
/** Created By: 106##### Created Date: 28/09/2018 **/
/** Update By:  106##### Update Date:  28/09/2018 **/
/** Developed at:  **/
/*******************************************************/

export interface FilterData {
    industries: [{
        label: string,
        value: string
    }],
    region: [{
        label: string,
        value: string
    }],
    revenue: [{
        label: string,
        value: string
    }],
    currency: [{
        label: string,
        value: number
    }
]}