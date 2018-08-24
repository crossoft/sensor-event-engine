# Sensor Event Engine

Server that handles incoming sensor events.

## Install

```
yarn install
```

### Installing yarn on Raspberry Pi
```
sudo apt-get install git
sudo apt-get install nodejs
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get install -y build-essential
sudo apt-get install yarn
```

## Start

Run with `yarn start`

After starting, server handles incoming sensor messages on POST `http://localhost:3000/events`.

## Supported events
- `accelerometer` (`x`, `y`, `z`)
- `battery` (`value`)
- `humidity` (`value`)
- `motion` (`value` - `true`/`false`)
- `temperature` (`value`)

### Example message format

```json
{
  "messageType":"accelerometer",
  "measureValues": { 
    "x": 281.49248665547907,
    "y": 20.535517084964965,
    "z": -0.15586189463505207
  },
  "sensorId":"1b152ff0-a791-11e8-a339-576e2b635de0",
  "signalStrength":6,
  "dateTimeUtc":"2018-08-24T11:30:30Z"
}
```

## Testing & Mocking CLI

### Mocking
You can mock fake all available events by calling this from console:
```sh
yarn mock <eventType>
```

#### Available mocks:
- `yarn mock accelerometer`
- `yarn mock battery`
- `yarn mock humidity`
- `yarn mock motion`
- `yarn mock temperature`

### Viewing records

You can records with these commands in console.

```
yarn show <tableName>
```

#### Events
```sh
yarn show events

┌────┬─────────────┬──────────────────────────────────────────┬──────────┬──────────────────────────────┐
│ id │ type        │ dateTime                                 │ sensorId │ readings                     │
├────┼─────────────┼──────────────────────────────────────────┼──────────┼──────────────────────────────┤
│ 1  │ temperature │ Fri Aug 24 2018 15:18:53 GMT+0300 (EEST) │ 1        │ signalStrength: 7; value: 13 │
├────┼─────────────┼──────────────────────────────────────────┼──────────┼──────────────────────────────┤
│ 2  │ motion      │ Fri Aug 24 2018 15:18:58 GMT+0300 (EEST) │ 2        │ signalStrength: 6; value: 1  │
└────┴─────────────┴──────────────────────────────────────────┴──────────┴──────────────────────────────┘
```

### Sensors
```sh
yarn show sensors

┌────┬──────────────────────────────────────┬──────────────────────────────────────────┬──────────────────────────────────────────┬──────────┐
│ id │ externalId                           │ createdAt                                │ updatedAt                                │ deviceId │
├────┼──────────────────────────────────────┼──────────────────────────────────────────┼──────────────────────────────────────────┼──────────┤
│ 1  │ ddc86c00-a797-11e8-b77f-37fbfcd2dc8a │ Fri Aug 24 2018 15:18:53 GMT+0300 (EEST) │ Fri Aug 24 2018 15:18:53 GMT+0300 (EEST) │ 1        │
├────┼──────────────────────────────────────┼──────────────────────────────────────────┼──────────────────────────────────────────┼──────────┤
│ 2  │ e09bb040-a797-11e8-a735-055450ba1ec8 │ Fri Aug 24 2018 15:18:58 GMT+0300 (EEST) │ Fri Aug 24 2018 15:18:59 GMT+0300 (EEST) │ 2        │
└────┴──────────────────────────────────────┴──────────────────────────────────────────┴──────────────────────────────────────────┴──────────┘
```

### Devices
```sh
yarn show devices

┌────┬──────────────────────────────────────────┬──────────────────────────────────────────┐
│ id │ createdAt                                │ updatedAt                                │
├────┼──────────────────────────────────────────┼──────────────────────────────────────────┤
│ 1  │ Fri Aug 24 2018 15:18:53 GMT+0300 (EEST) │ Fri Aug 24 2018 15:18:53 GMT+0300 (EEST) │
├────┼──────────────────────────────────────────┼──────────────────────────────────────────┤
│ 2  │ Fri Aug 24 2018 15:18:59 GMT+0300 (EEST) │ Fri Aug 24 2018 15:18:59 GMT+0300 (EEST) │
└────┴──────────────────────────────────────────┴──────────────────────────────────────────┘
```
