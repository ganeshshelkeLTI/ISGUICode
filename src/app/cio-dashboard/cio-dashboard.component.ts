/******************************************* ***********/
/************** © 2019 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:cio-dashboard.component.ts **/
/** Description: This file is created to get the ladning page data, filter related data and compare/input my data with drill downs (Chart) for CIO Dashboard **/
/** Created By: 10651227, 10641278, 10651577, 10650615, 10650513, 10641888  Created Date: 28/09/2018 **/
/** Update By:  10650919  Update Date:  01/10/2018 **/
/*******************************************************/

import {
	Component,
	OnInit,
	OnDestroy
} from '@angular/core';
import {
	IsgKpiData
} from '../entities/isg-kpi-data';
import {
	CioDashboardService
} from '../services/cio-dashboard.service'
import {
	CioheaderdataService
} from '../services/cioheaderdata.service';
import {
	ChartCIOSharedService
} from '../services/chart-cioshared.service';
import {
	EventEmitter
} from 'events';
import {
	GetScenarioDataService
} from '../services/get-scenario-data.service';
import {
	CIOEnterMyDataSharedService
} from '../services/cioenter-my-data-shared.service'
import {
	MapSourceCodeDataValues
} from '../map-source-code-data-values';
import { CIOLabelProperties } from '../../properties/cio-label-properties';
import { IndustrySizeService } from '../services/industry-size.service';
import { negativeConstant } from '../../properties/constant-values-properties';
import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
import { GenerateScenarioService } from '../services/generate-scenario.service';
import { CustomRefGroupService } from '../services/custom-ref-group/custom-ref-group.service';

@Component({
	selector: 'app-cio-dashboard',
	templateUrl: './cio-dashboard.component.html',
	styleUrls: ['./cio-dashboard.component.css'],
	providers: [CioDashboardService]
})

export class CioDashboardComponent implements OnInit, OnDestroy {

	/* input my data screen */
	private mapdata: any;
	private scenarioData: any;

	enterMyData = {
		"itspendrev": null,
		"infrastructure": null,
		"applications": null,
		"management": null,
		"itSpendPerUser": null,
		"itSpendByExpenditurepersonnel": null,
		"itSpendByExpenditurehardware": null,
		"itSpendByExpendituresoftware": null,
		"itSpendByExpenditureoutsourced": null,
		"itSpendByExpenditureother": null,
		"itSpendOutSourced": null,
		"capexmean": null,
		"opexmean": null,
		"itRun": null,
		"itChange": null,
		"itTransform": null,
		"itPersonnelFtePercent": null,
		"itPersonnelContractorPercent": null,
		"itPersonnelOnshorePercent": null,
		"itPersonnelOffshorePercent": null,
		"itPersonnelAttritionMean": null,
		"digitalSpend": null
	}

	/* input my data screen */
	showDiv: boolean = false;
	dataSource: Object;
	dataSourceApplication: Object;
	dataSourceITmgt: Object;
	dataSourceITSpendPerUser: object;
	dataSpurceUserExp: object;
	public data: any;
	showCIOData: boolean = false;
	itSpendOutsourcedVal: number = 0.45;
	showDrillDown: boolean = false;
	refactorVal: number = 1;
	currencyCode: string = "USD";
	definitionData;

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

	userExpIndexMean: any;
	digitalspend: any;

	//line chart objects
	public lineChartData: any;
	public OSInstanceMarketRateData: any;
	public currencyVar: any;
	public currencySymbol: string;

	showExperienceScoreDrill: boolean = false;

	IT_SPEND_REVENUE_HEADER_LABEL: string;
	//for conversion
	private conversionCurrency: any = null;
	private sourceCurrencyMap: Map<string, string>;

	public navigatedFromComparison: boolean = false;
	public navigateFromInput:boolean=false;

	//CRG
	public selectedcustomRef: any;
	public selectedCRGData: any;

	public selectedsceanrio: any;
	public sessionId: any;
	public userdata: any;
	public selectedScenarioForComparison: any = [];
	public scenarioObj: any;

	public showDrillDownAfterCrg:boolean=true;
	//negative constant for null values
	NEGATIVE_CONST: number;
map: Map<string, string> = new Map<string, string>();

	constructor(private service: CioDashboardService,
		private commonService: CioheaderdataService,
		private chartService: ChartCIOSharedService,
		private getScenarioDataService: GetScenarioDataService,
		private cIOEnterMyDataSharedService: CIOEnterMyDataSharedService,
		private industrySizeService: IndustrySizeService,
		private loginDataBroadcastService: LoginDataBroadcastService,
		private generateScenarioService: GenerateScenarioService,
		private customRefGroupService: CustomRefGroupService) {
		let object = this;
		let headerCioEmitter = object.commonService.getEventEmitter();

		headerCioEmitter.emit('updateUserName');
		object.sourceCurrencyMap = new Map<string, string>();
		let cIOEnterMyDataSharedEmitter = object.cIOEnterMyDataSharedService.getEmitter();
		cIOEnterMyDataSharedEmitter.on('callFunction', function () {
			//	object.refactorVal = object.commonService.getData().id;
			//	object.currencyCode = object.commonService.getData().value;
			object.sourceCurrencyMap = object.cIOEnterMyDataSharedService.getData().map;
			object.navigatedFromComparison = true;
			
			object.toggle();
			object.updateCompareData();
		})

		cIOEnterMyDataSharedEmitter.on('newCIOScenarioFromInput', function () {
			//	object.refactorVal = object.commonService.getData().id;
			//	object.currencyCode = object.commonService.getData().value;
			object.sourceCurrencyMap = object.cIOEnterMyDataSharedService.getData().map;
			object.navigateFromInput = true;
			
			object.toggle();
			object.updateCompareData();
		})

		//If user select Region/Industry to compare then we are hiding prev on MY data landing Page Comparison
		cIOEnterMyDataSharedEmitter.on('resetComparison', function () {
			object.showDiv = false;
		})

		let _emitter: EventEmitter = object.commonService.getEvent();
		_emitter.on('change', function () {
			object.refactorVal = object.commonService.getData().id;
			object.currencyCode = object.commonService.getData().value;
			//change currency symbol
			object.currencySymbol = object.currencyVar(this.currencyCode);

			object.defaultCurrency.id = String(object.refactorVal);
			object.defaultCurrency.value = object.currencyCode;

			//set updated currency to industry size service
			object.industrySizeService.setCurrencyObject(object.defaultCurrency);


			object.updateLineChartData();
			object.updateDrillDown();
		});

		_emitter.on('convertCurrency', function () {
			
			object.data.currency = object.commonService.currencies;
			
			if (object.showDiv == true) {


				object.convertCompareData(object.conversionCurrency, object.commonService.getData().key);
				object.compareExpenditureType();

				
				object.conversionCurrency = object.commonService.getData().key;

			}
			

		});

		//chane in compare scenario dropdown
		object.commonService.getEventEmitter().on('scenariodropdownchange', function () {

			//get selected scenario
			let scenario = object.commonService.getScenario();
			
			//call method to get scenario
			object.getScenarioDataById(scenario);

		});

		object.commonService.getEventEmitter().on('CRGdropdownchange', function () {

			//get selected scenario
			let crgData = object.commonService.getCRGData();
			
			//call method to get scenario
			object.getScenarioDataByCustomRef(crgData);

		});


		this.dataSpurceUserExp = {
			chart: {
				defaultcenterlabel: "67",
				animation: false,
				startingAngle: "45",
				showlegend: "0",
				labelFont: "OpenSansRegular",
				labelFontSize: 12,
				legendItemFontSize: 11,
				showToolTip: 0,
				showpercentvalues: "1",
				legendposition: "right",
				usedataplotcolorforlabels: "0",
				showTooltip: "1",
				theme: "fint",
				showLabels: 0,
				showValue: 0,
				drawCustomLegendIcon: 1,
			},
			"data": [{
				"label": "Workplace Services",
				"value": "24",
				"color": "#81cee3",
				"showValue": "0"
			}]
		};


		this.IT_SPEND_REVENUE_HEADER_LABEL = CIOLabelProperties.IT_SPEND_REVENUE_HEADER_LABEL;
	}

	display_infra = 'none';
	compareOptionModal = 'none';

	openModalDialog() {
		this.display_infra = 'block';
		this.showDrillDown = true;
	}

	closeModalDialog() {
		this.display_infra = 'none';
		this.showDrillDown = false;
	}

	display_application = 'none';

	openCompareOptionModalDialog() {
		this.compareOptionModal = 'block';
		this.showDrillDown = true;
	}

	closeCompareOptionModalDialog() {
		this.compareOptionModal = 'none';
		this.showDrillDown = false;
	}

	applicationDialog() {
		this.display_application = 'block';
		this.showDrillDown = true;
	}

	closeApplicationModalDialog() {
		this.display_application = 'none';
		this.showDrillDown = false;
	}

	display_itmgt = 'none';

	itmgtDialog() {
		this.display_itmgt = 'block';
		this.showDrillDown = true;
	}

	closeitmgtModalDialog() {
		this.display_itmgt = 'none';
		this.showDrillDown = false;
	}

	display_spendPerUser = 'none';

	spendPerUserDialog() {
		this.display_spendPerUser = 'block';
		this.showDrillDown = true;
	}

	closespendPerUserModalDialog() {
		this.display_spendPerUser = 'none';
		this.showDrillDown = false;
	}

	display_uiexp_one = 'none';
	display_uiexp_two = 'none';
	display_uiexp_three = 'none';

	uiexpDialog() {
		this.display_uiexp_one = 'block';
		this.display_uiexp_two = 'block';
		this.display_uiexp_three = 'block';
		this.showExperienceScoreDrill = true;
	}

	closeuiexpModalDialog() {
		this.display_uiexp_one = 'none';
		this.display_uiexp_two = 'none';
		this.display_uiexp_three = 'none';
		this.showExperienceScoreDrill = false;
	}

	myVal = 0;

	public doTimeout = () => {
		var myVal = "0.55";
		if (this.myVal <= 1) {
			setTimeout(this.doTimeout, 10);
		}
		this.setProgress(this.myVal);
		this.myVal += 0.01;
	}

	public updateDrillDown() {
		//For Infrastructure
		this.dataSource = {
			chart: {
				animation: true,
				startingAngle: "310",
				smartLineAlpha: "100",
				showlegend: "1",
				labelFont: "OpenSansRegular",
				labelFontSize: 12,
				legendItemFontSize: 11,
				showToolTip: false,
				showpercentvalues: "1",
				legendposition: "right",
				usedataplotcolorforlabels: "0",
				showTooltip: "1",
				theme: "fint",
				chartRightMargin: '300px',
				showLabels: false,
				legendIconScale: "2",
				drawCustomLegendIcon: 1,
				clickURLOverridesPlotLinks: 1,
				doughnutRadius: "100"
			},
			"events": {
				"legendItemClicked": function (eventObj, dataObj) {

				}
			},
			"data": this.data.charts.ITSpendbyFunctionInfrastructure
		};

		//For Application
		this.dataSourceApplication = {
			chart: {
				animation: false,
				startingAngle: "45",
				smartLineAlpha: "100",
				showlegend: "1",
				labelFont: "OpenSansRegular",
				labelFontSize: 12,
				legendItemFontSize: 11,
				showToolTip: false,
				showpercentvalues: "1",
				legendposition: "right",
				usedataplotcolorforlabels: "0",
				showTooltip: "1",
				theme: "fint",
				chartRightMargin: '100px',
				showLabels: false,
				drawCustomLegendIcon: 1,
			},
			"data": this.data.charts.ITSpendbyFunctionApplications
		};

		//For IT Management
		this.dataSourceITmgt = {
			chart: {
				animation: false,
				smartLineAlpha: "100",
				showlegend: "1",
				labelFont: "OpenSansRegular",
				labelFontSize: 12,
				legendItemFontSize: 11,
				showToolTip: false,
				showpercentvalues: "1",
				legendposition: "right",
				usedataplotcolorforlabels: "0",
				showTooltip: "1",
				theme: "fint",
				chartRightMargin: '100px',
				showLabels: false,
				drawCustomLegendIcon: 1,
			},
			"data": this.data.charts.ITSpendbyFunctionManagement
		};

		//For IT Spend Per User
		this.dataSourceITSpendPerUser = {
			chart: {
				animation: false,
				smartLineAlpha: "100",
				showlegend: "1",
				labelFont: "OpenSansRegular",
				labelFontSize: 16,
				legendItemFontSize: 16,
				showToolTip: false,
				legendposition: "bottom",
				usedataplotcolorforlabels: "0",
				showTooltip: "1",
				theme: "fint",
				lineThickness: "3",
				formatNumberScale: 0,
				anchorBgColor: "#03abba",
				showHoverEffect: 0, // disable zoom on mouse over
				interactiveLegend: 0, // disable hide of line
				divLineDashed: 0, // change chart background dot line to stright line
				legendItemFontColor: "#75787b",
				palettecolors: "#03abba",
				numberprefix: this.currencySymbol
			},
			categories: [{
				category: [{
					label: "2016"
				},
				{
					label: "2017"
				},
				{
					label: "2018"
				}
				]
			}],
			dataset: [{
				seriesname: "IT Spend Per User",
				"data": this.lineChartData
			}]

		};
	}

	public setProgress(amt) {

		// amt = (amt < 0) ? 0 : (amt > 1) ? 1 : amt;

		// document.getElementById("stop1007").setAttribute("offset", "1");
		// document.getElementById("stop2007").setAttribute("offset", "1");

		// document.getElementById("stop1008").setAttribute("offset", "1");
		// document.getElementById("stop2008").setAttribute("offset", "1");

		// document.getElementById("stop1009").setAttribute("offset", "1");
		// document.getElementById("stop2009").setAttribute("offset", "1");

		// document.getElementById("stop10010").setAttribute("offset", "1");
		// document.getElementById("stop20010").setAttribute("offset", "1");

		// document.getElementById("stop10011").setAttribute("offset", "1");
		// document.getElementById("stop20011").setAttribute("offset", "1");

		// document.getElementById("stop1").setAttribute("offset", this.data.itrunvschangevstransform.itRun.mean / 100 + "");
		// document.getElementById("stop2").setAttribute("offset", this.data.itrunvschangevstransform.itRun.mean / 100 + "");

		// document.getElementById("stop3").setAttribute("offset", this.data.itrunvschangevstransform.itChange.mean / 100 + "");
		// document.getElementById("stop4").setAttribute("offset", this.data.itrunvschangevstransform.itChange.mean / 100 + "");

		// document.getElementById("stop5").setAttribute("offset", this.data.itrunvschangevstransform.itTransform.mean / 100 + "");
		// document.getElementById("stop6").setAttribute("offset", this.data.itrunvschangevstransform.itTransform.mean / 100 + "");

		// document.getElementById("stop7").setAttribute("offset", this.data.itPersonnel.contractorpercent / 100 + "");
		// document.getElementById("stop8").setAttribute("offset", this.data.itPersonnel.contractorpercent / 100 + "");

		// document.getElementById("stop9").setAttribute("offset", this.data.itPersonnel.contractorpercent / 100 + "");
		// document.getElementById("stop10").setAttribute("offset", this.data.itPersonnel.contractorpercent / 100 + "");

		// document.getElementById("stop11").setAttribute("offset", this.data.userExperience.mean/100+"");
		// document.getElementById("stop12").setAttribute("offset", this.data.userExperience.mean/100+"");

		// document.getElementById("stop13").setAttribute("offset", this.data.digitalSpend.mean / 100 + "");
		// document.getElementById("stop14").setAttribute("offset", this.data.digitalSpend.mean / 100 + "");

		// document.getElementById("stop55").setAttribute("offset", "1");
		// document.getElementById("stop65").setAttribute("offset", "1");

		// document.getElementById("stop79").setAttribute("offset", this.data.itSpendOutSourced.mean / 100 + "");
		// document.getElementById("stop80").setAttribute("offset", this.data.itSpendOutSourced.mean / 100 + "");

		// document.getElementById("stop585").setAttribute("offset", "1.0");
		// document.getElementById("stop685").setAttribute("offset", "1.0");
	}

	infrawidth = 600;
	infraheight = 400;
	infratype = "pie2d";
	infradataFormat = "json";
	infradataSource = {
		chart: {
			caption: "Market Share of Web Servers",
			plottooltext: "<b>$percentValue</b> of web servers run on $label servers",
			showlegend: "1",
			showpercentvalues: "1",
			legendposition: "bottom",
			usedataplotcolorforlabels: "1",
			theme: "fusion"
		},
		data: [{
			label: "Apache",
			value: "32647479"
		},
		{
			label: "Microsoft",
			value: "22100932"
		},
		{
			label: "Zeus",
			value: "14376"
		},
		{
			label: "Other",
			value: "18674221"
		}
		]
	};

	comparePersonnel: boolean = false;
	compareHardware: boolean = false;
	compareSoftware: boolean = false;
	compareOutsourced: boolean = false;
	compareOther: boolean = false;
	compareOnshore: boolean = false;
	compareOffshore: boolean = false;
	compareAttritionMean: boolean = false;
	compareCompanyRevenue: boolean = false;
	compareInfrastructure: boolean = false;
	compareApplications: boolean = false;
	compareManagement: boolean = false;
	compareItSpendPerUser: boolean = false;
	compareItSpendOutsourced: boolean = false;
	compareCapex: boolean = false;
	compareOpex: boolean = false;
	compareItRun: boolean = false;
	compareItChange: boolean = false;
	compareItTransform: boolean = false;
	compareEmployee: boolean = false;
	compareContractor: boolean = false;
	compareEqualCompanyRevenue: boolean = false;
	compareEqualityInfrastructure: boolean = false;
	compareEqualityApplications: boolean = false;
	compareEqualityManagement: boolean = false;
	compareEqualityItSpendPerUser: boolean = false;
	compareEqualityPersonnel: boolean = false;
	compareEqualityHardware: boolean = false;
	compareEqualitySoftware: boolean = false;
	compareEqualityOutsourced: boolean = false;
	compareEqualityOther: boolean = false;
	compareEqualityItSpendOutsourced: boolean = false;
	compareEqualityCapex: boolean = false;
	compareEqualityOpex: boolean = false;
	compareEqualityItRun: boolean = false;
	compareEqualityItChange: boolean = false;
	compareEqualityItTransform: boolean = false;
	compareEqualityEmployee: boolean = false;
	compareEqualityContractor: boolean = false;
	compareEqualityOnshore: boolean = false;
	compareEqualityOffshore: boolean = false;
	compareEqualityAttritionMean: boolean = false;
	digitalSpendEquality: boolean = false;
	compareDigitalSpend: boolean = false;

	comapnyRevenueDifference: any;
	inputMyDataObj: any;

	//defaultcurrency object
	public defaultCurrency = { "key": "FE482E13-D3B6-4208-8C3C-2FD7AFBEBEA1", "value": "USD", "id": "1.0" }

	ngOnInit() {


		this.inputMyDataObj = this.getScenarioDataService.getData();

		this.currencyVar = require('currency-symbol-map');

		this.getUserLoginInfo();


		//set updated currency to industry size service
		this.industrySizeService.setCurrencyObject(this.defaultCurrency);


		this.service.getData().subscribe((data) => {



			this.data = data;

			this.showCIOData = true;

			object.setProgress(0.5);
			object.updateLineChartData();
			object.updateDrillDown();

		}, (error) => {
			//throw custom exception to global error handler
			//create error object
			let errorObj = {
				"dashboardId": "1",
				"pageName": "CIO Dashboard Landing Page",
				"errorType": "Fatal",
				"errorTitle": "Web Service Error",
				"errorDescription": error.message,
				"errorObject": error
			}

			throw errorObj;
		})


		this.industrySizeService.getCIODefinitionData().subscribe((data: any) => {

			object.definitionData = data;

		}, (error) => {
			//throw custom exception to global error handler
			//create error object
			let errorObj = {
				"dashboardId": "8",
				"pageName": "Non CIO WAN Tower Screen",
				"errorType": "Fatal",
				"errorTitle": "Web Service Error",
				"errorDescription": error.message,
				"errorObject": error
			}

			throw errorObj;
		});

		let object = this;
		let emitter: EventEmitter = object.commonService.getEventEmitter();
		emitter.on('change', function () {

			object.showDrillDownAfterCrg=true;

			object.data = object.commonService.getData().cioData;
			object.currencyCode = object.commonService.getData().selectCurrency.value;
			object.refactorVal = object.commonService.getData().selectCurrency.id;
			object.currencySymbol = object.currencyVar(this.currencyCode);

			object.setProgress(0.5);
			object.updateLineChartData();
			object.updateDrillDown();

			
			if (object.showDiv == true) {
				object.toggle();
			}

		})
		this.setProgress(this.myVal);
		this.doTimeout();
		this.updateLineChartData();
		object.updateDrillDown();

		let valTomakePositive = "0";
		this.makePositiveValue(valTomakePositive);

		
	}

	makePositiveValue(val) {
		return Math.abs(val).toFixed(2);
	}


	toggle() {
		let object = this;
		this.showDiv = true;
		this.setProgress(0.5);

		if (this.navigatedFromComparison == true) {
			this.updateScenarioDropdown();
			let refactorValue = object.cIOEnterMyDataSharedService.getData().refactorVal;
			
			let comparisionData = object.cIOEnterMyDataSharedService.getData().comparisionData;
			object.selectedScenarioForComparison.forEach((element) => {
				//3)this will map src_code and it's value format
				object.map[element.key] = element.value_format;
			  });
			  object.sourceCurrencyMap = object.map;
			  for (let data of comparisionData) {
		
				let key = object.sourceCurrencyMap[data.key];
				if (key != undefined && key != null && key != "#" && key != "%") {
				  // data.value = data.value / currentValue.id;
				  data.value = data.value * refactorValue;
				}
		
			  }
		}

		if (this.navigateFromInput == true) {
			this.updateScenarioDropdown();
			
		}
		this.updateCompareData();
		this.compareExpenditureType();

	}

	updateScenarioDropdown() {
		//get selected scenario id
		let object = this;

		//let selectedScenarioID = object.cIOEnterMyDataSharedService.getScenarioSelection();
		//object.mainframeSharedService.getData().selectedScenarioId[0];
		//object.selectedscenario = object.selectedScenarioName[selectedScenarioID];

		//call event emitter to update scenario in dropdown
		object.commonService.getEvent().emit('updatescenariodropdown');

	}

	public itSpendCondition: boolean = false;

	compareExpenditureType() {

		let object = this;

		let test = new MapSourceCodeDataValues();
		
		object.scenarioData = object.cIOEnterMyDataSharedService.getData().comparisionData;

		

		//get constant value
		this.NEGATIVE_CONST = negativeConstant.NEGATIVE_CONSTANT;
		let mapdata1 = test.mapData(object.scenarioData);
		
		object.mapdata = mapdata1;//object.replaceNullValue(mapdata1);

		

		try {

			if (mapdata1.TDD110 == this.NEGATIVE_CONST && mapdata1.TDB100 == this.NEGATIVE_CONST) {
				object.ITSpendRevMean = this.NEGATIVE_CONST;
			} else {
				object.ITSpendRevMean = eval("object.mapdata.TDD110 / object.mapdata.TDB100") * 100;
				object.ITSpendRevMean = Number.isNaN(object.ITSpendRevMean) ? this.NEGATIVE_CONST : object.ITSpendRevMean;
			}

			
			if (mapdata1.TDD150 == this.NEGATIVE_CONST && mapdata1.TDD160 == this.NEGATIVE_CONST && mapdata1.TDD170 == this.NEGATIVE_CONST) {
				object.Infra = this.NEGATIVE_CONST;
				object.App = this.NEGATIVE_CONST;
				object.Management = this.NEGATIVE_CONST;
			} else {
				object.Infra = eval("object.mapdata.TDD150 / (object.mapdata.TDD150 + object.mapdata.TDD160 + object.mapdata.TDD170)") * 100;
				object.Infra = Number.isNaN(object.Infra) ? this.NEGATIVE_CONST : object.Infra;
				object.App = eval("object.mapdata.TDD160 / (object.mapdata.TDD150 + object.mapdata.TDD160 + object.mapdata.TDD170)") * 100;
				object.App = Number.isNaN(object.App) ? this.NEGATIVE_CONST : object.App;
				object.Management = eval("object.mapdata.TDD170 / (object.mapdata.TDD150 + object.mapdata.TDD160 + object.mapdata.TDD170)") * 100;
				object.Management = Number.isNaN(object.Management) ? this.NEGATIVE_CONST : object.Management;
			}

			if (mapdata1.TDD110 == this.NEGATIVE_CONST && mapdata1.TDC100 == this.NEGATIVE_CONST) {
				object.ITSpendPerUserMeanCY = this.NEGATIVE_CONST;
			} else {
				object.ITSpendPerUserMeanCY = eval("(object.mapdata.TDD110 * 1000000)/ object.mapdata.TDC100");
				object.ITSpendPerUserMeanCY = Number.isNaN(object.ITSpendPerUserMeanCY) ? this.NEGATIVE_CONST : object.ITSpendPerUserMeanCY;

			}

			
			//IT Spend By Expenditure Type contains personnel, h/w, s/w, outsourced, other. Total of this kpi should be 100%
			//for rendering it should display the entered value for specific kpi
			object.ITSpendPersonnel = Number.isNaN(object.mapdata.TDD350) ? this.NEGATIVE_CONST : object.mapdata.TDD350;
			object.ITSpendHardware = Number.isNaN(object.mapdata.TDD360) ? this.NEGATIVE_CONST : object.mapdata.TDD360;
			object.ITSpendSoftware = Number.isNaN(object.mapdata.TDD370) ? this.NEGATIVE_CONST : object.mapdata.TDD370;
			object.ItSpendOutsourced = Number.isNaN(object.mapdata.TDD380) ? this.NEGATIVE_CONST : object.mapdata.TDD380;
			object.ITSpendOther = Number.isNaN(object.mapdata.TDD390) ? this.NEGATIVE_CONST : object.mapdata.TDD390;

			object.OutsourcedMean = Number.isNaN(object.mapdata.TDD380) ? this.NEGATIVE_CONST : object.mapdata.TDD380;


			//CAPEX vs. OPEX  contains capex, opex. Total of this kpi should be 100%
			object.CapExMean = Number.isNaN(object.mapdata.TDD450) ? this.NEGATIVE_CONST : object.mapdata.TDD450;

			object.OpExMean = Number.isNaN(object.mapdata.TDD460) ? this.NEGATIVE_CONST : object.mapdata.TDD460;


			//IT Run vs. IT Change vs. IT Transform  contains run,change,transform. Total of this kpi should be 100%
			//for rendering it should display the entered value for specific kpi
			object.RunMean = Number.isNaN(object.mapdata.TDD400) ? this.NEGATIVE_CONST : object.mapdata.TDD400;
			object.ChangeMean = Number.isNaN(object.mapdata.TDD410) ? this.NEGATIVE_CONST : object.mapdata.TDD410;
			object.TransformMean = Number.isNaN(object.mapdata.TDD420) ? this.NEGATIVE_CONST : object.mapdata.TDD420;

			if (mapdata1.TDC200 == this.NEGATIVE_CONST && mapdata1.TDC210 == this.NEGATIVE_CONST && mapdata1.TDB170 == this.NEGATIVE_CONST) {
				object.FTEPercent = this.NEGATIVE_CONST;
			} else {
				object.FTEPercent = eval("(object.mapdata.TDC200 + object.mapdata.TDC210) / object.mapdata.TDB170") * 100;
				// object.FTEPercent = Number.isNaN(object.FTEPercent) ? this.NEGATIVE_CONST : object.FTEPercent;
			}


			if (mapdata1.TDC210 == this.NEGATIVE_CONST && mapdata1.TDC200 == this.NEGATIVE_CONST) {
				object.contractorPercent = this.NEGATIVE_CONST;
			} else {
				object.contractorPercent = eval("object.mapdata.TDC210 /  (object.mapdata.TDC200 + object.mapdata.TDC210)") * 100;
				object.contractorPercent = Number.isNaN(object.contractorPercent) ? this.NEGATIVE_CONST : object.contractorPercent;
			}


			object.attritionMean = object.mapdata.TDC215;
			object.attritionMean = Number.isNaN(object.attritionMean) ? this.NEGATIVE_CONST : object.attritionMean;

			if (mapdata1.TDC241 == this.NEGATIVE_CONST && mapdata1.TDC240 == this.NEGATIVE_CONST && mapdata1.TDC251 == this.NEGATIVE_CONST && mapdata1.TDC250 == this.NEGATIVE_CONST && mapdata1.TDC221 == this.NEGATIVE_CONST && mapdata1.TDC220 == this.NEGATIVE_CONST && mapdata1.TDC231 == this.NEGATIVE_CONST && mapdata1.TDC230 == this.NEGATIVE_CONST && mapdata1.TDC261 == this.NEGATIVE_CONST && mapdata1.TDC260 == this.NEGATIVE_CONST && mapdata1.TDC271 == this.NEGATIVE_CONST && mapdata1.TDC270) {
				object.onshore = this.NEGATIVE_CONST;
				object.offshore = this.NEGATIVE_CONST;
			} else {
				//multiplying calculated value by 100 for converting calculated value into percentage
				object.onshore = (100 - eval("( object.mapdata.TDC241 / 100 * object.mapdata.TDC240 + object.mapdata.TDC251 / 100  * object.mapdata.TDC250 + object.mapdata.TDC221 / 100 * object.mapdata.TDC220 + object.mapdata.TDC231 / 100 * object.mapdata.TDC230 + object.mapdata.TDC261 / 100 * object.mapdata.TDC260 + object.mapdata.TDC271 / 100 * object.mapdata.TDC270 ) / ( object.mapdata.TDC240 + object.mapdata.TDC250 + object.mapdata.TDC220 + object.mapdata.TDC230 + object.mapdata.TDC260 + object.mapdata.TDC270 )") * 100);
				object.onshore = Number.isNaN(object.onshore) ? this.NEGATIVE_CONST : object.onshore;
				object.offshore = eval("(object.mapdata.TDC241 / 100 * object.mapdata.TDC240 + object.mapdata.TDC251 / 100 * object.mapdata.TDC250 + object.mapdata.TDC221 / 100 * object.mapdata.TDC220 + object.mapdata.TDC231 / 100 * object.mapdata.TDC230 + object.mapdata.TDC261 / 100 * object.mapdata.TDC260 + object.mapdata.TDC271 / 100 * object.mapdata.TDC270 ) / ( object.mapdata.TDC240 + object.mapdata.TDC250 + object.mapdata.TDC220 + object.mapdata.TDC230 + object.mapdata.TDC260 + object.mapdata.TDC270 )") * 100;
				object.offshore = Number.isNaN(object.offshore) ? this.NEGATIVE_CONST : object.offshore;
			}

			if (mapdata1.TDB195 == this.NEGATIVE_CONST && mapdata1.TDD110 == this.NEGATIVE_CONST) {
				object.digitalspend = this.NEGATIVE_CONST;
			} else {
				//digital spend
				object.digitalspend = (Number.isNaN(eval("object.mapdata.TDB195 / object.mapdata.TDD110") * 100) ? this.NEGATIVE_CONST : (eval("object.mapdata.TDB195 / object.mapdata.TDD110") * 100));
			}
			

			
			//user experience index
			object.userExpIndexMean = Number.isNaN(object.mapdata.TDD500) ? this.NEGATIVE_CONST : object.mapdata.TDD500;

		}
		catch (error) {
			
			let errorObj = {
				"dashboardId": "1",
				"pageName": "CIO Dashboard Landing Page",
				"errorType": "warn",
				"errorTitle": error.status,
				"errorDescription": error.message,
				"errorObject": error
			}

			throw errorObj;
		}

		try {

			this.enterMyData.opexmean = object.OpExMean;
			this.enterMyData.capexmean = object.CapExMean;

			this.enterMyData.management = object.Management;
			this.enterMyData.applications = object.App;


			this.enterMyData.capexmean = object.CapExMean;
			this.enterMyData.opexmean = object.OpExMean;
			this.enterMyData.management = object.Management;
			this.enterMyData.applications = object.App;

			this.enterMyData.itTransform = object.TransformMean;
			this.enterMyData.itspendrev = object.ITSpendRevMean;

			if (this.enterMyData.itspendrev == 1 / 0) {
				this.enterMyData.itspendrev = 0;
			}

			this.enterMyData.itSpendPerUser = object.ITSpendPerUserMeanCY;


			if (this.enterMyData.itSpendPerUser == 1 / 0) {
				this.enterMyData.itSpendPerUser = 0;
			}
			this.enterMyData.itSpendOutSourced = object.ItSpendOutsourced;
			this.enterMyData.itSpendByExpendituresoftware = object.ITSpendSoftware;
			this.enterMyData.itSpendByExpenditurepersonnel = object.ITSpendPersonnel;
			this.enterMyData.itSpendByExpenditureoutsourced = object.ItSpendOutsourced;
			this.enterMyData.itSpendByExpenditurehardware = object.ITSpendHardware;
			this.enterMyData.itSpendByExpenditureother = object.ITSpendOther;



			this.enterMyData.infrastructure = object.Infra;
			this.enterMyData.digitalSpend = object.digitalspend;
			this.enterMyData.itRun = object.RunMean;
			this.enterMyData.itChange = object.ChangeMean;
			this.enterMyData.itTransform = object.TransformMean;

			this.enterMyData.itPersonnelFtePercent = object.FTEPercent;
			this.enterMyData.itPersonnelContractorPercent = object.contractorPercent;
			this.enterMyData.itPersonnelOffshorePercent = object.offshore;
			this.enterMyData.itPersonnelOnshorePercent = object.onshore;
			this.enterMyData.itPersonnelAttritionMean = object.attritionMean;

		}
		catch (error) {
			
			let errorObj = {
				"dashboardId": "1",
				"pageName": "CIO Dashboard Landing Page",
				"errorType": "warn",
				"errorTitle": error.status,
				"errorDescription": error.message,
				"errorObject": error
			}

			throw errorObj;
		}

		try {

			if (this.data.itSpendByExpenditure.personnel > object.ITSpendPersonnel) {
				this.comparePersonnel = true;
			}

			if (this.data.itSpendByExpenditure.hardware > this.enterMyData.itSpendByExpenditurehardware) {
				this.compareHardware = true;
			}

			if (this.data.itSpendByExpenditure.software > this.enterMyData.itSpendByExpendituresoftware) {
				this.compareSoftware = true;
			}

			if (this.data.itSpendByExpenditure.outsourced > this.enterMyData.itSpendByExpenditureoutsourced) {
				this.compareOutsourced = true;
			}

			if (this.data.itSpendByExpenditure.other > this.enterMyData.itSpendByExpenditureother) {
				this.compareOther = true;
			}

			if (this.data.itPersonnel.onshorepercent > this.enterMyData.itPersonnelOnshorePercent) {
				this.compareOnshore = true;
			}

			if (this.data.itPersonnel.onshorepercent > this.enterMyData.itPersonnelOnshorePercent) {
				this.compareOnshore = true;
			}

			if (this.data.itPersonnel.offshorepercent > this.enterMyData.itPersonnelOffshorePercent) {
				this.compareOffshore = true;
			}

			if (this.data.itPersonnel.attritionmean > this.enterMyData.itPersonnelAttritionMean) {
				this.compareAttritionMean = true;
			}

			if (this.data.itspendrev.infrastructure.value > this.enterMyData.infrastructure) {
				this.compareInfrastructure = true;
			}

			if (this.data.itspendrev.applications.value > this.enterMyData.applications) {
				this.compareApplications = true;
			}

			if (this.data.itspendrev.management.value > this.enterMyData.management) {
				this.compareManagement = true;
			}

			if ((this.enterMyData.itSpendByExpenditureother > 0) || (this.enterMyData.itSpendByExpenditureoutsourced > 0) || (this.enterMyData.itSpendByExpendituresoftware > 0) || (this.enterMyData.itSpendByExpenditurehardware > 0) || (this.enterMyData.itSpendByExpenditurepersonnel > 0)) {
				this.itSpendCondition = true;

			}
			else {
				this.itSpendCondition = false;
			}
			// if (this.data.itspendrev.mean > this.enterMyData.itspendrev) {
			// 	this.compareCompanyRevenue = true;
			// 	document.getElementById("comapanyRevenueSVG").setAttribute('transform', 'rotate(90) rotate(90)');
			// }

			// if ((this.data.itSpendPerUser.mean) > this.enterMyData.itSpendPerUser) {
			// 	this.compareItSpendPerUser = true;
			// 	document.getElementById("itSpendPerUserSVG").setAttribute('transform', 'rotate(90) rotate(90)');
			// }

			// if (this.data.itSpendOutSourced.mean > this.enterMyData.itSpendOutSourced) {
			// 	this.compareItSpendOutsourced = true;
			// 	document.getElementById("itSpendOutSourcedSVG").setAttribute('transform', 'rotate(90) rotate(90)');
			// }

			// if (this.data.capexVsOpex.capexmean > this.enterMyData.capexmean) {
			// 	this.compareCapex = true;
			// 	document.getElementById("capexdSVG").setAttribute('transform', 'rotate(90) rotate(90)');
			// }

			// if (this.data.capexVsOpex.opexmean > this.enterMyData.opexmean) {
			// 	this.compareOpex = true;
			// 	document.getElementById("opexdSVG").setAttribute('transform', 'rotate(90) rotate(90)');
			// }

			// if (this.data.itrunvschangevstransform.itRun.mean > this.enterMyData.itRun) {
			// 	this.compareItRun = true;
			// 	document.getElementById("itRunSVG").setAttribute('transform', 'rotate(90) rotate(90)');
			// }

			// if (this.data.itrunvschangevstransform.itChange.mean > this.enterMyData.itChange) {
			// 	this.compareItChange = true;
			// 	document.getElementById("itChangeSVG").setAttribute('transform', 'rotate(90) rotate(90)');
			// }

			// if (this.data.itrunvschangevstransform.itTransform.mean > this.enterMyData.itTransform) {
			// 	this.compareItTransform = true;
			// 	document.getElementById("itTransformSVG").setAttribute('transform', 'rotate(90) rotate(90)');
			// }

			// if (this.data.itPersonnel.ftePercent > this.enterMyData.itPersonnelFtePercent) {
			// 	this.compareEmployee = true;
			// 	document.getElementById("itFtePercentSVG").setAttribute('transform', 'rotate(90) rotate(90)');
			// }

			// if (this.data.itPersonnel.contractorpercent > this.enterMyData.itPersonnelContractorPercent) {
			// 	this.compareContractor = true;
			// 	document.getElementById("itContractorPercentSVG").setAttribute('transform', 'rotate(90) rotate(90)');
			// }

			// // this is added
			// if (this.enterMyData.digitalSpend < this.data.digitalSpend.mean) {
			// 	this.compareContractor = true;
			// 	document.getElementById("digitalSpendSVG").setAttribute('transform', 'rotate(90) rotate(90)');
			// }


			let userITSPendRev = Number(this.data.itspendrev.mean).toFixed(1);
			let enterITSPendRev = Number(this.enterMyData.itspendrev).toFixed(1);


			//if (this.data.itspendrev.mean == this.enterMyData.itspendrev) {
			if (userITSPendRev == enterITSPendRev) {
				this.compareEqualCompanyRevenue = true;

			}
			else {
				this.compareEqualCompanyRevenue = false;
			}


			let userInfra = Math.round(this.data.itspendrev.infrastructure.value);
			let enterInfra = Math.round(this.enterMyData.infrastructure);

			//if (this.data.itspendrev.infrastructure.value == this.enterMyData.infrastructure) {
			if (userInfra == enterInfra) {
				this.compareEqualityInfrastructure = true;

			}
			else {
				this.compareEqualityInfrastructure = false;
			}


			let userApplication = Math.round(this.data.itspendrev.applications.value);
			let enterApplication = Math.round(this.enterMyData.applications);

			//if (this.data.itspendrev.applications.value == this.enterMyData.applications) {
			if (userApplication == enterApplication) {
				this.compareEqualityApplications = true;

			}
			else {
				this.compareEqualityApplications = false;
			}


			let userManagement = Math.round(this.data.itspendrev.management.value);
			let enterManagement = Math.round(this.enterMyData.management);


			//if (this.data.itspendrev.management.value == this.enterMyData.management) {
			if (userManagement == enterManagement) {
				this.compareEqualityManagement = true;

			}
			else {
				this.compareEqualityManagement = false;
			}


			let userUserSpend = Math.round(this.data.itSpendPerUser.mean * this.refactorVal);
			let enterUserSpend = Math.round(this.enterMyData.itSpendPerUser);

			if (userUserSpend == enterUserSpend) {
				//if (this.data.itSpendPerUser.mean == this.enterMyData.itSpendPerUser) {
				this.compareEqualityItSpendPerUser = true;

			}
			else {
				this.compareEqualityItSpendPerUser = false;
			}


			let userPersonnel = Math.round(this.data.itSpendByExpenditure.personnel);
			let enterPersonnel = Math.round(this.enterMyData.itSpendByExpenditurepersonnel);

			if (userPersonnel == enterPersonnel) {
				//if (this.data.itSpendByExpenditure.personnel == this.enterMyData.itSpendByExpenditurepersonnel) {
				this.compareEqualityPersonnel = true;

			}
			else {
				this.compareEqualityPersonnel = false;
			}


			let userHardware = Math.round(this.data.itSpendByExpenditure.hardware);
			let enterHardware = Math.round(this.enterMyData.itSpendByExpenditurehardware);

			if (userHardware == enterHardware) {
				//if (this.data.itSpendByExpenditure.hardware == this.enterMyData.itSpendByExpenditurehardware) {
				this.compareEqualityHardware = true;

			}
			else {
				this.compareEqualityHardware = false;
			}

			let userSoftware = Math.round(this.data.itSpendByExpenditure.software);
			let enterSoftware = Math.round(this.enterMyData.itSpendByExpendituresoftware);


			//if (this.data.itSpendByExpenditure.software == this.enterMyData.itSpendByExpendituresoftware) {
			if (userSoftware == enterSoftware) {
				this.compareEqualitySoftware = true;

			}
			else {
				this.compareEqualitySoftware = false;
			}

			let userOutsource = Math.round(this.data.itSpendByExpenditure.outsourced);
			let enterOutsource = Math.round(this.enterMyData.itSpendByExpenditureoutsourced);


			if (userOutsource == enterOutsource) {
				//if (this.data.itSpendByExpenditure.outsourced == this.enterMyData.itSpendByExpenditureoutsourced) {
				this.compareEqualityOutsourced = true;

			}
			else {
				this.compareEqualityOutsourced = false;
			}

			let userOther = Math.round(this.data.itSpendByExpenditure.other);
			let enterOther = Math.round(this.enterMyData.itSpendByExpenditureother);

			if (userOther == enterOther) {
				//if (this.data.itSpendByExpenditure.other == this.enterMyData.itSpendByExpenditureother) {
				this.compareEqualityOther = true;

			}
			else {
				this.compareEqualityOther = false;
			}

			let userSpendOutSourced = Math.round(this.data.itSpendOutSourced.mean);
			let enterSpendOutSourced = Math.round(this.enterMyData.itSpendOutSourced);

			if (userSpendOutSourced == enterSpendOutSourced) {
				//if (this.data.itSpendOutSourced.mean == this.enterMyData.itSpendOutSourced) {
				this.compareEqualityItSpendOutsourced = true;

			}
			else {
				this.compareEqualityItSpendOutsourced = false;
			}

			let userCapex = Math.round(this.data.capexVsOpex.capexmean);
			let enterCapex = Math.round(this.enterMyData.capexmean);

			if (userCapex == enterCapex) {
				//if (this.data.capexVsOpex.capexmean == this.enterMyData.capexmean) {
				this.compareEqualityCapex = true;

			}
			else {
				this.compareEqualityCapex = false;
			}

			let userOapex = Math.round(this.data.capexVsOpex.opexmean);
			let enterOapex = Math.round(this.enterMyData.opexmean);

			if (userOapex == enterOapex) {
				//if (this.data.capexVsOpex.opexmean == this.enterMyData.opexmean) {
				this.compareEqualityOpex = true;

			}
			else {
				this.compareEqualityOpex = false;
			}

			let userRun = Math.round(this.data.itrunvschangevstransform.itRun.mean);
			let enterRun = Math.round(this.enterMyData.itRun);

			if (userRun == enterRun) {
				//if (this.data.itrunvschangevstransform.itRun.mean == this.enterMyData.itRun) {
				this.compareEqualityItRun = true;

			}
			else {
				this.compareEqualityItRun = false;
			}


			let userChange = Math.round(this.data.itrunvschangevstransform.itChange.mean);
			let enterChange = Math.round(this.enterMyData.itChange);


			if (userChange == enterChange) {
				//if (this.data.itrunvschangevstransform.itChange.mean == this.enterMyData.itChange) {
				this.compareEqualityItChange = true;

			}
			else {
				this.compareEqualityItChange = false;
			}

			let userTransform = Math.round(this.data.itrunvschangevstransform.itTransform.mean);
			let enterTransform = Math.round(this.enterMyData.itTransform);

			if (userTransform == enterTransform) {
				//if (this.data.itrunvschangevstransform.itTransform.mean == this.enterMyData.itTransform) {
				this.compareEqualityItTransform = true;
			}
			else {
				this.compareEqualityItTransform = false;
			}


			let userFTEPercent = Math.round(this.data.itPersonnel.ftePercent);
			let enterFTEPercent = Math.round(this.enterMyData.itPersonnelFtePercent);

			if (userFTEPercent == enterFTEPercent) {
				//if (this.data.itPersonnel.ftePercent == this.enterMyData.itPersonnelFtePercent) {
				this.compareEqualityEmployee = true;

			}
			else {
				this.compareEqualityEmployee = false;
			}


			let userContract = Math.round(this.data.itPersonnel.contractorpercent);
			let enterContract = Math.round(this.enterMyData.itPersonnelContractorPercent);


			if (userContract == enterContract) {
				//if (this.data.itPersonnel.contractorpercent == this.enterMyData.itPersonnelContractorPercent) {
				this.compareEqualityContractor = true;

			}
			else {
				this.compareEqualityContractor = false;
			}

			let userOnshore = Math.round(this.data.itPersonnel.onshorepercent);
			let enterOnshore = Math.round(this.enterMyData.itPersonnelOnshorePercent);

			if (userOnshore == enterOnshore) {
				//if (this.data.itPersonnel.onshorepercent == this.enterMyData.itPersonnelOnshorePercent) {
				this.compareEqualityOnshore = true;

			}
			else {
				this.compareEqualityOnshore = false;
			}

			let userOffshore = Math.round(this.data.itPersonnel.offshorepercent);
			let enterOffshore = Math.round(this.enterMyData.itPersonnelOffshorePercent);

			if (userOffshore == enterOffshore) {
				//if (this.data.itPersonnel.offshorepercent == this.enterMyData.itPersonnelOffshorePercent) {
				this.compareEqualityOffshore = true;

			}
			else {
				this.compareEqualityOffshore = false;
			}

			let userAttritation = Math.round(this.data.itPersonnel.attritionmean);
			let enterAttritation = Math.round(this.enterMyData.itPersonnelAttritionMean);


			if (userAttritation == enterAttritation) {
				//if (this.data.itPersonnel.attritionmean == this.enterMyData.itPersonnelAttritionMean) {
				this.compareEqualityAttritionMean = true;

			}
			else {
				this.compareEqualityAttritionMean = false;
			}

			let userDigitalSpend = Math.round(this.enterMyData.digitalSpend);
			let enterDigitalSpend = Math.round(this.data.digitalSpend.mean);

			if (userDigitalSpend == enterDigitalSpend) {
				//if (this.enterMyData.digitalSpend == this.data.digitalSpend.mean) {
				this.digitalSpendEquality = true;
			}
			else {
				this.digitalSpendEquality = false;
			}

		}
		catch (error) {
			
			let errorObj = {
				"dashboardId": "1",
				"pageName": "CIO Dashboard Landing Page",
				"errorType": "error",
				"errorTitle": error.status,
				"errorDescription": error.message,
				"errorObject": error
			}

			throw errorObj;
		}
		
	}

	public updateLineChartData() {
		//update line chart objects

		this.lineChartData = this.data.charts.ITSpendperUserCurrentYearMean.map(obj => {
			let rObj = {};
			rObj["label"] = obj.label;
			rObj["value"] = Number(obj.value) * this.refactorVal;
			return rObj;
		}, (error) => {
			//throw custom exception to global error handler
			//create error object
			let errorObj = {
				"dashboardId": "1",
				"pageName": "CIO Dashboard Landing Page",
				"errorType": "Fatal",
				"errorTitle": error.status,
				"errorDescription": error.message,
				"errorObject": error
			}

			throw errorObj;
		}
		);

		//change currency symbol
		this.currencySymbol = this.currencyVar(this.currencyCode);

	}
	//this will be invoked when user willl click on save and compare from input my data
	updateCompareData() {
		let object = this;
		let currency = object.cIOEnterMyDataSharedService.getData().currency;
		//now we are sending selected currency from input my data to header 
		object.commonService.setData(currency);
		
		//emitting it
		object.conversionCurrency = object.cIOEnterMyDataSharedService.getData().currency;
		object.commonService.getEvent().emit('setCurrency');
	}

	convertCompareData(prevCurrencyKey, currenctCurrencyKey) {
		let object = this;
		let prevCurrencyObject = object.getCurrency(prevCurrencyKey);
		let currenctCurrencyObject = object.getCurrency(currenctCurrencyKey);

		object.convertValue(prevCurrencyObject, currenctCurrencyObject);
	
	}


	convertValue(currentValue, targetValue) {

		let object = this;
		

		let comparisionData = object.cIOEnterMyDataSharedService.getData().comparisionData;

		

		object.selectedScenarioForComparison.forEach((element) => {
			//3)this will map src_code and it's value format
			object.map[element.key] = element.value_format;
		  });
		  object.sourceCurrencyMap = object.map;
		try {
			for (let data of comparisionData) {
				if (data.value != -9999) {
					let key = object.sourceCurrencyMap[data.key];
					if (key != undefined && key != null && key != "#" && key != "%") {
						data.value = data.value / currentValue.id;
						data.value = data.value * targetValue.id;
					}
				}


			}

		} catch (error) {
			
		}
		



	}


	getCurrency(currencyKey) {
		let object = this;
		let currencyObject = null;
		object.data.currency.forEach((element) => {
			if (element.key == currencyKey) {
				currencyObject = element;
			}
		});
		return currencyObject;
	}


	nonEditableElm = ["TDC215", "TDD400", "TDD410", "TDD420", "TDD450", "TDD460", "TDD350", "TDD360", "TDD370", "TDD380", "TDD390", "TDD500"];

	replaceNullValue(sampleObj: any) {
		let obj = {};

		var requestedArrayObj = Object.keys(sampleObj).map(key => ({ key: key, value: sampleObj[key] }));

		requestedArrayObj.forEach(element => {
			if (this.nonEditableElm.includes(element.key)) {
				//do nothing
			} else if (element.value == this.NEGATIVE_CONST) {
				element.value = 0;
			}
		});


		for (let element of requestedArrayObj) {
			obj[element.key] = element.value;
		}
		
		return obj;

	}

	//this way we are saving mem leaks and preventing further bugs :)
	ngOnDestroy(): void {
		let object = this;
		let emitter = object.commonService.getEvent();
		emitter.removeAllListeners('convertCurrency');
	}

	getScenarioDataById(selectedscenario) {
		let object = this;
		// //this is done becuz when i reset form,i will lose selectedScenrio Id
		let scenarioID = selectedscenario.id;

		// //this means that there is no present or this function is first hit to server
		try {
			//   object.resetAll();
		} catch (error) {
			//throw custom exception to global error handler
			//create error object
			let errorObj = {
				"dashboardId": "1",
				"pageName": "CIO Tower Input My Data Screen",
				"errorType": "warn",
				"errorTitle": "Data Error",
				"errorDescription": error.message,
				"errorObject": error
			}

			throw errorObj;
		}
		//object.selectedScanrio = scenarioID;//after reset again reseting selectedScenario


		if (scenarioID == 0) {
			//object.scenarioNameText="";
			return;
		}
		else if (scenarioID == -9999) {
			//if dummy scenario is selected hide the comparison section
			this.showDiv = false;
			//this.selectedregion ="Grand Total";
			//this.defaultregion="Grand Total";

			//default currency
			let currency = "FE482E13-D3B6-4208-8C3C-2FD7AFBEBEA1";//USD key

			object.commonService.getEvent().emit('resetcurrency');

			//reset currency

			//get currency data
			//object.data.currency.forEach((element) => {

			// if (element.key == currency) {
			//   this.selectedcurrency = element;
			//   this.currencyCode = element.value;
			//   this.conversionCurrency = element.key;
			//   this.refactorVal = element.id;
			//   this.updateLineChartData();
			//   this.updateDrillDown();
			// }
			//});


		}
		else//get comparison data for scenario
		{
			let requestedParam = {
				"userID": object.sessionId,
				"dashboardId": "1",
				"scenarioId": []
			}

			object.generateScenarioService.getSavedScenarioDataToPopulate("1", object.sessionId, scenarioID).subscribe((response) => {

				let object = this;


				object.selectedScenarioForComparison = [];

				object.scenarioObj = response;
				
				//logic to prepare a scenarion object for comparison

				for (let cnt = 0; cnt < object.scenarioObj.CompanyFinancialInformationGeneralTab.NA.length; cnt++) {
					let t1: any = {};
					t1.key = object.scenarioObj.CompanyFinancialInformationGeneralTab.NA[cnt].src_code;
					
					t1.value = object.scenarioObj.CompanyFinancialInformationGeneralTab.NA[cnt].src_code_value;
					//once save note functionality done append value of each src code note here
					t1.note = object.scenarioObj.CompanyFinancialInformationGeneralTab.NA[cnt].notes;
					t1.value_format = object.scenarioObj.CompanyFinancialInformationGeneralTab.NA[cnt].value_format;

					object.selectedScenarioForComparison.push(t1);
				}

				for (let cnt = 0; cnt < object.scenarioObj['ITOperationsHeadcount&Locations'].NA.length; cnt++) {
					let t1: any = {};
					t1.key = object.scenarioObj['ITOperationsHeadcount&Locations'].NA[cnt].src_code;
					
					t1.value = object.scenarioObj['ITOperationsHeadcount&Locations'].NA[cnt].src_code_value;
					//once save note functionality done append value of each src code note here
					t1.note = object.scenarioObj['ITOperationsHeadcount&Locations'].NA[cnt].notes;
					t1.value_format = object.scenarioObj['ITOperationsHeadcount&Locations'].NA[cnt].value_format;

					object.selectedScenarioForComparison.push(t1);
				}

				for (let cnt = 0; cnt < object.scenarioObj['ITOperationsHeadcount&Locations']['Users&Locations'].length; cnt++) {
					let t1: any = {};
					t1.key = object.scenarioObj['ITOperationsHeadcount&Locations']['Users&Locations'][cnt].src_code;
					
					t1.value = object.scenarioObj['ITOperationsHeadcount&Locations']['Users&Locations'][cnt].src_code_value;
					//once save note functionality done append value of each src code note here
					t1.note = object.scenarioObj['ITOperationsHeadcount&Locations']['Users&Locations'][cnt].notes;

					t1.value_format = object.scenarioObj['ITOperationsHeadcount&Locations']['Users&Locations'][cnt].value_format;
					object.selectedScenarioForComparison.push(t1);
				}

				for (let cnt = 0; cnt < object.scenarioObj['ITOperationsHeadcount&Locations'].HeadcountBreakdown.length; cnt++) {
					let t1: any = {};
					t1.key = object.scenarioObj['ITOperationsHeadcount&Locations'].HeadcountBreakdown[cnt].src_code;
					
					t1.value = object.scenarioObj['ITOperationsHeadcount&Locations'].HeadcountBreakdown[cnt].src_code_value;
					//once save note functionality done append value of each src code note here
					t1.note = object.scenarioObj['ITOperationsHeadcount&Locations'].HeadcountBreakdown[cnt].notes;
					// t1.value_format = object.scenarioObj['ITOperationsHeadcount&Locations'].HeadcountBreakdown[cnt].value_format;

					object.selectedScenarioForComparison.push(t1);
				}

				for (let cnt = 0; cnt < object.scenarioObj['ITOperationsHeadcount&Locations'].TotalHeadcount.length; cnt++) {
					let t1: any = {};
					t1.key = object.scenarioObj['ITOperationsHeadcount&Locations'].TotalHeadcount[cnt].src_code;
					
					t1.value = object.scenarioObj['ITOperationsHeadcount&Locations'].TotalHeadcount[cnt].src_code_value;
					//once save note functionality done append value of each src code note here
					t1.note = object.scenarioObj['ITOperationsHeadcount&Locations'].TotalHeadcount[cnt].notes;
					t1.value_format = object.scenarioObj['ITOperationsHeadcount&Locations'].TotalHeadcount[cnt].value_format;

					object.selectedScenarioForComparison.push(t1);
				}

				for (let cnt = 0; cnt < object.scenarioObj.ITOperationsSpending.CapitalvsOperational.length; cnt++) {
					let t1: any = {};
					t1.key = object.scenarioObj.ITOperationsSpending.CapitalvsOperational[cnt].src_code;
					
					t1.value = object.scenarioObj.ITOperationsSpending.CapitalvsOperational[cnt].src_code_value;
					//once save note functionality done append value of each src code note here
					t1.note = object.scenarioObj.ITOperationsSpending.CapitalvsOperational[cnt].notes;

					t1.value_format = object.scenarioObj.ITOperationsSpending.CapitalvsOperational[cnt].value_format;
					object.selectedScenarioForComparison.push(t1);
				}


				for (let cnt = 0; cnt < object.scenarioObj.ITOperationsSpending.ITFinancialBreakdownbyTower.length; cnt++) {
					let t1: any = {};
					t1.key = object.scenarioObj.ITOperationsSpending.ITFinancialBreakdownbyTower[cnt].src_code;
					
					t1.value = object.scenarioObj.ITOperationsSpending.ITFinancialBreakdownbyTower[cnt].src_code_value;
					//once save note functionality done append value of each src code note here
					t1.note = object.scenarioObj.ITOperationsSpending.ITFinancialBreakdownbyTower[cnt].notes;
					t1.value_format = object.scenarioObj.ITOperationsSpending.ITFinancialBreakdownbyTower[cnt].value_format;

					object.selectedScenarioForComparison.push(t1);
				}

				for (let cnt = 0; cnt < object.scenarioObj.ITOperationsSpending.ITFinancialData.length; cnt++) {
					let t1: any = {};
					t1.key = object.scenarioObj.ITOperationsSpending.ITFinancialData[cnt].src_code;
					
					t1.value = object.scenarioObj.ITOperationsSpending.ITFinancialData[cnt].src_code_value;
					//once save note functionality done append value of each src code note here
					t1.note = object.scenarioObj.ITOperationsSpending.ITFinancialData[cnt].notes;
					t1.value_format = object.scenarioObj.ITOperationsSpending.ITFinancialData[cnt].value_format;

					object.selectedScenarioForComparison.push(t1);
				}

				for (let cnt = 0; cnt < object.scenarioObj.ITOperationsSpending.ITFinancialDataBreakdown.length; cnt++) {
					let t1: any = {};
					t1.key = object.scenarioObj.ITOperationsSpending.ITFinancialDataBreakdown[cnt].src_code;
					
					t1.value = object.scenarioObj.ITOperationsSpending.ITFinancialDataBreakdown[cnt].src_code_value;
					//once save note functionality done append value of each src code note here
					t1.note = object.scenarioObj.ITOperationsSpending.ITFinancialDataBreakdown[cnt].notes;
					t1.value_format = object.scenarioObj.ITOperationsSpending.ITFinancialDataBreakdown[cnt].value_format;

					object.selectedScenarioForComparison.push(t1);
				}

				for (let cnt = 0; cnt < object.scenarioObj.ITOperationsSpending.ITSpendingType.length; cnt++) {
					let t1: any = {};
					t1.key = object.scenarioObj.ITOperationsSpending.ITSpendingType[cnt].src_code;
					
					t1.value = object.scenarioObj.ITOperationsSpending.ITSpendingType[cnt].src_code_value;
					//once save note functionality done append value of each src code note here
					t1.note = object.scenarioObj.ITOperationsSpending.ITSpendingType[cnt].notes;
					t1.value_format = object.scenarioObj.ITOperationsSpending.ITSpendingType[cnt].value_format;

					object.selectedScenarioForComparison.push(t1);
				}

				for (let cnt = 0; cnt < object.scenarioObj.ITOperationsSpending.OutsourcedCosts.length; cnt++) {
					let t1: any = {};
					t1.key = object.scenarioObj.ITOperationsSpending.OutsourcedCosts[cnt].src_code;
					
					t1.value = object.scenarioObj.ITOperationsSpending.OutsourcedCosts[cnt].src_code_value;
					//once save note functionality done append value of each src code note here
					t1.note = object.scenarioObj.ITOperationsSpending.OutsourcedCosts[cnt].notes;
					t1.value_format = object.scenarioObj.ITOperationsSpending.OutsourcedCosts[cnt].value_format;

					object.selectedScenarioForComparison.push(t1);
				}

				for (let cnt = 0; cnt < object.scenarioObj.ITOperationsSpending.RunChangeTransform.length; cnt++) {
					let t1: any = {};
					t1.key = object.scenarioObj.ITOperationsSpending.RunChangeTransform[cnt].src_code;
					
					t1.value = object.scenarioObj.ITOperationsSpending.RunChangeTransform[cnt].src_code_value;
					//once save note functionality done append value of each src code note here
					t1.note = object.scenarioObj.ITOperationsSpending.RunChangeTransform[cnt].notes;
					t1.value_format = object.scenarioObj.ITOperationsSpending.RunChangeTransform[cnt].value_format;

					object.selectedScenarioForComparison.push(t1);
				}


				let currency: any;
				let region: any;

				for (let cnt = 0; cnt < object.scenarioObj.CIODashboardDataGeneralTab.NA.length; cnt++) {
					//currency
					if (object.scenarioObj.CIODashboardDataGeneralTab.NA[cnt].src_code == 'ICE002') {
						currency = object.scenarioObj.CIODashboardDataGeneralTab.NA[cnt].src_code_value;
					}
					//region
					if (object.scenarioObj.CIODashboardDataGeneralTab.NA[cnt].src_code == 'TD0110') {
						region = object.scenarioObj.CIODashboardDataGeneralTab.NA[cnt].src_code_value;
					}
				}

				if (currency == undefined || currency == null || currency.trim().length == 0) {
					currency = "FE482E13-D3B6-4208-8C3C-2FD7AFBEBEA1";//USD key
				}
				let sharedData = { "comparisionData": object.selectedScenarioForComparison, "currency": currency, "region": region };
				object.cIOEnterMyDataSharedService.setData(sharedData);
				object.cIOEnterMyDataSharedService.setScenarioSelection(scenarioID);
				//   let something = object.cIOEnterMyDataSharedService.getData().currency;
				//set an emitter to update currency 
				object.commonService.getEvent().emit('setScenarioCurrency');

				//  let something = object.cIOEnterMyDataSharedService.getData().currency;

				//get currency data
				// object.data.currency.forEach((element) => {

				//   if (element.key == something) {
				//     // this.currency = element;
				//     this.currencyCode = element.value;
				//     this.conversionCurrency = element.key;
				//     this.refactorVal = element.id;
				//     this.updateLineChartData();
				//     this.updateDrillDown();
				//   }
				// });


				object.toggle();



			}, (error) => {
				//throw custom exception to global error handler
				//create error object
				let errorObj = {
					"dashboardId": "2",
					"pageName": "Non CIO Mainframe Tower Input My Data Screen",
					"errorType": "Fatal",
					"errorTitle": "Web Service Error",
					"errorDescription": error.message,
					"errorObject": error
				}

				throw errorObj;
			})
		}

	}

	getScenarioDataByCustomRef(selectedcustomRef) {

		//get crg data by id
		let object = this;

		// if(object.showDiv==false) //in case compare scnarion is enabled, dont reset
		// {
		// 	//reset other filters
		// 	object.resetNonCRGFilters();
	
		// }
	

		//when selected N/A
		if (selectedcustomRef.customId == '-9999') {
			  object.showDefaultLandingData();
			  this.showDrillDownAfterCrg=true;
		}
		else {
			// getCIOCCRGLandingData
			//set custom reference group in service
			object.customRefGroupService.setCRGId(selectedcustomRef.customId);
			object.customRefGroupService.getCIOCCRGLandingData().subscribe((data: any) => {
				//web service to fetch CRG data

				if (data != undefined || data != null) {
					object.data = data;
				}

			});
			this.showDrillDownAfterCrg=false;
		}



		object.selectedCRGData = ''
		object.data = object.selectedCRGData;
	}

	showDefaultLandingData() {

		let object = this;

		// this is used for all landing page data
		object.service.getData().subscribe((allData: any) => {
			object.data = allData;
			object.updateLineChartData();
			object.updateDrillDown();
			this.compareExpenditureType();
		}, (error) => {
			//throw custom exception to global error handler
			//create error object
			let errorObj = {
				"dashboardId": "5",
				"pageName": "Non CIO Windows Tower Screen",
				"errorType": "Fatal",
				"errorTitle": "Web Service Error",
				"errorDescription": error.message,
				"errorObject": error
			}

			throw errorObj;
		})
	}


	//get saved scenario data of selected Scanrio Id


	getUserLoginInfo() {
		let object = this;
		object.userdata = object.loginDataBroadcastService.get('userloginInfo');
		//object.emailId = _self.userdata['userDetails']['emailId'];
		object.sessionId = object.userdata['userDetails']["sessionId"];
	}


}
