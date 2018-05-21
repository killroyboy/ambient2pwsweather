/**
 * ambient2pwsweather
 * * Pull weather data from an AmbientWeather.net Station and push to a PWSweather.com Station
 *
 * * Requires AmbientWeather.net API Key and PWSweather.com StationID and Password
 * * Currently only supports 1 device from AmbientWeather
 */

const got = require('got'),
	pkg = require('./package.json'),
	config = require('config'),
	_ = require('lodash'),
	moment = require('moment'),
	logger = require('eazy-logger').Logger({
		useLevelPrefixes: true,
		level : process.env.LOG_LEVEL || config.log_level
	}),
	AmbientAPI = require('ambient-weather-api'),
	appKey = config.ambient.app_key || process.env.AMBIENT_APP_KEY,
	apiKey = config.ambient.api_key || process.env.AMBIENT_API_KEY,
	pwsStation = config.pwsweather.station_id || process.env.PWS_STATION_ID,
	pwsPassword = config.pwsweather.password || process.env.PWS_PASSWORD;


logger.info('------- ambient2weather v' + pkg.version, '--------');
logger.debug('Ambient Application Key:', appKey);
logger.debug('Ambient API Key:', apiKey);
logger.debug('PWD Station ID:', pwsStation);
logger.debug('PWD Password:', pwsPassword);

if (!appKey || !apiKey || !pwsStation || !pwsPassword) {
	logger.error('Insufficient configuration data. Missing API Key, App Key, Station ID or PWS Password.');
	process.exit();
}

// instantiate the API
const api = new AmbientAPI({
	apiKey : apiKey,
	applicationKey : appKey
});

// On connect, we subscribe (this will also re-subscribe when the connection fails and reconnects)
api.on('connect', () => {
	logger.debug('Connected to Ambient Weather Realtime API')
	api.subscribe(apiKey);
});

api.on('subscribed', data => {
	logger.debug('Subscribed to device:', data.devices[0].info.name);
	logger.debug(data.devices[0].lastData.date + ' - ' + data.devices[0].info.name + ' current outdoor temperature is: ' + data.devices[0].lastData.tempf + '°F');
});

var params = {};

// On data, package it up for PWSweather.com and send it over
api.on('data', data => {
	logger.debug(data.date + ' - ' + data.device.info.name + ' current outdoor temperature is: ' + data.tempf + '°F');

	delete data.device;
	delete data.macAddress;

	// logger.debug('data', data);

	params = _.merge(data, {
		ID : pwsStation,
		PASSWORD : pwsPassword,
		dateutc : moment(data.date).format('YYYY-MM-DD HH:mm:ss'),
		baromin : data.baromrelin,
		dewptf : data.dewPoint,
		humidity : data.humidityin,
		rainin : data.totalrainin,
		UV : data.uv,
		softwaretype: 'ambient2pwsweather-' + pkg.version,
		action : 'updateraw'
	});

	delete params.date;
	delete params.baromrelin;
	delete params.dewPoint;
	delete params.uv;
	delete params.baromabsin;
	delete params.feelslike;
	delete params.maxdailygust;

	// logger.debug('params', params);

	got(config.pws_base_url, {query: params}).then(response => {
		if (response.statusCode === 200) {
			logger.debug('Success', response.statusMessage);
		} else {
			logger.error('Failed', response.statusMessage);
		}
	}).catch(reason => {
		logger.error('PWSweather request failed', reason);
	});
});

// Let's start the connection
logger.debug('Connecting to AmbientWeather.net...');
api.connect();

