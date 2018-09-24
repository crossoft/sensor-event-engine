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
- `battery` (`battery`)
- `humidity` (`humidity`)
- `motion` (`motion` - `true`/`false`)
- `temperature` (`temperature`)

### Example message format

```json
{
  "messageType":"accelerometer",
  "measureValues": {
    "x": 281.49248665547907,
    "y": 20.535517084964965,
    "z": -0.15586189463505207
  },
  "sensorId": "1b152ff0-a791-11e8-a339-576e2b635de0",
  "signalStrength": 6,
  "dateTimeUtc": "2018-08-24T11:30:30Z"
}
```

## Config

### Rules

You can setup rules that trigger if certain conditions of events
(or lack of them) are met.

The setup is done in `config.json`.

This is a simple example which triggers when temperature sensor gets
higher than 15:
```json
{
  "rules": [
    {
      "scope": {
        "event": {
          "type": "temperature"
        }
      },
      "condition": {
        "value": {
          "name": "temperature"
        },
        "comparison": "gt",
        "threshold": 15
      },
      "actions": [
        {
          "type": "webhook",
          "url": "https://example.com"
        }
      ]
    }
  ]
}
```

### Scope

You can scope rules so they are only triggered on certain types of
events/zones/devices. Scope also influcences how `count` aggregation is
calculated. See `aggregate`.

#### event -> type

`event -> type` here corresponds to the `messageType` in the registered event.

```json
{
  "rules": [
    {
      "scope": {
        "event": {
          "type": "temperature"
        }
      },
      "condition": {
        "value": {
          "name": "temperature"
        },
        "comparison": "gt",
        "threshold": 15
      }
    }
  ]
}
```

Possible values for `event -> type`:
- `accelerometer`
- `battery`
- `humidity`
- `motion`
- `temperature`

#### sensor -> externalId

Can set up so if you know `sensorId` that is sent from the external device
(the `"sensorId": "1b152ff0-a791-11e8-a339-576e2b635de0"` part).

```json
{
  "rules": [
    {
      "scope": {
        "sensor": {
          "externalId": "1b152ff0-a791-11e8-a339-576e2b635de0"
        }
      }
    }
  ]
}
```

#### zone -> name

See how to setup zones below.

```json
{
  "rules": [
    {
      "scope": {
        "zone": {
          "name": "Living Room"
        }
      }
    }
  ]
}
```

#### device -> name

See how to setup devices below.

```json
{
  "rules": [
    {
      "scope": {
        "device": {
          "name": "Thermometer 1"
        }
      }
    }
  ]
}
```

### Zones

You can set up zones in the config and then reference them in scope of rules.

```json
{
  "zones": [
    {
      "name": "Living Room"
    }
  ],
  "rules": [
    {
      "scope": {
        "zone": {
          "name": "Living Room"
        }
      }
    }
  ]
}
```

### Devices

Just like with zones, you can setup devices the same way.

```json
{
  "devices": [
    {
      "name": "Thermometer 1"
    }
  ],
  "rules": [
    {
      "scope": {
        "device": {
          "name": "Thermometer 1"
        }
      }
    }
  ]
}
```

### Condition

`condition` in a rule decides whether the actual data engages the trigger.

```json
{
  "rules": [
    {
      "condition": {
        "value": {
          "name": "temperature"
        },
        "comparison": "gt",
        "threshold": 15
      }
    }
  ]
}
```

#### `value`

`condition -> value` calculates the value which will be compared to the `threshold`.

`name` here is the name of the `measureValues` key. Depending on the sensor, it
can be:
- `temperature`
- `x`
- `y`
- `z`
- `battery`
- `humidity`
- `motion`

#### `comparison`

Decides how to compare `value` to the `threshold`.

Available values:
- `eq` (equals)
- `gt` (greater than)
- `gte` (greater than or equals)
- `lt` (lower than)
- `lte` (lower than or equals)

#### `aggregate`

To calculate `percentChange` and `count` of multiple events you need to use
`aggregate`.

##### `percentChange`

This triggers when the temperature percent change between recent event and
an same event 5 hours ago is greater than 50%:
```json
{
  "condition": {
    "value": {
      "name": "temperature",
      "aggregate": {
        "type": "percentChange",
        "period": {
          "value": 5,
          "unit": "hours"
        }
      }
    },
    "comparison": "gt",
    "threshold": 50
  }
}
```

Available `period -> unit` types:
- `seconds`
- `minutes`
- `hours`
- `days`
- `events`

##### `count`

Count is used to count values with certain criteria.

This triggers when `signalStrength` from a `accelerator` was lower than 20
over the last 5 registered events:
```json
{
  "scope": {
    "event": {
      "type": "accelerator"
    }
  },
  "condition": {
    "value": {
      "name": "signalStrength",
      "aggregate": {
        "type": "count",
        "period": {
          "value": 5,
          "unit": "events"
        },
        "comparison": "lt",
        "threshold": 20,
      }
    },
    "comparison": "eq",
    "threshold": 5
  }
}
```

Note that both `threshold` and `period -> value` are 5, so it checks if 5 == 5.

##### `periodical`

When you want to setup triggers for absence of events, you need to specify
`periodical: true` on the rule so it would check for it periodically. It checks
for periodical rules every 2 minutes.

This triggers when any sensor with type `temperature` sends no (0) events over the
last 30 minutes.

```json
{
  "periodical": true,
  "scope": {
    "event": {
      "type": "temperature"
    }
  },
  "condition": {
    "value": {
      "aggregate": {
        "type": "count",
        "period": {
          "value": 30,
          "unit": "minutes"
        }
      }
    },
    "comparison": "eq",
    "threshold": 0
  }
}
```

#### Additional notes on `motion`

Since motion is the only event that has non-numerical values, here's an example
how to use a rule on it:
```json
{
  "condition": {
    "value": {
      "name": "motion"
    },
    "comparison": "eq",
    "threshold": "1",
  }
}
```

Notice that `true` is mapped with `"1"` and `false` with `"0"` (quotation marks
are important).

### Actions

`actions` is an array of actions that will be executed when the rule is
triggered.

```json
{
  "rules": [
    {
      "condition": {
        "value": {
          "name": "temperature"
        },
        "comparison": "gt",
        "threshold": 15
      },
      "actions": [
        {
          "type": "webhook",
          "url": "https://example.com"
        },
        {
          "type": "email",
          "sparkPostApiKey": "123",
          "from": "bot@sensoreventengine.com",
          "recipients": ["john.doe@example.com"],
          "subject": "Rule triggered",
          "text": "Temperature is higher than 15",
        },
      ]
    }
  ]
}
```

There are two supported action types:
- `webhook`
- `email`

#### `webhook`

Will send out a request to a `url`. The request body will include:
- `rule` object
- Serialized `Event` object (if applicable)

Supported options:
- `url` - url for the request (required)
- `method` - can be `GET`, `POST` etc. (default `POST`)
- `headers` - can add headers for authorization, etc. (default `{ 'Content-Type': 'application/json' }`)

#### `email`

Will send out emails to `recipients`.

Supported options:
- `sparkPostApiKey` - SparkPost API Key (required)
- `from` - FROM email field (required)
- `subject` - email subject
- `text` - email body
- `recipients` - an array of email recipients (required, example: `["john@example.com", "peter@example.com"]`)

## Simulations, Testing & Mocking CLI

### Simulations

You can simulate different event scenarios from console.

#### Predefined

There are a few scenarios predefined already for easy access. Run with `--help` flag to see how you can customise the scenario (for example: `yarn simulate-temperature-spike --help`)

1. `yarn simulate-temperature-spike`

Simulates linear temperature spike by default from 25C to 40C at with events 20 second intervals and peak for 1 minute.

2. `yarn simulate-temperature-crater`

Same as (1), but simulates a crater going from 25C to -10C.

3. `yarn simulate-temperature-steady-gain`

Gains temperature from 25C to 50C over 2 minutes.

4. `yarn simulate-temperature-steady-drop`

Drops temperature from 25C to -10 over 2 minutes.

5. `yarn simulate-humidity-steady-gain`

Same as (3), but for humidity.

6. `yarn simulate-humidity-steady-drop`

Same as (4), but for humidity.

7. `yarn simulate-battery-steady-drop`

Same as (4), but for battery.

8. `yarn simulate-accelerometer-spike`

Spikes all accelerator values over 2 minutes.

9. `yarn simulate-signal-strength-spike`

Spikes signal strength over 2 minutes.

10. `yarn simulate-signal-strength-drop`

Drops signal strength over 2 minutes.

#### Simulating other scenarios with `yarn simulate`

You can simulate almost any scenario with `yarn simulate` command. Here are the options:
```sh
$ yarn simulate --help

  Usage: simulate [options]

  Options:

    --event-type <eventType>           event type (default: temperature)
    --change-function <function>       value change function (default: linear)
    --normal-value <value>             normal value (default: 25)
    --normal-duration <minutes>        duration before the peak (default: 0.2)
    --peak-value <value>               peak value (default: 40)
    --peak-duration <minutes>          duration in peak (default: 1)
    --with-return-to-normal            return to normal after peak
    --signal-strength-follows          signal strength will follow normal and peak numbers
    --sensor-id <sensorId>             provide a sensorId (default: 8d239de0-bfa9-11e8-9ba0-b171289cc46d)
    --steps-till-peak <stepsTillPeak>  how many normal events leading up to the peak (default: 3)
    -h, --help                         output usage information
```

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

## Tests

There are automated tests that test rules and scopes. Run them with:
```
yarn test
```
