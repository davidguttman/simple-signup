var h = require('hyperscript')
var Authentic = require('authentic-client')
var xtend = require('xtend')
var Wildemitter = require('wildemitter')

var renderForm = require('./form')

var ls = window.localStorage

var keyPrefix = 'ss_'

var SimpleSignup = module.exports = function (opts) {
  if (!(this instanceof SimpleSignup)) return new SimpleSignup(opts)
  this.auth = Authentic(opts)
  this.on('authToken', this.set.bind(this, 'authToken'))
  this.on('email', this.set.bind(this, 'email'))
}

Wildemitter.mixin(SimpleSignup)

SimpleSignup.prototype.authToken = function () {
  return this.auth.authToken
}

SimpleSignup.prototype.signup = function (emailOpts) {
  var auth = this.auth

  var fields = [
    {
      label: 'Email',
      property: 'email'
    },
    {
      label: 'Password',
      property: 'password',
      type: 'password'
    }
  ]

  var el = document.createElement('div')

  var opts = {
    action: 'Signup',
    fields: fields,
    onSubmit: onSubmit
  }

  var form = renderForm(opts)
  el.appendChild(
    h('div',
      h('h1', 'Sign Up'),
      form
    )
  )

  function onSubmit (formState) {
    auth.signup(xtend(emailOpts, formState), function (err, result) {
      el.innerHTML = ''
      if (err) {
        opts.error = err.message
        opts.state = formState
        var form = renderForm(opts)
        el.appendChild(form)
        return
      }

      el.appendChild(renderSignupComplete())
    })
  }

  return el
}

SimpleSignup.prototype.confirm = function (opts) {
  var el = document.createElement('div')
  el.innerHTML = 'loading...'

  this.auth.confirm(opts, function (err, result) {
    if (err) {
      el.innerHTML = err.message
      return
    }

    el.innerHTML = result.message
  })

  return el
}

SimpleSignup.prototype.set = function (key, val) {
  var lsKey = keyPrefix + key
  if (typeof val !== 'undefined' && val !== null) {
    ls.setItem(lsKey, JSON.stringify(val))
  } else {
    ls.removeItem(lsKey)
  }
  this.emit(key, val)
  return val
}

SimpleSignup.prototype.get = function (key) {
  var lsKey = keyPrefix + key
  var str = ls.getItem(lsKey) || 'null'
  return JSON.parse(str)
}

function renderSignupComplete () {
  var el = h('div',
    'Signup complete! Check your email for the confirmation link')
  return el
}
