var h = require('hyperscript')
var renderForm = require('./form')
var defaultStyles = require('./styles')

module.exports = function renderBox (opts) {
  var styles = opts.styles || defaultStyles
  if (opts.styles === false) styles = {}

  return h('.ss-box', {style: styles.box},
    h('h4.ss-title', {style: styles.title}, opts.title),
    opts.message ? opts.message : renderForm(opts),
    renderLinks(opts.links, styles)
  )
}

function renderLinks (links, styles) {
  if (!links) return ''

  return h('.ss-links', {style: styles.links},
    h('a.ss-link', { href: links[0].href, style: styles.link}, links[0].text),
    ' · ',
    h('a.ss-link', { href: links[1].href, style: styles.link }, links[1].text)
  )
}
