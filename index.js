var minq = require('minq')
var minqVer = require('minq/package.json').version
var mr = require('commander')
var repl = require('repl')
var _ = require('lodash')
var lug = require('lug')
var Q = require('q')
var vm = require('vm')
var maskurl = require('maskurl')

mr.version(minqVer)
  .usage('[options] <connectionString>')
  .option('-v, --verbose', 'output additional query information')
  ._name = 'minq'

mr.options[0].description = 'output minq version number'


mr.command('*')
  .action(function (connStr) {
    console.log('minq repl - minq version ' + minqVer + ' - `help()` for commands')
    process.stdout.write('connecting to ' + maskurl(connStr) + ' ... ')

    var env = {
      minq: minq,
      __: _,
      Q: Q,
      help: cmd.help,
      lug: lug
    }

    minq.connect(connStr).done()

    minq.getCollections().then(function (cols) {
      console.log('connected')

      if (mr.verbose) {
        minq.verbose = true
      }

      env.db = cols.reduce(function (cols, col) {
        Object.defineProperty(cols, col, {
          get: function () {
            return minq.from(col)
          }
        })
        return cols
      }, {})

      var session = repl.start({
        prompt: '> ',
        ignoreUndefined: true,
        eval: function (code, context, file, cb) {
          var res, err
          try {
            res = vm.runInContext(code, context, file)
          } catch (e) {
            return cb(e)
          }

          if (Q.isPromiseAlike(res)) {
            var notice = setTimeout(function () {
              console.log('running...')
            }, 20)
            res.then(function (val) {
              clearTimeout(notice)
              cb(null, val)
            }, function (err) {
              clearTimeout(notice)
              cb(err)
            })
          } else {
            cb(null, res)
          }

        }
      })
      _.extend(session.context, env)

      session.on('exit', function () {
        process.exit()
      })

    })
    

  })

var cmd = {
  help: function () {
    console.log('see minq readme at https://npm.im/minq')
  }
}

mr.parse(process.argv)

if (!mr.args.length) {
  mr.help()
}