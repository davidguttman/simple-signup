var h = require('hyperscript')

module.exports = function renderForm (opts) {
  var formState = opts.state || {}

  var action = opts.action
  var fields = opts.fields
  var onSubmit = opts.onSubmit

  var fieldEls = fields.map(function (field) {
    return h('div',
      h('label.' + field.property,
        field.label,
        h('input.' + field.property, {
          type: field.type,
          value: formState[field.property] || '',
          onkeyup: function (evt) {
            formState[field.property] = evt.target.value
          }
        })
      )
    )
  })

  var el = h.apply(null,
    [ 'form' ].concat(
      fieldEls,
      [
        h('div.error', opts.error),
        h('input.signup-btn',
          { type: 'submit',
            onclick: function (evt) {
              onSubmit(formState)
              evt.preventDefault()
            }
          },
          action || 'Submit'
        )
      ]
    )
  )

  return el
}
