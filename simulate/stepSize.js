module.exports = ({ normalValue, peakValue, stepsTillPeak }) => (
  (peakValue - normalValue) / stepsTillPeak
)
