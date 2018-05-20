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
		level : config.log_level
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

const api = new AmbientAPI({
	apiKey : apiKey,
	applicationKey : appKey
});

logger.debug('Connecting to AmbientWeather.net...');
api.connect();
api.on('connect', () => logger.debug('Connected to Ambient Weather Realtime API'));
api.on('subscribed', data => {
	logger.debug('Subscribed to device:', data.devices[0].info.name);
});

var params = {}, url = '';
// http://www.pwsweather.com/pwsupdate/pwsupdate.php?ID=STATIONID&PASSWORD=password&dateutc=2000-12-01+15%3A20%3A01&winddir=225&windspeedmph=0.0&windgustmph=0.0&tempf=34.88&rainin=0.06&dailyrainin=0.06&monthrainin=1.02&yearrainin=18.26&baromin=29.49&dewptf=30.16&humidity=83&weather=OVC&solarradiation=183&UV=5.28&softwaretype=Examplever1.1&action=updateraw

api.on('data', data => {
	logger.debug(data.date + ' - ' + data.device.info.name + ' current outdoor temperature is: ' + data.tempf + '°F');

	delete data.device;
	delete data.macAddress;

	// logger.debug('data', data);

	params = _.merge(data, {
		ID : pwsStation,
		PASSWORD : pwsPassword,
		dateutc : moment(data.date).format('YYYY-MM-DD+HH:mm:ss'),
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
			// logger.debug('Body', response.body);
		} else {
			logger.debug('Failed', response.statusMessage);
		}
	}).catch(reason => {
		logger.error('pwsweather failed', reason);
	});
});
api.subscribe(apiKey);

