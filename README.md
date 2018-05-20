# ambient2pwsweather

Summary
---------------
*ambient2pwsweather* is an open source Node.js project providing a software bridge between Ambient Weather Stations (through AmbientWeather.net) and PWS Weather.

Requirements
---------------
- Node.js 6.x
- [AmbientWeather.net account](https://ambientweather.net)
- [PWSWeather.com account](https://www.pwsweather.com)


Installation
---------------
To use *ambient2pwsweather*, you must first install [Node.js](https://nodejs.org/en/download/). After Node is installed, download and unzip the latest [release](https://github.com/killroyboy/ambient2pwsweather/releases) into any given directory.

Customize the configuration by copying the `config/default.json` file to `config/local.json` and then editing your settings. If you edit default.json directly, it is likely that future versions of *ambient2pwsweather* will overwrite your customizations. Alternatively, you can use environment variables to override specific configuration variables.

Open a command line window (`terminal` on MacOS or follow [these instructions](https://www.lifewire.com/command-prompt-2625840) for Windows) and issue the following commands within the yts-downloader directory:

```js
npm install
```
```js
node index.js
```

The first command will install all the prerequisites and the second starts *ambient2pwsweather*. You will need to keep this window and process running in order to allow it to continue to retrieve data from AmbientWeather.net. There are tools available (like [forever](https://www.npmjs.com/package/forever)) to ensure the process runs in the background.


Configuration
---------------
Below is the default configuration. You can easily customize and override any setting by copying the `config/default.json` file to `config/local.json` and then change any settings you desire.

```js
{
  "ambient" : {
    "api_key" : "",
    "app_key" : ""
  },
  "pwsweather" : {
    "station_id" : "",
    "password" : ""
  },
  "log_level" : "info",
  "pws_base_url" : "http://www.pwsweather.com/pwsupdate/pwsupdate.php"
}
```
Alternatively, the following environment variables can be used to override configurations.
- AMBIENT_API_KEY - (Obtained from your AmbientWeather.net profile page)
- AMBIENT_APP_KEY - (Obtained by requesting from AmbientWeather support)
- PWD_STATION_ID - (From your PWS Weather account)
- PWD_PASSWORD - (From your PWS Weather account)
- LOG_LEVEL - (debug, info, warn, error)

Author
---------------
Dan Wilson ([@killroyboy](https://twitter.com/killroyboy) / [Web](https://www.codeality.com))

License
---------------
MIT

Contributing
---------------
Code contributions are greatly appreciated, please submit a new [pull request](https://github.com/killroyboy/ambient2pwsweather/pull/new/master)!