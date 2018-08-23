const Sequelize = require('sequelize')
const moment = require('moment')

module.exports = (name) => ({
  type: Sequelize.DATE,
  get() {
    return moment.utc(this.getDataValue(name)).format()
  },
})
