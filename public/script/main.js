/**
 * This portion is to load the price of BTC for the last 30 days
 */
var hisData = get30DayBTCData();
console.log(hisData);
var date =[];
var openBCRate=[];
var closeBCRate = [];
for(let i =0 ; i < hisData.Data.Data.length ; i++){
	var tmpDate = convertUnixToDate(hisData.Data.Data[i].time);
	date.push(tmpDate.getDate()+'-'+tmpDate.getMonth()+'-'+tmpDate.getFullYear());
	openBCRate.push(hisData.Data.Data[i].open);
	closeBCRate.push(hisData.Data.Data[i].close);
}
var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: date,
    datasets: [
      { 
        data: openBCRate,
		label: "Opening Rate",
		borderColor: "#3e95cd",
		fill: false
      },
	  { 
        data: closeBCRate,
		label: "Closing Rate",
		borderColor: "#3ff266",
		fill: false
      }
    ]
  },
  options: {
		legend: {
			display: false
		},
        title: {
            display: true,
            text: 'BTC Last 30days'
        }
   }
});

/**
 * This portion is to load the price of BTC for the last 24hours
 */
var btc24hData = get24HBTCData();
var date =[];
var closeBCRate = [];
for(let i =0 ; i < btc24hData.Data.Data.length ; i++){
	var tmpDate = convertUnixToDate(btc24hData.Data.Data[i].time);
	date.push(tmpDate.toLocaleTimeString());
	closeBCRate.push(btc24hData.Data.Data[i].close);
}

var bitC = document.getElementById("bitChart");
var myChart = new Chart(bitC, {
  type: 'line',
  data: {
    labels: date,
	backgroundColor:"#3ff266",
	borderColor:"#3ff266",
    datasets: [
	  { 
		backgroundColor:"#9bd1a7",
        data: closeBCRate,
		label: "Closing Rate",
		borderColor: "#3ff266",
		fill: true
      }
    ]
  },
  options: {
		legend: {
			display: false
		},
        title: {
            display: true,
            text: 'BitCoin Last 24hours'
        }
   }
});

var btcliveData = getLiveBCRate();
var ethLiveData = getLiveETHRate();
document.getElementById("liveBTCRate").textContent=btcliveData.USD;
document.getElementById("liveETHRate").textContent=ethLiveData.USD;
function liveRates(){
	var prevBTCRate = document.getElementById("liveBTCRate").innerText;
	var old24HBTCRate = get24HBTCData().Data.Data[0].close;
	var diffBTCPercentage = (((prevBTCRate - old24HBTCRate) / old24HBTCRate ) *100).toFixed(4);
	if(diffBTCPercentage < 0){
		document.getElementById('btcRateChange').style.color='#e34459';
	}else{
		document.getElementById('btcRateChange').style.color='#3ff266';
	}
	document.getElementById("btcRateChange").textContent= '('+diffBTCPercentage+')%';
	document.getElementById("liveBTCRate").textContent= getLiveBCRate().USD;

	var prevETHRate = document.getElementById("liveETHRate").innerText;
	var old24HETHRate = get24HETHData().Data.Data[0].close;
	var diffETHPrecentage = (((prevETHRate - old24HETHRate) / old24HETHRate ) *100).toFixed(4);
	if(diffETHPrecentage < 0){
		document.getElementById('ethRateChange').style.color='#e34459';
	}else{
		document.getElementById('ethRateChange').style.color='#3ff266';
	}
	document.getElementById("ethRateChange").textContent= '('+diffETHPrecentage+')%';
	document.getElementById("liveETHRate").textContent= getLiveETHRate().USD;
}

/**
 * This portion is to load the price of ETH for the last 24hours
 */
var ethData = get24HETHData();
var date =[];
var closeETHRate = [];
for(let i =0 ; i < ethData.Data.Data.length ; i++){
	var tmpDate = convertUnixToDate(ethData.Data.Data[i].time);
	date.push(tmpDate.toLocaleTimeString());
	closeETHRate.push(ethData.Data.Data[i].close);
}

var bitC = document.getElementById("ethChart");
var myChart = new Chart(bitC, {
  type: 'line',
  data: {
    labels: date,
	backgroundColor:"#3ff266",
	borderColor:"#3ff266",
    datasets: [
	  { 
		backgroundColor:"#9bd1a7",
        data: closeETHRate,
		label: "Closing Rate",
		borderColor: "#3ff266",
		fill: true
      }
    ]
  },
  options: {
		legend: {
			display: false
		},
        title: {
            display: true,
            text: 'Ethereum Last 24hours'
        }
   }
});

var btcNewsFeed = getBTCNewsFeed();
console.log(btcNewsFeed);


/**
 * This portion is to get the live price of BTC
 */
function getLiveBCRate(){
	var result;
	var request = new XMLHttpRequest();
	request.open('GET',
	'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD&api_key=45419ed9fb65b31861ccb009765d97bb619e9eccedc722044457d066cbfb0a8b'
	, false)
	request.send(null);
	result = JSON.parse(request.responseText);
	return result;
}

/**
 * This portion is to get the live price of ETH
 */
function getLiveETHRate(){
	var result;
	var request = new XMLHttpRequest();
	request.open('GET',
	'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=45419ed9fb65b31861ccb009765d97bb619e9eccedc722044457d066cbfb0a8b'
	, false)
	request.send(null);
	result = JSON.parse(request.responseText);
	return result;
}

// Get Historical Data for the past 30days for BitCoin
function get30DayBTCData(){
	var result;
	var request = new XMLHttpRequest();
	request.open('GET',
	'https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=30&api_key=45419ed9fb65b31861ccb009765d97bb619e9eccedc722044457d066cbfb0a8b'
	, false)
	request.send(null);
	result = JSON.parse(request.responseText);
	return result;
}

function get24HBTCData(){
	var result;
	var request = new XMLHttpRequest();
	request.open('GET',
	'https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USD&limit=24&api_key=45419ed9fb65b31861ccb009765d97bb619e9eccedc722044457d066cbfb0a8b'
	, false)
	request.send(null);
	result = JSON.parse(request.responseText);
	return result;
}

function get24HETHData(){
	var result;
	var request = new XMLHttpRequest();
	request.open('GET',
	'https://min-api.cryptocompare.com/data/v2/histohour?fsym=ETH&tsym=USD&limit=24&api_key=45419ed9fb65b31861ccb009765d97bb619e9eccedc722044457d066cbfb0a8b'
	, false);
	request.send(null);
	result = JSON.parse(request.responseText);
	return result;
}

function convertUnixToDate(time){
	let unix_timestamp = time;
	var date = new Date(unix_timestamp * 1000);
	return date;
}

function getBTCNewsFeed(){
	var result;
	var request = new XMLHttpRequest();
	request.open('GET',
	'https://min-api.cryptocompare.com/data/v2/news/?feeds=cryptocompare,cointelegraph,coindesk&categories=BTC,ETH&excludeCategories=Sponsored&extraParams=CryptoDASH&api_key=45419ed9fb65b31861ccb009765d97bb619e9eccedc722044457d066cbfb0a8b'
	, false);
	request.send(null);
	result = JSON.parse(request.responseText);
	return result;
}



/**
 * Twitter feed
 */
function loadTwitterFeed(){
	window.twttr = (function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0],
		  t = window.twttr || {};
		if (d.getElementById(id)) return t;
		js = d.createElement(s);
		js.id = id;
		js.src = "https://platform.twitter.com/widgets.js";
		fjs.parentNode.insertBefore(js, fjs);
	  
		t._e = [];
		t.ready = function(f) {
		  t._e.push(f);
		};
		return t;
	  }(document, "script", "twitter-wjs"));
}
 