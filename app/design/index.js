var recsst = require('recsst')
var gr8 = require('gr8')

var reset = recsst.toString()

var utils = gr8({
  spacing: [0, 0.25, 0.5, 1, 2, 4],
  fontSize: [1, 2],
  lineHeight: [1],
  zIndex: [1, 2],
  breakpoints: {
    md: 540,
  },
  breakpointSelector: 'class'
})

var size = {
  prop: {
    w: 'width'
  },
  vals: [50, 90, 100]
}

var css = gr8({
  utils: [size]
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

  :root {
    --ft-rg: 'Graphik-Regular';
    --ft-it: 'Graphik-RegularItalic';
    --ft-mn: 'NotCourier';
    --c-bk: #1a1a1a;
    --c-gy: #767676;
    --c-wh: #ffffff;
    --c-bl: blue;
  }

	html {
		 width: 100%;
		 box-sizing: border-box;
		 font-size: 18px;
		 line-height: 1.2;
		 font-family: var(--ft-rg);
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

  .ft-mn {
    font-family: var(--ft-mn);
  }

	h1, h2, h3 {
    font-family: var(--ft-bd);
		font-size: 18px;
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

	.copy {
		max-width: 37.5rem;
  }

  .copy p {
    padding-bottom: 0;
  }

  .copy p + p {
    text-indent: 2rem;
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
`

module.exports = reset + utils + type
