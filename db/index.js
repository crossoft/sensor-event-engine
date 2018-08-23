const Sequelize = require('sequelize')
const dateTimeColumn = require('./helpers/dateTimeColumn')

const db = new Sequelize('db', null, null, {
  dialect: 'sqlite',
  storage: './db.sqlite',
  operatorsAliases: false,
  pool: {
    max: 100,
  },
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

db.sync({ force: true })

module.exports = {
  Sensor,
  Event,
  Reading,
  db,
}
