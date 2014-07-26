var EventEmitter = require('events').EventEmitter
  , inherits = require('inherits')
  , AsyncCache = require('async-cache')

module.exports = Sugg

function Sugg(options, listener) {
  if (!(this instanceof Sugg)) return new Sugg(options, listener)
  EventEmitter.call(this)
  options = options || {}

  this.wait = options.wait || 300

  if (listener) this.on('result', listener)

  this._cache = new AsyncCache(options)

  this._idle = true
  this._query = null
  this._result = null

  this._onTimeout = this._onTimeout.bind(this)
  this._onCacheCallback = this._onCacheCallback.bind(this)
}
inherits(Sugg, EventEmitter)

Sugg.prototype.update = function (query) {
  if (this._query === query) return

  if (this.timeout) {
    clearTimeout(this.timeout)
    this.timeout = null
  }

  this._query = query

  if (this._cache.has(query)) {
    this._onResult(this._cache.peek(query))

  } else {
    if (this._idle) {
      this.emit('wait')
      this._idle = false
    }

    this.timeout = setTimeout(this._onTimeout, this.wait)
  }
}

Sugg.prototype._onTimeout = function () {
  this.timeout = null
  this._loading++
  this._cache.get(this._query, this._onCacheCallback.bind(this, this._query))
}

Sugg.prototype._onCacheCallback = function (query, err, result) {
  if (err) this.emit('error', err)
  if (query !== this._query) return
  this._onResult(result)
}

Sugg.prototype._onResult = function (result) {
  this.emit('idle')
  this._idle = true
  this._result = result
  this.emit('result', result)
}

Sugg.prototype.get = function (query, cb) {
  if (this._idle && this._query === query) return cb(this._result)
  this.once('result', cb)
  this.update(query)
}
