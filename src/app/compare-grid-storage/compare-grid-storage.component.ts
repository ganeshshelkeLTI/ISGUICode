/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:compare-grid-storage.component.ts **/
/** Description: This file is created to compare the Scenario data and display in grid **/
/** Created By: 10650919  Created Date: 28/09/2018 **/
/** Update By:  10650919  Update Date:  28/09/2018 **/
/** Developed at:  **/
/*******************************************************/

import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ComparegridService } from '../services/comparegrid.service';
import { CompareGridService } from '../services/compare-grid.service';
import { MapSourceCodeDataValues } from '../map-source-code-data-values';
import { GetScenarioDataService } from '../services/get-scenario-data.service';

import { IndustrySizeService } from '../services/industry-size.service';

import { EnterCompareDataTowersService } from '../services/enter-compare-data-towers.service';
import { ComaparegridStorageSharedService } from '../services/storage/comaparegrid-storage-shared.service';

import { ComaparegridServerShareddataService } from '../services/comaparegrid-server-shareddata.service';

import * as jspdf from 'jspdf';
declare var jsPDF: any;
import 'jspdf-autotable';
declare var $: any;

import { StorageInputMyDataSharedService } from '../services/storage/storage-input-my-data-shared.service';
import { CIOGeneralTabCompanyDetailService } from '../services/ciogeneral-tab-company-detail.service';
import { PrivilegesService } from '../services/privileges.service';
import { negativeConstant } from '../../properties/constant-values-properties';
import { CioheaderdataService } from '../services/cioheaderdata.service';


@Component({
	selector: 'compare-grid-storage',
	templateUrl: './compare-grid-storage.component.html',
	styleUrls: ['./compare-grid-storage.component.css']
})
export class CompareGridStorageComponent implements OnInit, OnDestroy {
	mapdata: any;

	// Variables for formulae
	onshore: any;
	offshore: any;
	onshoreLeftDefaultvalue = 100;
	FTEPercent: any;
	contractorPercent: any;
	ITSpendRevMean: any;
	Infra: any;
	App: any;
	Management: any;

	ITSpendPerUserMeanCY: any;

	ITSpendPersonnel: any;
	ITSpendHardware: any;
	ITSpendSoftware: any;
	ItSpendOutsourced: any;
	ITSpendOther: any;

	OutsourcedMean: any;
	CapExMean: any;
	OpExMean: any;

	RunMean: any;
	ChangeMean: any;
	TransformMean: any;
	attritionMean: any;

	// Variables for formulae
	scenarioData = [];
	selectedValue: Object;
	iconShow: boolean = true;
	data: any;
	selectedSectionValues: any;
	showCompareGridChild: boolean = false;
	objSpendRev: any;

	objApplication: any;
	objInfra: any;
	objmanagement: any;

	objitSpendPerUser: any;

	objpersonnel: any;

	objhardware: any;
	objsoftware: any;
	objoutsourced: any;
	objother: any;

	objitSpendOutSourced: any;

	objcapexmean: any;
	objopexmean: any;

	objitRun: any;
	objitChange: any;
	objitTransform: any;

	objonshorepercent: any;
	objoffshorepercent: any;
	objcontractorpercent: any;
	objattritionmean: any;
	objtotalEmployeesPerc: any;

	objuserExperience: any;
	objdigitalSpend: any;

	public sectionSize: string = 'small';

	selectedscenarioID: any[] = [];
	scenarioNametoCompare;

	//custtom reference variable
	isCRSelected: boolean = false;
	customRefSeq: any;
	selectedRegionCount = 0;
	selectedCustomRefCount = 0;

	public pageId: any;

	enterMyData = {
		availablityPercentage: null,
		annualMainframeCost: null,
		mainframeEmployedFTEs: null,
		mainframeContractedFTEs: null,
		noOfConfiguredMIPS: null,
		utilizationPercentage: null,
		staffingmixEmployee: null,
		staffingmixContract: null
	};

	storagePersonnelCostAllocation: any;
	storageHardwareCostAllocation: any;
	storageSoftwareCostAllocation: any;
	storageOutsourcingCostAllocation: any;

	storageTCOAnnualCostAllocation: any;
	storageTCOMarketCostAllocation: any;
	storageEmpFTECostAllocation: any;
	storageContractorFTECostAllocation: any;
	sotrageUtilization: any;
	sotrageAvailability: any;
	storageNumberMIPFTE: any;
	storageStaffingEmployees: any;
	storageStaffingContractors: any;
	// object.storageTypeTBA
	//object.storageTypeTBB
	// object.storageTypeTBC
	storageTypeTBSAN: any;
	storageTypeTBNAS: any;
	storageTypeTBOther: any;

	//tooltip
	storagePersonnelCostAllocationTooltip: any;
	storageHardwareCostAllocationTooltip: any;
	storageSoftwareCostAllocationTooltip: any;
	storageOutsourcingCostAllocationTooltip: any;
	storageTCOAnnualCostAllocationTooltip: any;
	storageTCOMarketCostAllocationTooltip: any;
	storageEmpFTECostAllocationTooltip: any;
	storageContractorFTECostAllocationTooltip: any;
	sotrageUtilizationTooltip: any;
	sotrageAvailabilityTooltip: any;
	storageNumberMIPFTETooltip: any;
	storageStaffingEmployeesTooltip: any;
	storageStaffingContractorsTooltip: any;

	storageTypeTBSANTooltip: any;
	storageTypeTBNASTooltip: any;
	storageTypeTBOtherTooltip: any;

	public costallocationTooltip: string;
	public annualCostPerTB: string;
	public storTypePerTB: string;
	public annualCostPerFTE: string;
	public staffingMixTool: string;

	compareSequence: any;

	public firstScenarioCurrencyRefactor: any;
	public scenarioForLandingPage = [];


	/*****Currency Conversion********/
	reportingCurrency: any;
	allCurrencyData: any;
	requestedDataForLanding: any;
	currencyId;
	map: Map<string, string> = new Map<string, string>();
	/*******************************/

	//currency details
	public LandingPageCurrencyObject: any;
	public InputMyDataCurrencyObject: any;
	public currencyCode: any;
	public selectedCurrency: any;
	public currencyVar: any;
	public currencySymbol: any;
	public refactorVal = [];
	public defaultRefactorValue = [];
	public pdfCurrencySymbol: any;
	private privilegesObject: any;
	sessionId: any;
	loggedInId: any;

	public infinity = 1 / 0;
	public dashSymbol = '-';
	public selectedScenarios: any = [];
	public count: any;

	//negative constant for null values
	NEGATIVE_CONST: number;

	@Output() messageEvent = new EventEmitter<string>();
	@Output() flagEvent = new EventEmitter<boolean>();

	constructor(
		private commonService: CioheaderdataService,
		private sharedService: ComaparegridStorageSharedService,
		private compareGridService: EnterCompareDataTowersService,
		private getScenarioDataService: GetScenarioDataService,
		private sectionService: IndustrySizeService,
		private gridCloseService: ComaparegridServerShareddataService,
		private storageSharedService: StorageInputMyDataSharedService,
		private cIOGeneralTabCompanyDetailService: CIOGeneralTabCompanyDetailService,
		private privilegesService: PrivilegesService
	) {
		this.loggedInId = JSON.parse(localStorage.getItem('userloginInfo'));
		this.sessionId = this.loggedInId.userDetails.sessionId;
		let object = this;
		object.privilegesObject = object.privilegesService.getData();

		object.privilegesService.getEmitter().on('updatePrivileges', function () {
			object.privilegesObject = object.privilegesService.getData();
		});
	}

	ngOnInit() {
		let object = this;
		this.currencyVar = require('currency-symbol-map');

		//get currency data for currency conversion
		object.cIOGeneralTabCompanyDetailService.getAllCurrency().subscribe((currency) => {
			object.allCurrencyData = currency;
			// console.log(object.allCurrencyData);
		});
		this.getComparedData();
	}

	triggerCollapse(obj) {
		if ($(obj).data('lastState') === undefined || $(obj).data('lastState') === 1) {
			$('.panel-collapse')
				.removeData('bs.collapse')
				.collapse({
					parent: 'false',
					toggle: 'false'
				})
				.collapse('show')
				.removeData('bs.collapse')
				.collapse({
					parent: '#accordion',
					toggle: 'false'
				});
			$('.panel-title').find('a:first').attr('aria-expanded', true);

			$(obj).data('lastState', 0);

		} else {
			$('.collapse.in').collapse('hide');
			$(obj).data('lastState', 1);
		}
	}

	isMainframe: boolean = false;
	isServer: boolean = false;

	getComparedData() {
		let object = this;

		object.sharedService.getEmitter().on('storageDataChange', function () {
			let requestedData: any = {};
			let selectedRegionCount = 0;
			let selectedScenarioCount = 0;
			let selectedscenarioID: any[] = [];
			let selectedScenarioName: any[] = [];
			object.selectedscenarioID = [];
			let selectedValues: string[] = [];
			let dashboardIds: string[] = [];
			let customReferenceSequence: any[] = [];
			let selectedCurrencyToCompare:any;
			selectedCurrencyToCompare = object.sharedService.getData().selectedCurrencyToCompare;
			

			object.selectedScenarios = object.sharedService.getData().selectedScenarios;

			object.selectedScenarios.forEach((element) => {
				if (element.value === true) {
					object.selectedscenarioID.push(element.id);
					selectedScenarioName.push(element.label);
					selectedScenarioCount++;
				}
			});

			object.scenarioNametoCompare = selectedScenarioName.reverse();
			object.selectedscenarioID = object.selectedscenarioID.reverse();

			//get dashboard id
			this.pageId = object.sectionService.getPageId();

			if (object.selectedscenarioID.length > 0) {
				let savedScenarioObj: any;
				savedScenarioObj = {
					sessionId: object.sessionId,
					dashboardId: this.pageId,
					scenarioId: object.selectedscenarioID
				};

				object.compareGridService.getSavedScenarioData(savedScenarioObj).subscribe(
					(data) => {
						//1)this will retrieve saved scenario data
						let region: any = [];
						for (let index = 0; index < data.length; index++) {

							object.scenarioData = data[index].kpi_maintenance_data;

							//2)this will identify selected currency
							object.scenarioData.forEach((element) => {
								//3)this will map src_code and it's value format
								object.map[element.key] = element.value_format;
								if (element.key == 'ICE002') {
									object.currencyId = element.value;
								}
								if (element.key == 'TD0110') {
									region.push(element.value);
								}
							});


							if (object.currencyId == null || object.currencyId == "" || object.currencyId == undefined) {
								// USD key
								object.currencyId = "FE482E13-D3B6-4208-8C3C-2FD7AFBEBEA1";
							}

							//4)this will get data related selected currency
							object.allCurrencyData.currencyExchange.forEach((element) => {
								if (
									object.currencyId != null &&
									object.currencyId != undefined &&
									object.reportingCurrency != ''
								) {
									if (element.key == object.currencyId) {

										if (index >= 0 && (data.length >= 1))   //convert scenario currency with respect to first scenario
										{
											console.log("*******selected currency:",selectedCurrencyToCompare);
											object.reportingCurrency = selectedCurrencyToCompare;

											object.InputMyDataCurrencyObject = object.reportingCurrency;
											//change currency symbol
											object.currencySymbol = object.currencyVar(object.InputMyDataCurrencyObject.value);
											object.firstScenarioCurrencyRefactor = object.reportingCurrency.id;
											let calc = (1 / Number(element.id) * object.firstScenarioCurrencyRefactor);
											console.log("console for scenario value:",index,calc)
											object.refactorVal[index] = calc;
										}
										object.pdfCurrencySymbol = object.InputMyDataCurrencyObject.value;
									}
								}
							});
							//6)this will perform calculation on entered data and return calculated values
							object.compareScenarioData(object.scenarioData);

							if (index == 0) {
								//7)mapping all attributes into object which are required for currency conversion and calculation of entered data on landing page
								object.requestedDataForLanding = {};

								object.requestedDataForLanding.comparisionData = JSON.parse(
									JSON.stringify(object.scenarioData)
								);

								if (
									object.reportingCurrency != null &&
									object.reportingCurrency != undefined &&
									object.reportingCurrency != ''
								) {
									object.requestedDataForLanding.currency = selectedCurrencyToCompare.key;
									object.requestedDataForLanding.refactorVal = object.refactorVal[0];
								}
								object.requestedDataForLanding.currencyUsed = false;
								object.requestedDataForLanding.map = object.map;

								//region
								let cnt = region.length;
								object.requestedDataForLanding.region = region[cnt - 1];


								//8)setting value of saved scenario data for calculation on landing
								object.storageSharedService.setData(object.requestedDataForLanding);
								let sortedScenarioSelection = object.selectedscenarioID.sort();
								object.storageSharedService.setScenarioSelection(sortedScenarioSelection[0]);

								object.storageSharedService.getEmitter().emit('callFunction');
							}
						}
					},
					(error) => {
						//throw custom exception to global error handler
						//create error object
						let errorObj = {
							dashboardId: this.pageId,
							pageName: 'Non CIO Storage Tower Compare Grid Screen',
							errorType: 'Fatal',
							errorTitle: 'Web Service Error',
							errorDescription: error.message,
							errorObject: error
						};

						throw errorObj;
					}
				);
			} else {
				object.mapdata = undefined;
				let scenId = {
					id: -9999
				}
				object.commonService.setScenario(scenId);
				object.commonService.getEventEmitter().emit('storagescenariodropdownchange');
				//get currency on landing page
				object.LandingPageCurrencyObject = object.sectionService.getCurrencyObject();
				//change currency symbol
				object.currencySymbol = object.currencyVar(object.LandingPageCurrencyObject.value);
				object.refactorVal.push(object.LandingPageCurrencyObject.id);
				object.pdfCurrencySymbol = object.LandingPageCurrencyObject.value;
			}



			if (object.sharedService.getData().selectedMode == 'industry') {
				requestedData.sectionName = 'Industry';
				object.isCRSelected = false;
				let selectedValues: string[] = [];

				object.sharedService.getData().selectedIndustries.forEach((element) => {
					if (element.value === true) {
						selectedValues.push(element.label);
					}
				});

				requestedData.sectionValues = selectedValues;
			} else if (object.sharedService.getData().selectedMode == 'server') {
				requestedData.sectionName = 'Server';
				object.isCRSelected = false;
				let selectedValues: string[] = [];
				let dashboardIds: string[] = [];
				object.sharedService.getData().selectedServers.forEach((element) => {
					if (element.value === true) {
						selectedValues.push(element.label);
						dashboardIds.push(element.dashboardId);
					}
				});

				requestedData.sectionValues = selectedValues;
				requestedData.dashBoardIds = dashboardIds;

				//get dashboard id
				//this.pageId = object.sectionService.getPageId();
				requestedData.dashBoardId = this.pageId;

				//section size
				this.sectionSize = object.sectionService.getselectedIndustrySize();
				requestedData.sectionSize = this.sectionSize;


			} else if (object.sharedService.getData().selectedMode == 'region') {
				requestedData.sectionName = 'Region';
				object.isCRSelected = false;
				let selectedValues: string[] = [];
				object.sharedService.getData().selectedRegion.forEach((element) => {
					if (element.value === true) {
						selectedValues.push(element.id);
						object.selectedRegionCount++;
					}
				});

				requestedData.sectionValues = selectedValues;

				//get dashboard id
				// this.pageId = object.sectionService.getPageId();
				requestedData.dashBoardId = this.pageId;

				//section size
				this.sectionSize = object.sectionService.getselectedIndustrySize();
				requestedData.sectionSize = this.sectionSize;
			} else if (object.sharedService.getData().selectedMode == 'custom_reference') {
				console.log("this block is called");
				object.isCRSelected = true;
				requestedData.sectionName = 'CustomReference';
				object.sharedService.getData().selectedcustomRerence.forEach((element) => {
					console.log("object.sharedService.getData().selectedMode", object.sharedService.getData());


					if (element.value === true) {
						selectedValues.push(element.id);
						customReferenceSequence.push(element.label);
						object.selectedCustomRefCount++;
					}
				});
				console.log("sequence", customReferenceSequence);
				requestedData.sectionValues = selectedValues;
				console.log('selectedValues', selectedValues);
				object.customRefSeq = customReferenceSequence;
				//get dashboard id
				// this.pageId = object.sectionService.getPageId();
				requestedData.dashBoardId = this.pageId;

				//section size
				// this.sectionSize = object.sectionService.getselectedIndustrySize();
				// requestedData.sectionSize = this.sectionSize;
			}

			let requestParams = {
				selectedValue: requestedData,
				sessionId: object.sessionId
			};

			object.selectedSectionValues = requestedData.sectionValues;

			//get tooltip data in sync with landing screen for groups
			object.sectionService.getDefinitionData().subscribe(
				(responseData) => {
					//tooltips

					object.costallocationTooltip = responseData.storagearchitecturehardware.defination;
					object.annualCostPerTB = responseData.costpertb_upper.defination;
					object.storTypePerTB = responseData.san.defination;
					object.annualCostPerFTE = responseData.costpercontractor_lower.defination;
					object.staffingMixTool = responseData.staffingmixcontractor_lower.defination;

					object.storageNumberMIPFTETooltip = responseData.tbsperfte_lower.defination;

					object.sotrageAvailabilityTooltip = responseData.availability_upper.defination;

				},
				(error) => {
					//throw custom exception to global error handler
					//create error object
					let errorObj = {
						dashboardId: this.pageId,
						pageName: 'Non CIO Storage Tower Compare Grid Screen',
						errorType: 'Warning',
						errorTitle: 'Data Error',
						errorDescription: error.message,
						errorObject: error
					};

					throw errorObj;
				}
			);

			//getting compared data according to selected section values
			if (object.sharedService.getData().selectedMode == 'region' || object.sharedService.getData().selectedMode == 'servers') {
				object.compareGridService.getCompareData(requestParams).subscribe(
					(responseData) => {

						try {
							object.getCompareMappingData(responseData);
						} catch (error) {
							//throw custom exception to global error handler
							//create error object
							let errorObj = {
								dashboardId: this.pageId,
								pageName: 'Non CIO Storage Tower Compare Grid Screen',
								errorType: 'warn',
								errorTitle: 'Data Error',
								errorDescription: error.message,
								errorObject: error
							};

							throw errorObj;
						}
						//parse sever specific data

						object.showCompareGridChild = true;
					},
					(error) => {
						//throw custom exception to global error handler
						//create error object
						let errorObj = {
							dashboardId: this.pageId,
							pageName: 'Non CIO Storage Tower Compare Grid Screen',
							errorType: 'Fatal',
							errorTitle: 'Web Service Error',
							errorDescription: error.message,
							errorObject: error
						};

						throw errorObj;
					}
				);
			} else {
				object.compareGridService.getCRGCompareData(requestParams).subscribe(
					(responseData) => {
						object.getCompareMappingData(responseData);
					},
					(error) => {
						//throw custom exception to global error handler
						//create error object
						let errorObj = {
							dashboardId: this.pageId,
							pageName: 'Non CIO Mainframe Tower Compare Grid Screen',
							errorType: 'Warning',
							errorTitle: 'Data Error',
							errorDescription: error.message,
							errorObject: error
						};
						throw errorObj;
					});
			}

			// object.getScenarioData();
			//add condition if user gets any scenario id (add attribute scenario id in compare
			//component when user clicks on compare selected scenario id should be bind to it so
			//that emmited value can be used here)then call "getSavedScenarioData" service from
			//compareGridService which will return the saved scenario data and pass that object to
			//compareScenarioData() function else call getScenarioData() function
		});
	}

	getCompareMappingData(responseData) {
		let object = this;
		object.data = [];
		object.data = responseData.data;

		if (object.selectedscenarioID.length > 0) {
			
			if (object.firstScenarioCurrencyRefactor) {
				object.defaultRefactorValue[0] = object.firstScenarioCurrencyRefactor;
			}
		}
		else {
			object.defaultRefactorValue[0] = 1;
		}

		if (object.isCRSelected) {
			object.compareSequence = object.customRefSeq;
		}
		else if (object.selectedRegionCount > 1) {
			object.compareSequence = responseData.sequence;
		} else {
			object.compareSequence = object.selectedSectionValues;
		}


		object.storagePersonnelCostAllocation = object.data.TotalStorageCostAllocation.CostAllocationEmp.Number.value
			.replace(/[\[\]']+/g, '')
			.split(',');

		object.storageHardwareCostAllocation = object.data.TotalStorageCostAllocation.CostAllocationHW.Number.value
			.replace(/[\[\]']+/g, '')
			.split(',');
		object.storageSoftwareCostAllocation = object.data.TotalStorageCostAllocation.CostAllocationSW.Number.value
			.replace(/[\[\]']+/g, '')
			.split(',');
		object.storageOutsourcingCostAllocation = object.data.TotalStorageCostAllocation.CostAllocationOS.Number.value
			.replace(/[\[\]']+/g, '')
			.split(',');

		object.storageTCOAnnualCostAllocation = object.data.AnnualCostPerInstalledTB.PricePerTB.NumberCY.value
			.replace(/[\[\]']+/g, '')
			.split(',');
		object.storageTCOMarketCostAllocation = object.data.AnnualCostPerInstalledTB.PricePerTB.NumberPY1.value
			.replace(/[\[\]']+/g, '')
			.split(',');

		object.storageEmpFTECostAllocation = object.data.AnnualCostPerStorageFTE.CostPerEmployee.Number.value
			.replace(/[\[\]']+/g, '')
			.split(',');
		object.storageContractorFTECostAllocation = object.data.AnnualCostPerStorageFTE.CostPerContractor.Number.value
			.replace(/[\[\]']+/g, '')
			.split(',');

		object.sotrageUtilization = object.data.Utilization.Utilization.Number.value
			.replace(/[\[\]']+/g, '')
			.split(',');
		object.sotrageAvailability = object.data.Availability.Availability.Number.value
			.replace(/[\[\]']+/g, '')
			.split(',');

		object.storageNumberMIPFTE = object.data.NumberofStorageTBsPerFTE.TBsPerFTE.Number.value
			.replace(/[\[\]']+/g, '')
			.split(',');

		object.storageStaffingEmployees = object.data.StaffingMix.StaffingMixEmployee.Number.value
			.replace(/[\[\]']+/g, '')
			.split(',');
		object.storageStaffingContractors = object.data.StaffingMix.StaffingMixContractor.Number.value
			.replace(/[\[\]']+/g, '')
			.split(',');

		// object.storageTypeTBA = = object.data.StaffingMix.StaffingMixContractor.Number.value.replace(/[\[\]']+/g, '').split(",");
		//object.storageTypeTBB
		// object.storageTypeTBC
		object.storageTypeTBSAN = object.data.StoragebyType.SAN.SAN.value
			.replace(/[\[\]']+/g, '')
			.split(',');
		object.storageTypeTBNAS = object.data.StoragebyType.NAS.NAS.value
			.replace(/[\[\]']+/g, '')
			.split(',');
		object.storageTypeTBOther = object.data.StoragebyType.Backup.Backup.value
			.replace(/[\[\]']+/g, '')
			.split(',');

		//tooltip
		object.storagePersonnelCostAllocationTooltip = object.data.TotalStorageCostAllocation.CostAllocationEmp.Number.info
			.replace(/[\[\]']+/g, '')
			.split(',');
		object.storageHardwareCostAllocationTooltip = object.data.TotalStorageCostAllocation.CostAllocationHW.Number.info
			.replace(/[\[\]']+/g, '')
			.split(',');
		object.storageSoftwareCostAllocationTooltip = object.data.TotalStorageCostAllocation.CostAllocationSW.Number.info
			.replace(/[\[\]']+/g, '')
			.split(',');
		object.storageOutsourcingCostAllocationTooltip = object.data.TotalStorageCostAllocation.CostAllocationOS.Number.info
			.replace(/[\[\]']+/g, '')
			.split(',');
		object.storageTCOAnnualCostAllocationTooltip = object.data.AnnualCostPerInstalledTB.PricePerTB.NumberCY.info
			.replace(/[\[\]']+/g, '')
			.split(',');
		object.storageTCOMarketCostAllocationTooltip = object.data.AnnualCostPerInstalledTB.PricePerTB.NumberPY1.info
			.replace(/[\[\]']+/g, '')
			.split(',');
		object.storageEmpFTECostAllocationTooltip = object.data.AnnualCostPerStorageFTE.CostPerEmployee.Number.info
			.replace(/[\[\]']+/g, '')
			.split(',');
		object.storageContractorFTECostAllocationTooltip = object.data.AnnualCostPerStorageFTE.CostPerContractor.Number.info
			.replace(/[\[\]']+/g, '')
			.split(',');
		object.sotrageUtilizationTooltip = object.data.Utilization.Utilization.Number.info
			.replace(/[\[\]']+/g, '')
			.split(',');
		// object.sotrageAvailabilityTooltip = object.data.Availability.Availability.Number.info
		// 	.replace(/[\[\]']+/g, '')
		// 	.split(',');
		// object.storageNumberMIPFTETooltip = object.data.NumberofStorageTBsPerFTE.TBsPerFTE.Number.info
		// 	.replace(/[\[\]']+/g, '')
		// 	.split(',');

		object.storageStaffingEmployeesTooltip = object.data.StaffingMix.StaffingMixEmployee.Number.info
			.replace(/[\[\]']+/g, '')
			.split(',');
		object.storageStaffingContractorsTooltip = object.data.StaffingMix.StaffingMixContractor.Number.info
			.replace(/[\[\]']+/g, '')
			.split(',');

		object.storageTypeTBSANTooltip = object.data.StoragebyType.SAN.SAN.info
			.replace(/[\[\]']+/g, '')
			.split(',');
		object.storageTypeTBNASTooltip = object.data.StoragebyType.NAS.NAS.info
			.replace(/[\[\]']+/g, '')
			.split(',');
		object.storageTypeTBOtherTooltip = object.data.StoragebyType.Backup.Backup.info
			.replace(/[\[\]']+/g, '')
			.split(',');
	}

	popupResize() {
		this.iconShow = false;

		this.messageEvent.emit('maximize');
	}
	popupMinimize() {
		this.iconShow = true;

		this.messageEvent.emit('minimize');
	}
	closeGridView() {
		setTimeout(() => {
			this.showCompareGridChild = false;
			this.data = {};
		}, 2000);

		this.resetPreviousSelection();

		//emit event to reset comapre popup
		this.sharedService.getEmitter().emit('storageGridClose');
	}

	closeEditGridView() {
		setTimeout(() => {
			this.showCompareGridChild = false;
			this.data = {};
		}, 2000);

		this.resetPreviousSelection();
	}

	resetPreviousSelection() {


		//scenario fields
		this.mapdata = undefined;
		this.staffingmixEmp = [];
		this.staffingmixContract = [];
		this.storageMyDataStaffContract = '';
		this.storageMyDataCostEmp = '';
		this.storageMyDataSoft = '';
		this.storageMyDataHard = '';
		this.storageMyDataOut = '';
		this.storageMyDataTCOMIP = [];
		this.storageMyDataMarketMIP = '';
		this.storageMyDataFTE = [];
		this.storageMyDataFTEContract = [];
		this.storageMyDataUtil = [];
		this.storageMyDataAvail = [];
		this.storageMyDataFTENum = [];
		this.storageCoreForm = '';
		this.storageCoreMarket = '';
		this.storageSAN = [];
		this.storageNAS = [];
		this.storageOther = [];

		//industry fields

		this.storagePersonnelCostAllocation = '';
		this.storageHardwareCostAllocation = '';
		this.storageSoftwareCostAllocation = '';
		this.storageOutsourcingCostAllocation = '';

		this.storageTCOAnnualCostAllocation = '';
		this.storageTCOMarketCostAllocation = '';
		this.storageEmpFTECostAllocation = '';
		this.storageContractorFTECostAllocation = '';
		this.sotrageUtilization = '';
		this.sotrageAvailability = '';
		this.storageNumberMIPFTE = '';
		this.storageStaffingEmployees = '';
		this.storageStaffingContractors = '';
		this.storageTypeTBSAN = '';
		this.storageTypeTBNAS = '';
		this.storageTypeTBOther = '';

		//headers
		this.scenarioNametoCompare = undefined;
		this.compareSequence = undefined;
		this.customRefSeq = undefined;

		//refactor
		this.refactorVal = [];

	}

	//this function will get data which were entered on input my screen
	getScenarioData() {
		let object = this;
		object.getScenarioDataService.getEmitter().on('dataChange', function () {
			object.scenarioData = object.getScenarioDataService.getData();
			object.compareScenarioData(object.scenarioData);
		});
	}

	staffingmixContract: any = [];
	staffingmixEmp: any = [];
	storageMyDataStaffContract: any;
	storageMyDataCostEmp: any;
	storageMyDataSoft: any;
	storageMyDataHard: any;
	storageMyDataOut: any;
	storageMyDataTCOMIP: any = [];
	storageMyDataMarketMIP: any;
	storageMyDataFTE: any = [];
	storageMyDataFTEContract: any = [];
	storageMyDataUtil: any = [];
	storageMyDataAvail: any = [];
	storageMyDataFTENum: any = [];
	storageCoreForm: any;
	storageCoreMarket: any;
	storageSAN: any = [];
	storageNAS: any = [];
	storageOther: any = [];

	//this function will mapped the data and then perform calculations on it and mapped values with appropriate field
	compareScenarioData(requestedData: Object) {
		try {
			let object = this;
			let test = new MapSourceCodeDataValues();
			object.mapdata = test.mapData(requestedData);

			//get constant value
			object.NEGATIVE_CONST = negativeConstant.NEGATIVE_CONSTANT;




			var temp10 = eval('object.mapdata.DES100 / (object.mapdata.ES0010)');
			//if not a number

			if (temp10 == Infinity || temp10 == 'infinity' || temp10 == "Infinity" || isNaN(temp10)) {
				object.storageMyDataTCOMIP.push(this.NEGATIVE_CONST);
			}
			object.storageMyDataTCOMIP.push(eval('object.mapdata.DES100 / (object.mapdata.ES0010)'));

			object.count = object.storageMyDataTCOMIP.length - 1;

			if (object.mapdata.EES010 == 0 && object.mapdata.EES020 == 0) {
				object.storageMyDataFTE.push(this.NEGATIVE_CONST);
			}
			else if (object.mapdata.EES010 == this.NEGATIVE_CONST && object.mapdata.EES020 == this.NEGATIVE_CONST) {
				object.storageMyDataFTE.push(this.NEGATIVE_CONST);
			}
			else if (object.mapdata.EES010 == this.NEGATIVE_CONST) {
				object.storageMyDataFTE.push(this.NEGATIVE_CONST);
			}
			else if (object.mapdata.EES020 == this.NEGATIVE_CONST) {
				object.storageMyDataFTE.push(eval('object.mapdata.EES010 / (object.mapdata.EES010+0)'));
			}
			else {
				object.storageMyDataFTE.push(eval('object.mapdata.EES010 / (object.mapdata.EES010+object.mapdata.EES020)'));
			}

			var temp1 = eval('object.mapdata.EES010 / (object.mapdata.EES010+object.mapdata.EES020)');

			//if not a number

			if (temp1 == Infinity || temp1 == 'infinity' || temp1 == "Infinity" || isNaN(temp1)) {
				object.storageMyDataFTE.push(this.NEGATIVE_CONST);
			}


			if (object.mapdata.EES010 == 0 && object.mapdata.EES020 == 0) {
				object.storageMyDataFTEContract.push(this.NEGATIVE_CONST);
			}
			else if (object.mapdata.EES010 == this.NEGATIVE_CONST && object.mapdata.EES020 == this.NEGATIVE_CONST) {
				object.storageMyDataFTEContract.push(this.NEGATIVE_CONST);
			}
			else if (object.mapdata.EES020 == this.NEGATIVE_CONST) {
				object.storageMyDataFTEContract.push(this.NEGATIVE_CONST);
			}
			else if (object.mapdata.EES010 == this.NEGATIVE_CONST) {
				object.storageMyDataFTEContract.push(eval('object.mapdata.EES020 / (0+object.mapdata.EES020)'));
			}
			else {
				object.storageMyDataFTEContract.push(eval(
					'object.mapdata.EES020 / (object.mapdata.EES010+object.mapdata.EES020)'
				));
			}

			var temp2 = eval(
				'object.mapdata.EES020 / (object.mapdata.EES010+object.mapdata.EES020)'
			);


			//if not a number

			if (temp2 == Infinity || temp2 == 'infinity' || temp2 == "Infinity" || isNaN(temp2)) {
				object.storageMyDataFTEContract.push(this.NEGATIVE_CONST);
			}


			var temp11 = eval('object.mapdata.E37060');
			//if not a number

			if (temp11 == Infinity || temp11 == 'infinity' || temp11 == "Infinity" || isNaN(temp11)) {
				object.storageMyDataUtil.push(this.NEGATIVE_CONST);
			}
			object.storageMyDataUtil.push(eval('object.mapdata.E37060'));


			var temp3 = eval('object.mapdata.E34060');
			//if not a number
			if (!Number(temp3)) {
				object.storageMyDataAvail = 0;
			}

			if (temp3 == Infinity || temp3 == 'infinity' || temp3 == "Infinity" || isNaN(temp3)) {
				object.storageMyDataAvail.push(this.NEGATIVE_CONST);
			}
			object.storageMyDataAvail.push(eval('object.mapdata.E34060'));

			if (object.mapdata.EES010 == 0 && object.mapdata.EES020 == 0) {
				object.storageMyDataFTENum.push(this.NEGATIVE_CONST);
			}
			else if (object.mapdata.ES0010 == this.NEGATIVE_CONST && object.mapdata.EES010 == this.NEGATIVE_CONST && object.mapdata.EES020 == this.NEGATIVE_CONST) {
				object.storageMyDataFTENum.push(this.NEGATIVE_CONST);
			}
			else if (object.mapdata.EES010 == this.NEGATIVE_CONST && object.mapdata.EES020 == this.NEGATIVE_CONST) {
				object.storageMyDataFTENum.push(eval("object.mapdata.ES0010 / 0"));
			}
			else if (object.mapdata.ES0010 == this.NEGATIVE_CONST) {
				object.storageMyDataFTENum = 0;
			}
			else if (object.mapdata.EES010 == this.NEGATIVE_CONST) {
				object.storageMyDataFTENum.push(eval("object.mapdata.ES0010 / (0 + object.mapdata.EES020)"));
			}
			else if (object.mapdata.EES020 == this.NEGATIVE_CONST) {
				object.storageMyDataFTENum.push(eval("object.mapdata.ES0010 / (object.mapdata.EES010 + 0)"));
			}
			else {
				// ( EES010 + EES020 ) / ES0010
				object.storageMyDataFTENum.push(eval("object.mapdata.ES0010 / (object.mapdata.EES010 + object.mapdata.EES020)"));
			}

			var temp4 = eval("object.mapdata.ES0010 / (object.mapdata.EES010 + object.mapdata.EES020)");

			//if not a number			
			if (temp4 == Infinity || temp4 == 'infinity' || temp4 == "Infinity" || isNaN(temp4)) {
				object.storageMyDataFTENum.push(this.NEGATIVE_CONST);
			}


			if (object.mapdata.EES010 == this.NEGATIVE_CONST && object.mapdata.EES020 == this.NEGATIVE_CONST) {
				object.staffingmixContract.push(this.NEGATIVE_CONST);
			}
			else if (object.mapdata.EES020 == this.NEGATIVE_CONST) {
				// object.mapdata.ESP020=0;
				object.staffingmixContract.push(this.NEGATIVE_CONST);
			}
			else if (object.mapdata.EES010 == this.NEGATIVE_CONST) {
				object.staffingmixContract.push(eval("object.mapdata.EES020 / (0 + object.mapdata.EES020)"));
			}
			else {
				object.staffingmixContract.push(eval("object.mapdata.EES020 / (object.mapdata.EES010 + object.mapdata.EES020)") * 100);
			}
			var temp5 = eval("object.mapdata.EES020 / (object.mapdata.EES010 + object.mapdata.EES020)") * 100;


			// object.staffingmixContract =
			// 	eval('object.mapdata.EES020 / (object.mapdata.EES010+object.mapdata.EES020)') * 100;

			//if not a number
			if (temp5 == Infinity || isNaN(temp5)) {
				object.staffingmixContract.push(this.NEGATIVE_CONST);
			}

			if (object.mapdata.EES010 == this.NEGATIVE_CONST && object.mapdata.EES020 == this.NEGATIVE_CONST) {
				object.staffingmixEmp.push(this.NEGATIVE_CONST);
			}
			else if (object.mapdata.EES010 == this.NEGATIVE_CONST) {
				// object.mapdata.ESP020=0;
				object.staffingmixEmp.push(this.NEGATIVE_CONST);
			}
			else if (object.mapdata.EES020 == this.NEGATIVE_CONST) {
				object.staffingmixEmp.push(eval("object.mapdata.EES010 / (object.mapdata.EES010 + 0)"));
			}
			else {
				object.staffingmixEmp.push(eval('object.mapdata.EES010 / (object.mapdata.EES010+object.mapdata.EES020)') * 100)
					;
			}

			var temp6 = eval('object.mapdata.EES010 / (object.mapdata.EES010+object.mapdata.EES020)') * 100;

			//if not a number
			if (temp6 == Infinity || isNaN(temp6)) {
				object.staffingmixEmp.push(this.NEGATIVE_CONST);
			}



			var temp7 = eval('object.mapdata.ES0750');
			//if not a number
			if (temp7 == Infinity || temp7 == 'infinity' || temp7 == "Infinity" || isNaN(temp7)) {
				object.storageSAN.push(this.NEGATIVE_CONST);
			}
			object.storageSAN.push(eval('object.mapdata.ES0750'));

			var temp8 = eval('object.mapdata.ES0755')
			//if not a number

			if (temp8 == Infinity || temp8 == 'infinity' || temp8 == "Infinity" || isNaN(temp8)) {
				object.storageNAS.push(this.NEGATIVE_CONST);
			}
			object.storageNAS.push(eval('object.mapdata.ES0755'));


			var temp9 = eval('object.mapdata.ES0760');
			//if not a number
			if (!Number(temp9)) {
				object.storageOther = 0;
			}

			if (temp9 == Infinity || temp9 == 'infinity' || temp9 == "Infinity" || isNaN(temp9) || temp9 == '') {
				object.storageOther.push(this.NEGATIVE_CONST);
			}
			object.storageOther.push(eval('object.mapdata.ES0760'));


		} catch (error) {
			//throw custom exception to global error handler
			//create error object
			let errorObj = {
				dashboardId: this.pageId,
				pageName: 'Non CIO Storage Tower Compare Grid Screen',
				errorType: 'warn',
				errorTitle: 'Data Error',
				errorDescription: error.message,
				errorObject: error
			};

			throw errorObj;
		}
		this.showCompareGridChild = true;

	}

	generatePDF() {
		let pdf = new jsPDF('p', 'pt', 'a4');
		var number = 11;
		// var base64Img =
		// 	'data:image/jpeg;base64, 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';
		//var base64Img = 'data:image/jpeg;base64, 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';
		// var base64Img = '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';
		var base64Img = 'data:image/png;base64,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'
		var header = function (data) {
			pdf.setFontSize(18);
			pdf.setTextColor(40);
			pdf.setFontStyle('normal');
			pdf.text('', data.settings.margin.left, 50);
		};

		for (var i = 1; i < number; i++) {
			var headertable = 'Table_header' + i;
			var Datatable = 'Table_Data' + i;

			var res1 = document.getElementById(headertable);
			var Table_header1 = pdf.autoTableHtmlToJson(res1);
			var elem1 = document.getElementById(Datatable);
			var Table_Data1 = pdf.autoTableHtmlToJson(elem1);

			var Table_selected_industry_regionEle = document.getElementById('Table_selected_industry_region');
			var Table_selected_industry_region = pdf.autoTableHtmlToJson(Table_selected_industry_regionEle);

			pdf.autoTable(Table_header1.columns, Table_header1.data, {
				startY: pdf.autoTableEndPosY() + 10,
				pageBreak: 'auto',
				beforePageContent: header,
				margin: {
					horizontal: 10,
					top: 10,
					bottom: 10
				},
				headerStyles: {
					fillColor: [204, 204, 204],
					textColor: 20
				},
				styles: {
					fontSize: 14,
					tableWidth: 280,
					columnWidth: '50',
					valign: 'left',
					rowHeight: 10
				},
				columnStyles: {
					0: { fillColor: [255, 255, 255] }
				},
				drawHeaderRow: function (row, data) {
					row.height = 10;
				}
			});

			if (i > 2) {
				pdf.autoTable(Table_selected_industry_region.columns, Table_selected_industry_region.data, {
					startY: pdf.autoTableEndPosY() + 10,
					pageBreak: 'auto',
					theme: 'grid',
					beforePageContent: header,
					headerStyles: {
						fillColor: [204, 204, 204],
						textColor: 20
					},
					styles: {
						overflow: 'linebreak',
						fontSize: 12,
						tableWidth: 280,
						columnWidth: 'wrap',
						valign: 'middle',
						halign: 'center',
						rowHeight: 30,
						fillColor: [129, 206, 227],
						textColor: [117, 120, 123]
					},

					columnStyle: {
						columnWidth: 'auto'
					},
					columnStyles: {
						0: { columnWidth: 100 },
						1: { columnWidth: 80 },
						2: { columnWidth: 80 },
						3: { columnWidth: 80 }
					},
					drawHeaderRow: function (row, data) {
						row.height = 30;
					},

					margin: {
						horizontal: 10,
						top: 10,
						bottom: 10
					}
				});
			}

			pdf.autoTable(Table_Data1.columns, Table_Data1.data, {
				startY: pdf.autoTableEndPosY() + 0,
				pageBreak: 'auto',
				theme: 'grid',
				beforePageContent: header,
				headerStyles: {
					fillColor: [204, 204, 204],
					textColor: 20
				},
				styles: {
					overflow: 'linebreak',
					fontSize: 12,
					tableWidth: 280,
					columnWidth: 'wrap',
					valign: 'middle',
					halign: 'center',
					rowHeight: 30
				},
				columnStyle: {
					columnWidth: 'auto'
				},
				columnStyles: {
					0: { columnWidth: 100, halign: 'left' },
					1: { columnWidth: 80 },
					2: { columnWidth: 80 },
					3: { columnWidth: 80 }
				},
				drawHeaderRow: function (row, data) {
					row.height = 30;
				},
				margin: {
					horizontal: 10,
					top: 10,
					bottom: 10
				}
			});

			if (i < 2) {
				//pdf.addImage(base64Img, 'JPEG', 350, 11, 217, 37);
				// pdf.addImage(base64Img, 'JPEG', 365, 11, 200, 35);
				pdf.addImage(base64Img, 'JPEG', 440, 8, 138, 35);
			}
		}

		pdf.save('Storage_Compare.pdf');
	}
	ngOnDestroy() {
		this.privilegesService.getEmitter().removeAllListeners();
		this.sharedService.getEmitter().removeAllListeners();
	}
}
