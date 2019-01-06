var gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    sourcemaps = require("gulp-sourcemaps"),
    browserSync = require("browser-sync").create();

// Put this after including our dependencies
var paths = {
    styles: {
        // TYelling gulp to check all scss folder for any sass files
        src: "app/scss/*.scss",
        // Compiled files will end up in whichever folder it's found in (partials are not compiled)
        dest: "app/css"
    }
 
    // Easily add additional paths
    // ,html: {
    //  src: '...',
    //  dest: '...'
    // }
};

// Define tasks after requiring dependencies
function style() {
    // Start with the source of the sass files
    return (
        gulp
            .src(paths.styles.src)
            // Initialize sourcemaps before compilation starts
            .pipe(sourcemaps.init())
            // Use sass with the files found, and log any errors
            .pipe(sass())
            .on("error", sass.logError)
            // Use postcss with autoprefixer and compress the compiled file using cssnano
            .pipe(postcss([autoprefixer(), cssnano()]))
            // Now add/write the sourcemaps
            .pipe(sourcemaps.write())
            // The destination for the compiled files
            .pipe(gulp.dest(paths.styles.dest))
            // Add browsersync stream pipe after compilation
            .pipe(browserSync.stream())
    );
}
 
// Expose the task by exporting it
// This allows me to run it from the commandline using
// $ gulp style
exports.style = style;

// A simple task to reload the page
function reload() {
    browserSync.reload();
}

function watch(){

    browserSync.init({
        // You can tell browserSync to use this directory and serve it as a mini-server
        server: {
            baseDir: "app"
        }
        // If you are already serving your website locally using something like apache
        // You can use the proxy setting to proxy that instead
        // proxy: "yourlocal.dev"
    });
    
    // gulp.watch takes in the location of the files to watch for changes
    // and the name of the function we want to run on change
    gulp.watch(paths.styles.src, style)

    // Watch the main index file
    gulp.watch('app/index.html', reload);
}
    
// Don't forget to expose the task!
exports.watch = watch