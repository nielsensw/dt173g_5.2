// Plugins
// För att kunna använda gulp
const gulp = require('gulp');
// För att kunna använda plugin
const babel = require('gulp-babel');
// För att kunna använda plugin
const plumber = require('gulp-plumber');
// För att kunna använda plugin
const browsersync = require('browser-sync');
// För att kunna använda plugin
const concat = require('gulp-concat');
// För att kunna använda plugin
const cleanCSS = require('gulp-clean-css');
// För att kunna använda plugin
const minify = require('gulp-uglify');
// För att kunna använda plugin
const sass = require('gulp-sass');
// ------------- Sökvägar ----------------------
// Sökväg för watch-task, alla html-filer i src mappen
const htmlPath = './src/**/index.html';
// Sökväg för watch-task, alla filer i css-mappen förutom style.css
const sassPath = './src/sass/**/*.scss';
// Sökväg för watch-task, style.css
const cssStylePath = './src/css/**/style.css';
// Sökväg för watch-task, alla filer i js-mappen förutom main.js
const jsPath = './src/js/**/!(main.js)';
// Sökväg för watch-task, main.js
const jsMainPath = './src/js/**/main.js';

//----------------------------------------------


// --------------- Funktioner ---------------------------------------
// skapar en public-mapp med filer från src-mappen
function buildSite() {

// Skapar kopior av .html-filer och lägger dessa i public-mappen
  htmlCopy();

// Kallar på funktionen för att kompilera sass till css-fil
  sassToCss();
// Kallar på funktion för att minimera css-filer
  cssMinify()

// Kallar på funktionen för att slå ihop js-filer
  jsConcat();
// Skapar kopia av main.js och lägger in i public-mappen
  jsMinify();

};
//-----------

function htmlCopy (){
  // Skapar kopior av .html-filer och lägger dessa i public-mappen
 return gulp.src('./src/index.html')
     .pipe(gulp.dest('./pub/'));
}

// --------------------- CSS & SASS
function sassToCss(){

  return gulp.src('./src/sass/**/*.scss')
  .pipe(sass())
  .pipe(concat('style.css'))
  .pipe(gulp.dest('./src/css'));
};

//---------
// Minifierar css till en mindre fil och lägger den i public-mappen
function cssMinify(){
  console.log('Minimizing CSS files');

  return gulp.src('./src/css/style.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./pub/css/'));
};
//---------------------

// --------------------- JS
// Slår ihop js.filer till en enda fil vid namn main.js och minimerar den till main-min.js
function jsConcat(){
  console.log('Merging JS files...');

  return gulp.src('./src/js/**/!(main.js)')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./src/js/'));

  
};
//---------
// Minifierar js till en mindre fil och lägger den i public-mappen
function jsMinify(){
  console.log('Minimizing JS files');

  return gulp.src('./src/js/main.js')
  .pipe(plumber())
  .pipe(babel({ presets: [
    ['@babel/env', {
      modules: false
    }]
  ]
  }))
   .pipe(minify())
   .pipe(gulp.dest('./pub/js/'));
};
//--------------------------



// --------------------- WATCH TASKS & Browsersync
// Kollar efter ändringar och uppdaterar om true
function watchThese(){
  
  browsersync.init({
    server: {
      baseDir: './pub/'
    }
  })
  // Ändringar i html-fil i src mappen
  gulp.watch([htmlPath], gulp.series(htmlCopy)).on('change', browsersync.reload);
  // Ändringar i main.js src-mappen
  gulp.watch([jsMainPath], gulp.series(jsMinify)).on('change', browsersync.reload);
  // Ändringar i CSS-mappen i src-mappen (ej style.css)
  gulp.watch([sassPath], gulp.series(sassToCss)).on('change', browsersync.reload);
  // Ändringar i style.css i src-mappen
  gulp.watch([cssStylePath], gulp.series(cssMinify)).on('change', browsersync.reload);
  // Ändringar i JS-mappen i src-mappen
  gulp.watch([jsPath], gulp.series(jsConcat)).on('change', browsersync.reload);
  // Ändringar i main.js src-mappen
  gulp.watch([jsMainPath], gulp.series(jsMinify)).on('change', browsersync.reload);


 };
//----------------------------------------------------------------------


//------------------------ Exporterar -----------------------
  exports.sassToCss = sassToCss;
  exports.watchThese = watchThese;
  exports.buildSite = buildSite;
  exports.default = gulp.parallel(sassToCss, buildSite, watchThese);