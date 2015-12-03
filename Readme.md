# Sugg

[![Version npm](https://img.shields.io/npm/v/sugg.svg?style=flat-square)](https://www.npmjs.com/package/sugg)[![npm Downloads](https://img.shields.io/npm/dm/sugg.svg?style=flat-square)](https://www.npmjs.com/package/sugg)[![Build Status](https://img.shields.io/travis/tellnes/sugg/master.svg?style=flat-square)](https://travis-ci.org/tellnes/sugg)[![Dependencies](https://img.shields.io/david/tellnes/sugg.svg?style=flat-square)](https://david-dm.org/tellnes/sugg)[![Tips](http://img.shields.io/gratipay/tellnes.png?style=flat-square)](https://gratipay.com/~tellnes/)

Sugg debounces the input, load and caches the results, and emit `result` events when there is
new results.

## Example

```js
var Sugg = require('sugg')

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
```

## Usage

```js
var Sugg = require('sugg')

var sugg = new Sugg({ wait: 200, load: load, maxAge: 1000*60*5, max: 100 })
function load(query, cb) {
  $.ajax(
      { url: 'http://localhost:9200/_suggest'
      , data: JSON.stringify(
        { 'suggestion':
          { 'text': query
          , 'completion':
            { 'field': 'suggest'
            }
          }
        })
      , dataType: 'json'
      , error: function (xhr, status, err) {
          cb(err)
        }
      , success: function (data) {
          cb(null, data)
        }
      }
    )
}

sugg.on('wait', function () {
  // show loader
})

sugg.on('idle', function () {
  // hide loader
})

sugg.on('result', function (suggestions) {
  // update suggestions html
})

sugg.on('error', function (err) {
  // handle error
})
```

## Options

- `wait` Number of milliseconds to wait for following update before executing
  the load function. Defaults to `300`

- `load` Method to load results if it's not in the cache.
 Please see
  [async-cache](https://www.npmjs.org/package/async-cache)
  for details.

- `max` The maximum size of the cache. Defaults to `Infinity`.

- `maxAge` Maximum age in ms. Items are not pro-actively pruned out as they age,
  but if you try to get a result that is too old, it'll drop it and reload it
  before giving it to you.

The options object is passed directly to the underlying cache object, so all options for
[async-cache](https://www.npmjs.org/package/async-cache)
and
[lru-cache](https://www.npmjs.org/package/lru-cache)
is also available.


## Install

    npm install sugg

## License

MIT
