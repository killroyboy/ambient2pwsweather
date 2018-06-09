/**
 * ambient2pwsweather installation
 * * Manager ambient2pwsweather as a service on macOS, Windows or Linux
 * * You must manually install the platform service yourself: node-mac, node-windows, node-linux
 */

// determine which service helper we should require
var service_mod = '';
switch (process.platform) {
	case 'darwin':
		service_mod = 'node-mac';
		break;
	case 'win32':
		service_mod = 'node-windows';
		break;
	case 'linux':
		service_mod = 'node-linux';
		break;
}

if (!service_mod) {
	console.log('ERROR: Undetected platform. Running as a service is only available on macOS, Windows and Linux.');
	process.exit();
}

const isElevated = require('is-elevated');

isElevated().then(elevated => {
	if (!elevated) {
		console.log('ERROR: Must be run as root/Administrator.')
		process.exit();
	} else {
		const Service = require(service_mod).Service;

		// Create a new service object
		var svc = new Service({
			name:'ambient2pwsweather',
			description: 'Pull weather data from an AmbientWeather.net Station and push to a PWSweather.com Station',
			script: require('path').join(__dirname, 'index.js')
		});

		svc.on('start', function () {
			setTimeout(function () {
				// console.log('Service running:', svc.exists);
			}, 300);
		});

		svc.on('stop', function () {
			setTimeout(function () {
				// console.log('Service running:', svc.exists);
			}, 300);
		});

		svc.on('error', function (e) {
			console.log('Error occurred:', e);
		});

		svc.on('alreadyinstalled', function () {
			console.log('Service already installed.');
			console.log('Service installed:', svc.exists);
		});

		svc.on('install', function() {
			svc.start();
		});

		svc.on('uninstall', function() {
			console.log('Uninstall complete.');
			console.log('Service installed:', svc.exists);
		});

		var command = process.argv[2];

		var usage = function () {
			console.log('Usage: service [install|uninstall|status|start|stop|restart]');
			process.exit(0);
		};

		if (!command) {
			usage();
		}

		switch (command) {
			case 'install':
				// Install the service
				svc.install();
				break;
			case 'uninstall':
				// Uninstall the service.
				svc.uninstall();
				break;
			case 'status':
				console.log('Service installed:', svc.exists);
				// console.log('Service running:', svc.exists);
				break;
			case 'start':
				svc.start();
				break;
			case 'stop':
				svc.stop();
				break;
			case 'restart':
				svc.restart();
				break;
			default:
				usage();
		}
	}
});