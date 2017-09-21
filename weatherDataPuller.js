var casper = require('casper').create();
var fs = require('fs');
var day = 1;
var dayLimit = 20;
var urls = [];
var currentUrl;

/** Generate URLs **/
casper.start().repeat(dayLimit, function() {
	currentUrl = 'https://www.wunderground.com/history/airport/LFLY/2017/9/' + day + '/DailyHistory.html?req_city=&req_state=&req_statename=&reqdb.zip=&reqdb.magic=&reqdb.wmo=';
    this.echo(currentUrl);
	urls.push(currentUrl);
	day ++;
});

casper.then(function() {
	day = 1;	
});

/** Iterate on each URL**/
casper.then(function() {
    this.eachThen(urls, function(response) {
		/** Call URL **/
		casper.thenOpen(response.data, function() {
			/** Display title **/
		    this.echo(this.getTitle());
			this.echo(response.data);
			/** Select weather table **/
			var table = casper.evaluate(function() {
			    return document.querySelector("#observations_details").innerHTML;
			});	
			/** Store table on file **/
			fs.write('weather-lyon--2017-09-' + day + '.html', table, 'w');
			day ++;
		});
    });
});

casper.run();