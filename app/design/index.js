var gr8 = require('gr8')


var root = `
:root {
  --ft-rg: 'Graphik-Regular';
  --ft-it: 'Graphik-RegularItalic';
  --ft-mn: 'NotCourier';
  --ft-ph: 'Tahoma';
  --fs-1: 1rem;
  --fs-1-3: 1.3rem;
  --c-wh: #ffffff;
  --c-gy: #e6e5e6;
  --c-gk: #807f80;
  --c-bk: #1a1a1a;
  --c-gr: #0d8f5c;
  --c-rd: #d8252a;
  --c-bl: #3865a1;
}
`

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
    { gk: 'var(--c-gk)' },
    { bk: 'var(--c-bk)' },
    { gr: 'var(--c-gr)' },
    { rd: 'var(--c-rd)' },
    { bl: 'var(--c-bl)' }
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
    {bldb: '6px solid #3865A1'},
    {bk: '1px solid var(--c-bk)'}
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

var utilcss = root + basic + utils
module.exports = utilcss
