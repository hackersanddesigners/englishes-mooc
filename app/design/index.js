var recsst = require('recsst')
var gr8 = require('gr8')

var reset = recsst.toString()

var basic = gr8({
  spacing: [0, 0.25, 0.5, 1, 2, 4],
  fontSize: [1, 1.3],
  lineHeight: [1],
  zIndex: [1, 2],
  breakpoints: {
    md: 540,
    bg: 800,
    lg: 1024
  },
  breakpointSelector: 'class',
  exclude: ['spacing', 'size', 'textColumn']
})

var size = {
  prop: [
    { w: 'width' }
  ],
  vals: [50, 90, 100],
  unit: '%'
}

var border = {
  prop: ['border', 'border-top', 'border-right', 'border-bottom', 'border-left'],
  vals: [
    {n: 'none'},
    {gr: '6px solid #0D8F5C'},
    {rd: '3px solid #D8252A'},
    {bl: '6px solid #3865A1'}
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

var type = `
  @font-face {
    font-family:"NotCourierSans";
    src:url("/assets/fonts/NotCourierSans-Bold.woff2") format("woff2"),url("/assets/fonts/NotCourierSans-Bold.woff") format("woff"),url("/assets/fonts/NotCourierSans-Bold.otf") format("opentype");
    font-style:normal;font-weight:400;
  }

  @font-face {
    font-family:"NotCourier";
    src:url("/assets/fonts/NotCourierSans.woff2") format("woff2"),url("/assets/fonts/NotCourierSans.woff") format("woff"),url("/assets/fonts/NotCourierSans.otf") format("opentype");
    font-style:normal;font-weight:400;
  }

  @font-face {
    font-family:"Graphik-Regular";
    src:url("/assets/fonts/Graphik-Regular.woff2") format("woff2"),url("/assets/fonts/Graphik-Regular.woff") format("woff"),url("/assets/fonts/Graphik-Regular.otf") format("opentype");
    font-style:normal;font-weight:400;
  }

  @font-face {
      font-family:"Graphik-RegularItalic";
      src:url("/assets/fonts/Graphik-RegularItalic.woff2") format("woff2"),url("/assets/fonts/Graphik-RegularItalic.woff") format("woff"),url("/assets/fonts/Graphik-RegularItalic.otf") format("opentype");
      font-style:normal;font-weight:400;
  }

  @font-face {
    font-family:"Tahoma";
    src:url("/assets/fonts/Tahoma.woff2") format("woff2"),url("/assets/fonts/Tahoma.woff") format("woff"),url("/assets/fonts/Tahoma.otf") format("opentype");
    font-style:normal;font-weight:400;
  }

  :root {
    --ft-rg: 'Graphik-Regular';
    --ft-it: 'Graphik-RegularItalic';
    --ft-mn: 'NotCourier';
    --ft-ph: 'Tahoma';
    --fs-1: 1rem;
    --fs-1-3: 1.3rem;
    --c-wh: #ffffff;
    --c-gy: #767676;
    --c-bk: #1a1a1a;
    --c-gr: #0D8F5C;
    --c-rd: #D8252A;
    --c-bl: #3865A1;
  }

	html {
		 width: 100%;
		 box-sizing: border-box;
		 font-size: 18px;
		 line-height: 1.2;
		 font-family: var(--ft-rg), var(--ft-ph);
		 color: var(--c-bk);
	 }
	
	body {
		-webkit-overflow-scrolling: touch;
		-ms-overflow-style: none;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	em, i {
		font-family: var(--ft-it);
	}

	strong, b {
		font-family: var(--ft-bd);
  }
  
  code, pre {
    font-family: var(--ft-mn);
  }

  .ft-bd {
    font-family: var(--ft-bd);
  }

  .ft-mn {
    font-family: var(--ft-mn);
  }	

  .fw-r {
    font-weight: 400;
  } 

  h1, h2, h3 {
		line-height: 1.2;
  }

  h1, h2, h3,
  p {
		padding-bottom: 1rem;
  }

  a,
  a:visited,
  a:hover {
		color: var(--c-bl);
	}

	button {
		font-size: inherit;
    font-family: inherit;
    border: none;
	}

	.copy-w {
		max-width: 37.5rem;
  }

  .copy blockquote {
    font-family: var(--ft-mn);
    font-size: var(--fs-1-3); 
    padding: 2rem 0 2rem 1rem;
  }

  .copy p {
    padding-bottom: 0;
  }

  .copy p + p {
    text-indent: 2rem;
  }

  .copy-tdbk a {
    color: inherit;
  }

  .bgc-wh  {
    background-color: var(--c-wh);
  }

  .mw-bt {
    min-width: 13rem;
  }

  .w90 {
    width: 90%;
  }

  .mhv-bx {
    max-height: 80vh;
  }

  .l50 {
    left: 50%;
  }

  .ttxc {
    transform: translate(-50%);
  }

  @media screen and (min-width: 540px) {
    .md-mgr2 {
      margin-right: 2rem;
    }
  }

  @media screen and (min-width: 700px) {
    .sm-w60 {
      width: 60%;
    }
  }

  @media screen and (min-width: 800px) {
    .md-w40 {
      width: 40%;
    }

    .md-la {
      left: auto;
    }

    .md-ttx0 {
      transform: translate(0);
    }
  }

  .sh-a {
    filter: drop-shadow(0px 0px 5px var(--c-gy));
  }

  .iframe-container {
    overflow: hidden;
    position: relative;
    padding-bottom: 56.25%;
  }

  .iframe-container iframe {
    border: 0;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
`

var utilcss = reset + basic + utils + type
module.exports = utilcss
