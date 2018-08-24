const _ = require('lodash')
const Table = require('cli-table2')

const toRow = (row) => _.values(_.map(row, _.toString))

module.exports = (head, rows) => {
  if (_.isEmpty(rows)) return '> The table is empty.'

  const table = new Table({ head })
  _.each(rows, row => table.push(toRow(row)))
  return table.toString()
}
