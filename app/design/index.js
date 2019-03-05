var gr8 = require('gr8')

var basic = gr8({
  spacing: [0, 0.25, 0.5, 1, 2, 4, 4.7 ,5],
  fontSize: [0.8, 1, 1.3, 1.5, 2, 2.4],
  lineHeight: [1],
  zIndex: [1, 2],
  breakpoints: {
    md: 600,
    bg: 800,
    lg: 1024
  },
  breakpointSelector: 'class',
})

var color = {
  prop: {
    bgc: 'background-color',
    fc: 'color'
  },
  vals: [
    { wh: 'var(--c-wh)' },
    { gy: 'var(--c-gy)' },
    { bk: '#1a1a1a' },
    { gr: 'var(--c-gr)' },
    { bl: 'var(--c-bl)' },
    { rd: 'var(--c-rd)' }
  ],
  join: '-'
}

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
    {rddb: '6px solid #D8252A'},
    {bl: '3px solid #3865A1'},
    {bldb: '6px solid #3865A1'}
  ],
  join: '-'
}

var utils = gr8({
  utils: [color, size, border],
  breakpoints: {
    md: 540,
    bg: 800,
    lg: 1024
  },
  breakpointSelector: 'class',
})

var utilcss = basic + utils
module.exports = utilcss
