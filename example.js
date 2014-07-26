var Sugg = require('./')

var sugg = new Sugg({ wait: 300, load: load })
function load(query, cb) {
  setTimeout(function () {
    cb(null, 'results for ' + query)
  }, 200)
}

sugg.on('wait', function () {
  console.log('wait')
})

sugg.on('idle', function () {
  console.log('idle')
})

sugg.on('result', function (result) {
  console.log(result) // outputs `results for hello world` after 500ms (300 + 200)
})

sugg.update('hello world')
