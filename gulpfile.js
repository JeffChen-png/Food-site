const gulp = require("gulp");
const webpack = require("webpack-stream");
const sass        = require('gulp-sass')(require('sass'));
const autoprefixer = require("autoprefixer");
const cleanCSS = require("gulp-clean-css");
const postcss = require("gulp-postcss");
const browsersync = require("browser-sync");

gulp.task("build-js", () => {
    return gulp.src("./js/main.js")
                .pipe(webpack({
                    mode: 'development',
                    output: {
                        filename: 'script.js'
                    },
                    watch: false,
                    devtool: "source-map",
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    debug: true,
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest('/js'))
                .pipe(browsersync.stream());
});

gulp.task('build-sass', function() {
  return gulp.src("./scss/**/*.scss")
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      // .pipe(rename({suffix: '.min', prefix: ''}))
      // .pipe(autoprefixer())
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(gulp.dest("./css"))
      .pipe(browsersync.stream());
});

gulp.task("copy-assets", () => {
    gulp.src("./icons/**/*.*")
        .pipe(gulp.dest("/icons"));

    return gulp.src("./img/**/*.*")
                .pipe(gulp.dest("/img"))
                .pipe(browsersync.stream());
});

gulp.task("watch", () => {
    browsersync.init({
		server: "./",
		port: 4000,
		notify: true
    });

    gulp.watch("./icons/**/*.*", gulp.parallel("copy-assets"));
    gulp.watch("./img/**/*.*", gulp.parallel("copy-assets"));
    gulp.watch("./scss/**/*.scss", gulp.parallel("build-sass"));
    gulp.watch("./js/**/*.js", gulp.parallel("build-js"));
});

gulp.task("build", gulp.parallel("copy-assets", "build-sass", "build-js"));

gulp.task("prod", () => {
    gulp.src("./index.html")
        .pipe(gulp.dest("./"));
    gulp.src("./img/**/*.*")
        .pipe(gulp.dest("/img"));
    gulp.src("./icons/**/*.*")
        .pipe(gulp.dest("/icons"));

    gulp.src("./js/main.js")
        .pipe(webpack({
            mode: 'production',
            output: {
                filename: 'script.js'
            },
            module: {
                rules: [
                  {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                      loader: 'babel-loader',
                      options: {
                        presets: [['@babel/preset-env', {
                            debug: false,
                            corejs: 3,
                            useBuiltIns: "usage"
                        }]]
                      }
                    }
                  }
                ]
              }
        }))
        .pipe(gulp.dest('/js'));
    
    return gulp.src("./scss/style.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(cleanCSS())
        .pipe(gulp.dest('/css'));
});

gulp.task("default", gulp.parallel("watch", "build"));