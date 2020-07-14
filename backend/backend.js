var express=require('express')
var app=express();
var cors=require('cors');;
app.use(cors());
var bodyparser = require('body-parser')
app.use(bodyparser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',function(req,res){
console.log(req.query.filter);
console.log(req.query.filterValue);
let data={
	"itspendrev": {
		"info": "Hover info here",
		"mean": 9,
		"lower": 51.2,
		"upper": 100,
		"infrastructure": {
			"info": "Hover info here",
			"value": 35,
			"charts": {
				"data": [{
					"label": "Workplace Services",
					"value": "24",
					"color": "#81cee3"
				}, {
					"label": "Service Desk",
					"value": "3",
					"color": "#29497b"
				}, {
					"label": "Data center",
					"value": "21",
					"color": "#9acb3b"
				}, {
					"label": "Network",
					"value": "33",
					"color": "#03abb9"
				}, {
					"label": "Telecomunications",
					"value": "19",
					"color": "#8b69c8"
				}]
			}
		},
		"applications": {
			"info": "Hover info here",
			"value": 51,
			"charts": [{
					"label": "Application Development",
					"value": "60",
					"color": "#81cee3"
				},
				{
					"label": "Application Maintanance & Support",
					"value": "40",
					"color": "#29497b"
				}
			]
		},
		"management": {
			"info": "Hover info here",
			"value": 14,
			"charts": [{
				"label": "IT Service Management",
				"value": "28",
				"color": "#81cee3"
			}, {
				"label": "IT Security Management",
				"value": "49",
				"color": "#29497b"
			}, {
				"label": "Other",
				"value": "23",
				"color": "#8b69c8"
			}]
		}
	},
	"itspendperuser": {
		"info": "Hover info here",
		"lower": 17760,
		"upper": 8329,
		"mean": 3522,
		"charts": [{
				"label": "2005",
				"value": "89.45"
			},
			{
				"label": "2006",
				"value": "89.87"
			},
			{
				"label": "2007",
				"value": "89.64"
			}
		]
	},
	"itspendbyexpenditure": {
		"info": "Hover info here",
		"itspendpersonnel": 27,
		"itspendhardware": 23,
		"itspendsoftware": 21,
		"itspendoutsourced": 19,
		"itspendother": 10
	},
	"itspendoutsourced": {
		"info": "Hover info here",
		"outsourcedmean": 35,
		"outsourcedupper": 10,
		"outsourcedlower": 19
	},
	"capexvsopex": {
		"info": "Hover info here",
		"capexmean": 10,
		"opexmean": 12
	},
	"itrunvschangevstransform": {
		"info": "Hover info here",
		"runmean": 55,
		"runupper": 57,
		"runlower": 52,
		"changemean": 45,
		"changeupper": 48,
		"changelower": 43,
		"transformmean": 40,
		"transformupper": 55,
		"transformlower": 40
	},
	"itpersonnel": {
		"info": "Hover info here",
		"contractorpercent": 18,
		"totalemployeepercent": 5,
		"onshorepercent": 18,
		"offshorepercent": 22,
		"attritionmean": 2
	},
	"userexperienceindex": {
		"info": "Hover info here",
		"userexperiencemean": 87,
		"userexperienceupper": 100,
		"userexperiencelower": 80,
		"charts": {
			"Pie1": {
				"label": "% of IT users that are satisfied with the Service Desk",
				"value": 67
			},
			"Pie2": {
				"label": "% of IT users that are satisfied with Workplace Services",
				"value": 67
			},
			"Pie3": {
				"label": "% of IT users that are satisfied with Workplace Tools",
				"value": 67
			}
		}
	},
	"digitalspend": {
		"info": "Hover info here",
		"digitalmean": 30,
		"digitalupper": 100,
		"digitallower": 30
	}
};
res.json(data);

	})

	app.get('/getFilterData',function(req,res){

		let data={
			"industries": [{
				"label": "All Industries",
				"value": "totalgrand"
			},
			{
				"label": "Agriculture",
				"value": "agriculture"
			},
			{
				"label": "Forestry",
				"value": "forestry"
			},
			{
				"label": "Fishing and Hunting",
				"value": "FishingandHunting"
			},
			{
				"label": "Business Services",
				"value": "BusinessServices"
			},
			{
				"label": "Retail",
				"value": "Retail"
			}
		],
		"region": [{
			"label": "Global",
			"value": "Global"
		},
		{
			"label": "North America",
			"value": "NorthAmerica"
		},
		{
			"label": "Latin America",
			"value": "LatinAmerica"
		},
		{
			"label": "Europe",
			"value": "Europe"
		},
		{
			"label": "Asia Pacific",
			"value": "AsiaPacific"
		}
	],
	"size": [{
		"label": "All Sizes",
		"value": "AllSizes"
	},
	{
		"label": "Less than $500 Million",
		"value": "<$500 Million"
	},
	{
		"label": "$500 Million - $1Billion",
		"value": "$500 Million - $1Billion"
	},
	{
		"label": "$1 Billion - $10 Billion",
		"value": "$1 Billion > $10 Billion"
	},
	{
		"label": "Greater than $10 Billion",
		"value": ">$10 Billion"
	}

],
"currency": [{
	"label": "USD",
	"value": "USD"
},
{
	"label": "EUR",
	"value": "EUR"
},
{
	"label": "JBP",
	"value": "JBP"
},
{
	"label": "AUD",
	"value": "AUD"
}
]
}

res.send(data);
})

app.post('/getComparedData',function(req,res){
	//console.log(req.query.filter);
	// console.log(req.query.filterValue);
	let data={
		"industries":[
			{
			   "label":"LifeScience"
			},
			{
			   "label":"Manufacturing"
			}
		 ],
		 "dataset":[
			{
			   "itSpendCompanyRev":[
				  {
					 "value":51
				  },
				  {
					 "value":52
				  }
			   ]
			},
			{
			   "itSpendBreakdown":{
				  "infrastructure":[
					 {
						"value":12
					 },
					 {
						"value":23
					 }
				  ],
				  "application":[
					 {
						"value":45
					 },
					 {
						"value":55
					 }
				  ],
				  "management":[
					 {
						"value":78
					 },
					 {
						"value":87
					 }
				  ]
			   }
			},
			{
			   "itSpendPerUser":[
				  {
					 "value":78233
				  },
				  {
					 "value":87456
				  }
			   ]
			},
			{
			   "itSpendByExpnditure":{
				  "personnel":[
					 {
						"value":78
					 },
					 {
						"value":87
					 }
				  ],
				  "hardware":[
					 {
						"value":78
					 },
					 {
						"value":87
					 }
				  ],
				  "software":[
					 {
						"value":78
					 },
					 {
						"value":87
					 }
				  ],
				  "outsourced":[
					 {
						"value":78
					 },
					 {
						"value":87
					 }
				  ],
				  "other":[
					 {
						"value":78
					 },
					 {
						"value":87
					 }
				  ]
			   }
			},
			{
			   "itSpendOutsourced":[
				  {
					 "value":78233
				  },
				  {
					 "value":87456
				  }
			   ]
			},
			{
			   "capexVsOpex":{
				  "overallCapex":[
					 {
						"value":78
					 },
					 {
						"value":87
					 }
				  ],
				  "overallOpex":[
					 {
						"value":78
					 },
					 {
						"value":87
					 }
				  ]
			   }
			},
			{
			   "itRunVsChangeVsTransform":{
				  "run":[
					 {
						"value":78
					 },
					 {
						"value":87
					 }
				  ],
				  "change":[
					 {
						"value":78
					 },
					 {
						"value":87
					 }
				  ],
				  "transform":[
					 {
						"value":78
					 },
					 {
						"value":87
					 }
				  ]
			   }
			},
			{
			   "itPersonnel":{
				  "totalEmployeesPerc":[
					 {
						"value":78
					 },
					 {
						"value":87
					 }
				  ],
				  "totalContractorsPerc":[
					 {
						"value":78
					 },
					 {
						"value":87
					 }
				  ],
				  "onshore":[
					 {
						"value":78
					 },
					 {
						"value":87
					 }
				  ],
				  "offshore":[
					 {
						"value":78
					 },
					 {
						"value":87
					 }
				  ],
				  "attritionRate":[
					 {
						"value":78
					 },
					 {
						"value":87
					 }
				  ]
			   }
			},
			{
			   "userExperience":{
				  "overallSatisfaction":[
					 {
						"value":78
					 },
					 {
						"value":87
					 }
				  ]
			   }
			},
			{
			   "digitalSpend":{
				  "percentOfSG & A":[
					 {
						"value":78
					 },
					 {
						"value":87
					 }
				  ]
			   }
			}
		 ]
	};
	res.json(data);
	
		});

app.listen(3000,function(){
	console.log('server running on 3000');
})