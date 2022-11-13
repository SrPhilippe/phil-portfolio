import { qs, addClass, rmClass, createElement, currentTimestampSec as currentSec } from './utils.js'
import { mailPrefs } from './config.js'

export default class FormValidator {
  constructor(form, config) {
    this._form = qs(form)
    this._inputWithErrors = new Set()
    this._token = config.token || false
    this._timeStamp = config.lastTimestamp || false

    this._form.addEventListener('submit', event => {
      event.preventDefault()

      this.tokenExpiration()

      if (this._inputWithErrors.size === 0) {
        const e_popup = qs('.sc.contact .popup')
        const e_ring = qs('.lds-ring', e_popup)
        const e_info = qs('.info', e_popup)
        const e_control = qs('.control', e_popup)
        const e_button = qs('button', e_control)

        e_button.addEventListener('click', event => {
          rmClass(e_popup)
        })
        console.log(e_button)

        e_ring.style.display = 'inline-block'
        e_info.textContent = `Enviando`

        addClass(e_popup)

        // Generate five digits number to be used as message ID
        event.target.id_number.value = (Math.random() * 100000) | 0
        event.target.to_name.value = 'Philippe'

        emailjs.sendForm(mailPrefs.contactService, mailPrefs.templateId, event.target).then(() => {
          this._form.reset()

          const inputs = document.querySelectorAll('textarea, input:not([type="hidden"], [type="submit"])')

          inputs.forEach(el => {
            rmClass(el)
            rmClass(el.previousElementSibling)
          })

          e_ring.style.display = 'none'
          e_info.textContent = `Sua mensagem foi enviada!`

          addClass(e_control)
          
        }),
          error => {
            e_ring.style.display = 'none'
            e_info.textContent = `Houve um erro ao enviar a mensagem.`
            console.error('Failed...', error)
          }
      } else {
        console.error('Error', this._inputWithErrors)
      }
    })
  }

  registerInput(selector, rules) {
    // Register
    const getType = text => {
      switch (text) {
        case 'username':
          return 'nome'
        case 'message':
          return 'mensagem'
        case 'mail':
          return 'e-mail'
      }
    }

    const type = getType(selector)

    const defaultPattern = /[^]*/
    const inputField = qs(`[data-input="${selector}"]`, this._form)

    this._inputWithErrors.add(inputField)

    rules.pattern = rules.pattern ?? defaultPattern // ? If the pattern is null it will match any string
    rules.message = ''

    inputField.addEventListener('input', event => this.checkErrors(event, rules, type))
    this.createElementError(inputField)
  }

  checkErrors(event, rules, type) {
    const input = event.currentTarget
    if (!input.value.match(rules.pattern)) {
      this._inputWithErrors.add(input)
      rules.message = `O padrão de ${type} digitado não é válido.`
    } else {
      if (input.value.length < rules.min || input.value.length > rules.max) {
        this._inputWithErrors.add(input)
        rules.message = `Pode conter entre ${rules.min} e ${rules.max} caracteres.`
      } else {
        this._inputWithErrors.delete(input)
        rules.message = ''
      }
    }

    if (input.value.length > 0) {
      addClass(input.previousElementSibling)
      addClass(input)
    } else {
      rmClass(input.previousElementSibling)
      rmClass(input)
      rules.message = ''
    }

    this.updateElementError(event.currentTarget, rules.message)
  }

  createElementError(input) {
    // This function verifies whether the log element exists or not

    const logElement = input.closest('li').querySelector('.log') ?? false
    // select the closest <li> ancestor

    if (logElement === false) {
      const log = document.createElement('p')
      addClass(log, ['log'])
      input.after(log)
    }
  }

  updateElementError(input, message) {
    const logElement = input.closest('li').querySelector('.log')
    if (message !== '') {
      logElement.textContent = message
      addClass(logElement)
      addClass(input, ['invalid'])
    } else {
      rmClass(logElement)
      rmClass(input, ['invalid'])
    }
  }

  get hasErrors() {
    return this._inputWithErrors.size > 0
  }

  executeToken(type) {
    switch (type) {
      case 'get': // ? get from local storage
        this._token = Number(localStorage.token)
        this._timeStamp = Number(localStorage.lastTimestamp)

      case 'update': // ? update local storage
        localStorage.token = this._token
        localStorage.lastTimestamp = this._timeStamp

      case 'reset':
        this._token = localStorage.token = 3
        this.timeStamp = localStorage.lastTimestamp = currentSec()
    }
  }

  tokenSubtract(value) {
    this._token -= value
    this.executeToken('update')
  }

  tokenExpiration() {
    if (!this._token || !this._timeStamp) {
      // newly user or one that have never submitted the form before
      this.executeToken('reset')
    }

    if (this._token > 0) {
      this._inputWithErrors.delete('token')
      this.tokenSubtract(1)
      return // Ready to submit
    } else {
      this.hasErrors.add('token')
      const limit = 5
      let timeSpent = this.timeSpent(currentSec, this._timeStamp)

      timeSpent > limit
        ? this.executeToken('reset')
        : console.log(`Você só poderá enviar outra mensagem após ${limit} horas.`)
    }
  }

  convertTime(type, value) {
    switch (type) {
      case 'minutes':
        return value / 60
      case 'hour':
        return value / 60 / 60
      case 'day':
        return value / 60 / 60 / 24
      default:
        return value
    }
  }

  timeSpent(currentTime, lastTime) {
    return lastTime - currentTime
  }
}
