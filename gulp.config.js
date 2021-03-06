module.exports = function() {
  var client = './src/client/';
  var clientApp = client + 'app/';
  var server = './src/server/';
  var temp = './tmp/';

  var config = {

    // Files paths
    alljs: [
      './src/**/*.js',
      './*.js'
    ],
    build: './build/',      //.prod    //  .dist
    client: client,
    css: temp + 'styles.css',
    fonts: './bower_components/font-awesome/fonts/**/*.*',
    htmltemplates: clientApp + '**/*.html',
    images: client + 'images/**/*.*',
    index: client + 'index.html',
    js: [
      clientApp + '**/*.module.js',            // Load these
      clientApp + '**/*.js',
      '!' + clientApp + '**/*.spec.js'          // Exclude these
    ],
    less: client + 'styles/styles.less',
    server: server,
    temp:'./tmp/',

    // Template cache
    templateCache: {
      file: 'templates.js',
      options: {
        module: 'app.core',
        standAlone: false,
        root: 'app/'
      }
    },

    // Bower and NPM locations
    bower: {
      json: require('./bower.json'),
      directory: './bower_components/',
      ignorePath: '../..'
    },

    //Node settings
    defaultPort: 7203,
    nodeServer: './src/server/app.js'
  };

  config.getWiredepDefaultOptions = function() {
    var options = {
      bowerJson: config.bower.json,
      directory: config.bower.directory,
      ignorePath: config.bower.ignorePath
    };
    return options;
  };

  return config;
};
