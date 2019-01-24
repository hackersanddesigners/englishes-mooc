var recsst = require('recsst')
var gr8 = require('gr8')

var reset = recsst.toString()

var basic = gr8({
  spacing: [0, 0.25, 0.5, 1, 2, 4],
  fontSize: [0.8, 1, 1.3],
  lineHeight: [1],
  zIndex: [1, 2],
  breakpoints: {
    md: 540,
    bg: 800,
    lg: 1024
  },
  breakpointSelector: 'class',
})

var size = {
  prop: [
    { w: 'width',
      h: 'height'
    }
  ],
  vals: [50, 90, 100],
  join: '-',
  unit: '%'
}

var border = {
  prop: ['border', 'border-top', 'border-right', 'border-bottom', 'border-left'],
  vals: [
    {n: 'none'},
    {gr: '3px solid #0D8F5C'},
    {grdb: '6px solid #0D8F5C'},
    {rd: '3px solid #D8252A'},
    {bl: '3px solid #3865A1'},
    {bldb: '6px solid #3865A1'}
  ],
  join: '-'
}

var utils = gr8({
  utils: [size, border],
  breakpoints: {
    md: 540,
    bg: 800,
    lg: 1024
  },
  breakpointSelector: 'class',
})

var utilcss = reset + basic + utils
module.exports = utilcss
