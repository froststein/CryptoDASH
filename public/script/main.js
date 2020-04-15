/**
 *	This is the main JS function that is called by the Index page when it is loaded.
 *	Timeout is set to allow page loading
 */
setTimeout(function main() {

	conCheck();
	//	Get historical 30day data for BTC Price from https://min-api.cryptocompare.com
	var btc30dayData = get30DayBTCData();
	//	Load historical 30day data for BTC Price
	load30DayBTCData(btc30dayData);

	//	Get historical 24hour data for BTC Price from https://min-api.cryptocompare.com
	var btc24hbtcData = get24HBTCData();
	//	Load historical 24hour data for BTC Price
	load24hBTCdata(btc24hbtcData);

	//	Get historical 24hour data for ETH Price from https://min-api.cryptocompare.com
	var btc24hethData = get24HETHData();
	//	Load historical 24hour data for ETH Price
	load24hETHData(btc24hethData);

	//	Get live rate for BTC Price from https://min-api.cryptocompare.com
	var btcliveData = getLiveBTCRate();
	//	Get live rate for ETH Price from https://min-api.cryptocompare.com
	var ethliveData = getLiveETHRate();
	liveRates(btcliveData, ethliveData);
	//	Updates live rates every 1000ticks
	setInterval("liveRates();", 1000);

	loadTwitterFeed();

}, 10);

/**
 *	This portion is to load the price of BTC for the last 30 days
 */
function load30DayBTCData(btc30dayData) {
	var date = [];
	var openBTCRate = [];
	var closeBTCRate = [];
	for (let i = 0; i < btc30dayData.Data.Data.length; i++) {
		//	Convert UNIX time
		var convDate = convertUnixToDate(btc30dayData.Data.Data[i].time);
		date.push(convDate.getDate() + '-' + convDate.getMonth() + '-' + convDate.getFullYear());
		openBTCRate.push(btc30dayData.Data.Data[i].open);
		closeBTCRate.push(btc30dayData.Data.Data[i].close);
	}
	//	Get <canvas> ID to plot chart
	var ctx = document.getElementById('btc30dayChart');
	var newChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: date,
			datasets: [{
					//	Load dataset for Opening Rate for BTC
					data: openBTCRate,
					label: "Opening Rate",
					borderColor: "#3e95cd",
					fill: false
				},
				{
					//	Load dataset for Closing Rate for BTC
					data: closeBTCRate,
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
				text: 'BitCoin Last 30days'
			}
		}
	});
}

/**
 *	This portion is to load the price of BTC for the last 24hours
 */
function load24hBTCdata(btc24hbtcData) {
	var date = [];
	var closeBCRate = [];
	for (let i = 0; i < btc24hbtcData.Data.Data.length; i++) {
		//	Convert UNIX time
		var tmpDate = convertUnixToDate(btc24hbtcData.Data.Data[i].time);
		date.push(tmpDate.toLocaleTimeString());
		closeBCRate.push(btc24hbtcData.Data.Data[i].close);
	}
	//	Get <canvas> ID to plot chart
	var ctx = document.getElementById("btc24hChart");
	var newChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: date,
			backgroundColor: "#3ff266",
			borderColor: "#3ff266",
			datasets: [{
				backgroundColor: "#9bd1a7",
				data: closeBCRate,
				label: "Closing Rate",
				borderColor: "#3ff266",
				fill: true
			}]
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
}

/**
 *	This portion is to load the price of ETH for the last 24hours
 */
function load24hETHData(eth24hData) {
	var date = [];
	var closeETHRate = [];
	for (let i = 0; i < eth24hData.Data.Data.length; i++) {
		//	Convert UNIX time
		var tmpDate = convertUnixToDate(eth24hData.Data.Data[i].time);
		date.push(tmpDate.toLocaleTimeString());
		closeETHRate.push(eth24hData.Data.Data[i].close);
	}
	//	Get <canvas> ID to plot chart
	var ctx = document.getElementById("eth24hChart");
	var newChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: date,
			backgroundColor: "#3ff266",
			borderColor: "#3ff266",
			datasets: [{
				backgroundColor: "#9bd1a7",
				data: closeETHRate,
				label: "Closing Rate",
				borderColor: "#3ff266",
				fill: true
			}]
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
}

function loadliveRates(btcLiveData, ethLiveData) {
	document.getElementById("liveBTCRate").textContent = btcliveData.USD;
	document.getElementById("liveETHRate").textContent = ethLiveData.USD;
}

function liveRates() {
	var prevBTCRate = document.getElementById("liveBTCRate").innerText;
	var old24HBTCRate = get24HBTCData().Data.Data[0].close;
	var diffBTCPercentage = (((prevBTCRate - old24HBTCRate) / old24HBTCRate) * 100).toFixed(4);
	if (diffBTCPercentage < 0) {
		document.getElementById('btcRateChange').style.color = '#e34459';
	} else {
		document.getElementById('btcRateChange').style.color = '#3ff266';
	}
	document.getElementById("btcRateChange").textContent = '(' + diffBTCPercentage + ')%';
	document.getElementById("liveBTCRate").textContent = getLiveBTCRate().USD;

	var prevETHRate = document.getElementById("liveETHRate").innerText;
	var old24HETHRate = get24HETHData().Data.Data[0].close;
	var diffETHPrecentage = (((prevETHRate - old24HETHRate) / old24HETHRate) * 100).toFixed(4);
	if (diffETHPrecentage < 0) {
		document.getElementById('ethRateChange').style.color = '#e34459';
	} else {
		document.getElementById('ethRateChange').style.color = '#3ff266';
	}
	document.getElementById("ethRateChange").textContent = '(' + diffETHPrecentage + ')%';
	document.getElementById("liveETHRate").textContent = getLiveETHRate().USD;
}

/**
 *	Load Twitter feed
 */
function loadTwitterFeed() {
	window.twttr = (function (d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0],
			t = window.twttr || {};
		if (d.getElementById(id)) return t;
		js = d.createElement(s);
		js.id = id;
		js.src = "https://platform.twitter.com/widgets.js";
		fjs.parentNode.insertBefore(js, fjs);

		t._e = [];
		t.ready = function (f) {
			t._e.push(f);
		};
		return t;
	}(document, "script", "twitter-wjs"));
}


/**
 *	This portion is to get the live price of BTC
 */
function getLiveBTCRate() {
	var result;
	var request = new XMLHttpRequest();
	request.open('GET',
		'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD&api_key=45419ed9fb65b31861ccb009765d97bb619e9eccedc722044457d066cbfb0a8b', false)
	request.send(null);
	result = JSON.parse(request.responseText);
	return result;
}

/**
 *	This portion is to get the live price of ETH
 */
function getLiveETHRate() {
	var result;
	var request = new XMLHttpRequest();
	request.open('GET',
		'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=45419ed9fb65b31861ccb009765d97bb619e9eccedc722044457d066cbfb0a8b', false)
	request.send(null);
	result = JSON.parse(request.responseText);
	return result;
}

/**
 *	This portion is to get Historical BitCoin Data for the past 30days 
 */
function get30DayBTCData() {
	var result;
	var request = new XMLHttpRequest();
	request.open('GET',
		'https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=30&api_key=45419ed9fb65b31861ccb009765d97bb619e9eccedc722044457d066cbfb0a8b', false)
	request.send(null);
	result = JSON.parse(request.responseText);
	return result;
}

/**
 *	This portion is to get Historical BitCoin Data for the past 24hour
 */
function get24HBTCData() {
	var result;
	var request = new XMLHttpRequest();
	request.open('GET',
		'https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USD&limit=24&api_key=45419ed9fb65b31861ccb009765d97bb619e9eccedc722044457d066cbfb0a8b', false)
	request.send(null);
	result = JSON.parse(request.responseText);
	return result;
}

/**
 *	This portion is to get Historical Ethereum Data for the past 24hour
 */
function get24HETHData() {
	var result;
	var request = new XMLHttpRequest();
	request.open('GET',
		'https://min-api.cryptocompare.com/data/v2/histohour?fsym=ETH&tsym=USD&limit=24&api_key=45419ed9fb65b31861ccb009765d97bb619e9eccedc722044457d066cbfb0a8b', false);
	request.send(null);
	result = JSON.parse(request.responseText);
	return result;
}

/**
 *	This function is to convert UNIX date
 */
function convertUnixToDate(time) {
	let unix_timestamp = time;
	var date = new Date(unix_timestamp * 1000);
	return date;
}

/**
 *	This function is to perform a connection check
 */
function conCheck() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onerror = function () {
		$('#exampleModal').modal('show');
	}
	xmlhttp.open("GET", 'https://min-api.cryptocompare.com', true);
	xmlhttp.send();
}
