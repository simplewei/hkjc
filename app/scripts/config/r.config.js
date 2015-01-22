require.config({
  // make components more sensible
  // expose jquery 
  baseUrl: '/',
  urlArgs: (new Date).getTime(), // Todo: just for testing
  paths: {
    'bower_components': '../bower_components',
    'text': '../bower_components/requirejs-text/text',
    'zepto': '../bower_components/zeptojs/dist/zepto',
    'backbone': '../bower_components/backbone/backbone',
    'underscore': '../bower_components/underscore/underscore',
    'iscroll': '../bower_components/iscroll/build/iscroll',
    'queryString': '../bower_components/query-string/query-string',
    'qrcode': '../bower_components/qrcodejs/qrcode.min',
    'html2canvas': '../bower_components/html2canvas/build/html2canvas',
    'widgets': 'scripts/widgets',
    'modules': 'scripts/modules'
  },
  shim:{
    zepto: {
      exports: '$'
    },
    iscroll: {
      exports: 'IScroll'
    },
    qrcode: {
      exports: 'QRCode'
    },
    html2canvas: {
      exports: 'html2canvas'
    }
  },
  map:{
    '*': {
      jquery: 'zepto'
    }
  }
});
