const fs = require('fs')

const autoprefixer = require('gulp-autoprefixer')
const archiver = require('archiver')
const bump = require('gulp-bump')
const babelify = require('babelify')
const browserify = require('browserify')
const buffer = require('vinyl-buffer')
const clean = require('gulp-clean')
const concat = require('gulp-concat')
const cssnano = require('gulp-cssnano')
const fileinclude = require('gulp-file-include')
const gulp = require('gulp')
const less = require('gulp-less')
const notify = require('gulp-notify')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')
const shell = require('gulp-shell')
const source = require('vinyl-source-stream')
const uglify = require('gulp-uglify')
const zip = require('gulp-zip')
const html2js = require('html2js-browserify')
const injectVersion = require('gulp-inject-version')

const app = './app/'
const dist = './dist/'
const browserSync = require('browser-sync').create()


// Error / Success Handling
const onError = function (err) {
    notify.onError({
        title: 'Error: ' + err.plugin,
        subtitle: '<%= file.relative %>',
        message: '<%= error.message %>',
        sound: 'Beep',
        icon: app + 'images/icons/icon48.png',
    })(err)
    console.log(err.toString())
    this.emit('end')
}

function onSuccess (msg) {
    return {
        message: msg + ' Complete! ',
        // sound:     "Pop",
        icon: app + 'images/icons/icon48.png',
        onLast: true,
    }
}

// function notifyFunc (msg) {
//     return gulp.src('.', { read: false })
//        .pipe(notify(onSuccess(msg)))
// }

// HTML / TPL Pages
const htmlFiles = app + 'layouts/*.html'
const tplFiles = app + 'includes/*.tpl'

gulp.task('html', function (done) {
    return gulp.src(htmlFiles)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(fileinclude({ prefix: '@@', basepath: '@file' }))
        .pipe(injectVersion({
            replace: /%%GULP_INJECT_VERSION%%/g,
        }))
        .pipe(gulp.dest(dist))
        .pipe(notify(onSuccess('HTML')))
})


// styles: Compile and Minify Less / CSS Files
const lessWatchFolder = app + 'styles/**/*.less'
const lessSrcFile = app + 'styles/etherwallet-master.less'
const lessDestFolder = dist + 'css'
const lessDestFile = 'etherwallet-master.css'
const lessDestFileMin = 'etherwallet-master.min.css'

gulp.task('styles', function () {
    return gulp.src(lessSrcFile)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(less({ compress: false }))
        .pipe(autoprefixer({ browsers: ['last 4 versions', 'iOS > 7'], remove: false }))
        .pipe(rename(lessDestFile))
        // .pipe( gulp.dest   (  lessDestFolder                                         )) // unminified css
        .pipe(cssnano({ autoprefixer: false, safe: true }))
        .pipe(rename(lessDestFileMin))
        .pipe(gulp.dest(lessDestFolder))
        .pipe(notify(onSuccess('Styles')))
})

// js: Browserify
const jsWatchFolder = app + 'scripts/**/*.{js,json,html}'
const jsSrcFile = app + 'scripts/main.js'
const jsDestFolder = dist + 'js/'
const jsDestFile = 'etherwallet-master.js'
const browseOpts = { debug: true } // generates inline source maps - only in js-debug
const babelOpts = {
    presets: ['es2015'],
    compact: false,
    global: true,
}

function bundleJS (bundler) {
    return bundler.bundle()
        .pipe(plumber({ errorHandler: onError }))
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(rename(jsDestFile))
        .pipe(gulp.dest(jsDestFolder))
        .pipe(notify(onSuccess('JS')))
}

function bundleJSDebug (bundler) {
    return bundler.bundle()
        .pipe(plumber({ errorHandler: onError }))
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(rename(jsDestFile))
        .pipe(gulp.dest(jsDestFolder))
        .pipe(notify(onSuccess('JS')))
}


gulp.task('js', function (done) {
    const bundler = browserify(jsSrcFile).transform(babelify).transform(html2js)
    bundleJS(bundler)
    done()
})

gulp.task('js-production', function (done) {
    const bundler = browserify(jsSrcFile).transform(babelify, babelOpts).transform(html2js)
    bundleJS(bundler)
    done()
})

gulp.task('js-debug', function (done) {
    const bundler = browserify(jsSrcFile, browseOpts).transform(babelify, babelOpts).transform(html2js)
    bundleJSDebug(bundler)
    done()
})


// Rebuild Static JS
const jsSrcFilesStatic = app + 'scripts/staticJS/to-compile-to-static/*.js'
const jsDestFolderStatic = app + 'scripts/staticJS/'
const jsDestFileStatic = 'etherwallet-static.min.js'

gulp.task('staticJS', function () {
    return gulp.src(jsSrcFilesStatic)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(concat(jsDestFileStatic))
        .pipe(uglify())
        .pipe(gulp.dest(jsDestFolderStatic))
        .pipe(notify(onSuccess('StaticJS')))
})


// Copy
const imgSrcFolder = app + 'images/**/*'
const fontSrcFolder = app + 'fonts/*.*'
const jsonFile = app + '*.json'
const trezorFile = app + 'scripts/staticJS/trezor-connect.js'
const jQueryFile = app + 'scripts/staticJS/jquery-1.12.3.min.js'
const bin = app + '/bin/*'
const staticJSSrcFile = jsDestFolderStatic + jsDestFileStatic
const readMe = './README.md'


gulp.task('copy', gulp.series('staticJS', function (done) {
    gulp.src(imgSrcFolder)
        .pipe(gulp.dest(dist + 'images'))

    gulp.src(fontSrcFolder)
        .pipe(gulp.dest(dist + 'fonts'))

    gulp.src(staticJSSrcFile)
        .pipe(gulp.dest(dist + 'js'))

    gulp.src(jQueryFile)
        .pipe(gulp.dest(dist + 'js'))

    gulp.src(trezorFile)
        .pipe(gulp.dest(dist + 'js'))

    gulp.src(jsonFile)
        .pipe(gulp.dest(dist))

    gulp.src(readMe)
        .pipe(gulp.dest(dist))

    gulp.src(bin)
        .pipe(gulp.dest(dist + 'bin'))
        .pipe(notify(onSuccess(' Copy ')))
    done()
}))


// Clean files that get compiled but shouldn't
gulp.task('clean', function () {
    return gulp.src([
            dist + 'cx-wallet.html',
            dist + 'images/icons',
            dist + 'manifest.json',
        ], { read: false })
        .pipe(plumber({ errorHandler: onError }))
        .pipe(clean())
        .pipe(notify(onSuccess(' Clean ')))
})


// Bumps Version Number
function bumpFunc (done, t) {
    gulp.src(['./app/package.json', './app/manifest.json'])
        .pipe(plumber({ errorHandler: onError }))
        .pipe(bump({ type: t }))
        .pipe(gulp.dest('./app'))
        .pipe(notify(onSuccess('Bump ' + t)))
    gulp.src(['./package.json'])
        .pipe(plumber({ errorHandler: onError }))
        .pipe(bump({ type: t }))
        .pipe(gulp.dest('./'))
        .pipe(notify(onSuccess('Bump ' + t)))
    done()
}

// Get Version Number
let versionNum
let versionMsg
gulp.task('getVersion', function (done) {
    manifest = JSON.parse(fs.readFileSync(app + 'manifest.json'))
    versionNum = 'v' + manifest.version
    versionMsg = 'Release: ' + versionNum
        // return gulp.src( './' )
        // .pipe( notify ( onSuccess('Version Number ' + versionNum ) ))
    done()
})


// zips dist folder
gulp.task('zip', gulp.series('getVersion', function () {
    return gulp.src(dist + '**/**/*')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(rename(function (path) {
          path.dirname = './wanwallet-' + versionNum + '/' + path.dirname
        }))
        .pipe(zip('./wanwallet-' + versionNum + '.zip'))
        .pipe(gulp.dest('./releases/'))
        .pipe(notify(onSuccess('Zip Dist ' + versionNum)))
}))


function archive () {
  const outputZip = fs.createWriteStream(path.join(__dirname, 'example.zip'))
  const archiveZip = archiver('zip', {
      gzip: true,
  })
  outputZip.on('close', function () {
    console.log(archiveZip.pointer() + ' total bytes')
    console.log('archiver has been finalized and the output file descriptor has closed.')
  })
  archiveZip.on('error', function (err) {
    throw err
  })
  archiveZip.pipe(outputZip)
  archiveZip.directory(dist, 'test2')
  archiveZip.finalize()


  const outputTar = fs.createWriteStream(path.join(__dirname, 'example.tgz'))
  const archiveTar = archiver('tar', {
      gzip: true,
  })
  outputTar.on('close', function () {
    return gulp.src(archiveTar).pipe(onSuccess('Archive Complete: Tar, /dist'))
  })
  archiveTar.on('error', function (err) {
    throw err
  })
  archiveTar.pipe(outputTar)
  archiveTar.directory(dist, 'test2')
  archiveTar.finalize()

}


gulp.task('travisZip', gulp.series('getVersion', function () {
    return gulp.src(dist + '**/**/*')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(rename(function (path) {
          path.dirname = './wanwallet-' + versionNum + '/' + path.dirname
        }))
        .pipe(zip('./wanwallet-' + versionNum + '.zip'))
        .pipe(gulp.dest('./deploy/'))
        .pipe(notify(onSuccess('Zip Dist ' + versionNum)))
}))


// add all
gulp.task('add', function () {
    return gulp.src('*.js', { read: false })
        .pipe(shell([
            'git add -A',
        ]))
        // .pipe( notify ( onSuccess('Git Add' ) ))
})

// commit with current v# in manifest
gulp.task('commit', gulp.series('getVersion', function () {
    return gulp.src('*.js', { read: false })
        .pipe(shell([
            'git commit -m "Rebuilt and cleaned everything. Done for now."',
        ]))
        .pipe(notify(onSuccess('Commit')))
}))

// commit with current v# in manifest
gulp.task('commitV', gulp.series('getVersion', function () {
    return gulp.src('*.js', { read: false })
        .pipe(shell([
            'git commit -m " ' + versionMsg + ' "',
        ]))
        .pipe(notify(onSuccess('Commit w ' + versionMsg)))
}))

// tag with current v# in manifest
gulp.task('tag', gulp.series('getVersion', function () {
    return gulp.src('*.js', { read: false })
        .pipe(shell([
            'git tag -a ' + versionNum + ' -m " ' + versionMsg + '"',
        ]))
        .pipe(notify(onSuccess('Tagged Commit' + versionMsg)))
}))

// Push Release to Mercury
gulp.task('push', gulp.series('getVersion', function () {
    return gulp.src('*.js', { read: false })
        .pipe(shell([
            'git push origin mercury ' + versionNum,
        ]))
        .pipe(notify(onSuccess('Push')))
}))

// Push Live
// Pushes dist folder to gh-pages branch
gulp.task('pushlive', gulp.series('getVersion', function () {
    return gulp.src('*.js', { read: false })
        .pipe(shell([
            'git subtree push --prefix dist origin gh-pages',
        ]))
        .pipe(notify(onSuccess('Push Live')))
}))

// Prep & Release
// gulp prep
// gulp bump   or gulp zipit
// gulp commit
// git push --tags
// gulp pushlive ( git subtree push --prefix dist origin gh-pages )

gulp.task('watchJS', function () { return gulp.watch(jsWatchFolder, gulp.series('js')).on('change', browserSync.reload) })
gulp.task('watchJSDebug', function () { gulp.watch(jsWatchFolder, gulp.series('js-debug')) })
gulp.task('watchJSProd', function () { gulp.watch(jsWatchFolder, gulp.series('js-production')) })
gulp.task('watchLess', function () { gulp.watch(lessWatchFolder, gulp.series('styles')) })
gulp.task('watchPAGES', function () { gulp.watch(htmlFiles, gulp.series('html')) })
gulp.task('watchTPL', function () { gulp.watch(tplFiles, gulp.series('html')) })

gulp.task('bump-major', function (done) { return bumpFunc(done, 'major') })
gulp.task('bump-minor', function (done) { return bumpFunc(done, 'minor') })
gulp.task('bump', function (done) { return bumpFunc(done, 'patch') })

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'dist',
        },
    })
})

gulp.task('archive', function () { return archive() })

gulp.task('prep', gulp.series('js-production', 'html', 'styles', 'copy', function (done) { done() }))

gulp.task('zipit', gulp.series('clean', 'zip'))

gulp.task('commit', gulp.series('add', 'commitV', 'tag'))

gulp.task('watch', gulp.series('browserSync', 'watchJS', 'watchLess', 'watchPAGES', 'watchTPL', function (done) { done() }))
gulp.task('watchProd', gulp.series('watchJSProd', 'watchLess', 'watchPAGES', 'watchTPL', function (done) { done() }))

gulp.task('build', gulp.series('js', 'html', 'styles', 'copy'), function (done) { done() })
gulp.task('build-debug', gulp.series('js-debug', 'html', 'styles', 'watchJSDebug', 'watchLess', 'watchPAGES', 'watchTPL'))

gulp.task('default', gulp.series('build', 'watch'), function (done) { done() })
