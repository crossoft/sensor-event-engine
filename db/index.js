const Sequelize = require('sequelize')
const dateTimeColumn = require('./helpers/dateTimeColumn')

const db = new Sequelize('db', null, null, {
  dialect: 'sqlite',
  storage: './db/db.sqlite',
  operatorsAliases: false,
  logging: process.env.SQL_LOGGING === 'false' ? false : console.log,
  retry: {
    max: 10,
  },
})

const Device = db.define('device', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: Sequelize.STRING,
  createdAt: dateTimeColumn('createdAt'),
})

const Sensor = db.define('sensor', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  externalId: {
    type: Sequelize.STRING,
  },
  createdAt: dateTimeColumn('createdAt'),
})

Device.hasMany(Sensor)
Sensor.belongsTo(Device)

const Event = db.define('event', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: Sequelize.STRING,
  dateTime: dateTimeColumn('dateTime'),
  createdAt: dateTimeColumn('createdAt'),
})

Sensor.hasMany(Event)
Event.belongsTo(Sensor)

const Reading = db.define('reading', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: Sequelize.STRING,
  value: Sequelize.STRING,
}, {
  timestamps: false,
})

Event.hasMany(Reading)
Reading.belongsTo(Event)

const Zone = db.define('zone', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: Sequelize.STRING,
})

Zone.hasMany(Sensor)
Sensor.belongsTo(Zone)

Sensor.hasMany(Event)
Event.belongsTo(Sensor)

const Trigger = db.define('trigger', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rule: Sequelize.STRING,
})

db.sync()

module.exports = {
  Sensor,
  Event,
  Reading,
  Device,
  Zone,
  Trigger,
  db,
}
