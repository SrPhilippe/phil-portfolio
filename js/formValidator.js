export default class FormValidator {
  constructor(form) {
    this._form = document.querySelector(form)
    this._inputWithErrors = new Set()

    this._form.addEventListener('submit', e => {
      e.preventDefault()

      if (nameValid && emailValid && messageValid) {
        const $loading = qs('.sc.contact .popup')
        const $info = $loading.querySelector('.info')
        const $ring = $loading.querySelector('lds-ring')

        token = localStorage.token // It's important to check the token whenever the form is submitted

        if (!token || !lastTimestamp) {
          // newly user, or an user that never submitted the form
          token = localStorage.token = 3
          lastTimestamp = localStorage.lastTimestamp = currentSec()
        }

        if (token > 0) {
          token--
          localStorage.token = token

          $ring.style.display = 'inline-block'
          $info.textContent = `Enviando`
          show($loading)

          // Generate five digits number to be used as message ID
          ev.target.id_number.value = (Math.random() * 100000) | 0
          ev.target.to_name.value = 'Philippe'
          console.log('Enviado')
          window.setTimeout(() => {
            hide($loading)
          }, 2000)
          emailjs.sendForm(mailPrefs.contactService, mailPrefs.templateId, ev.target).then(() => {
            $form.reset()
            for (const el in inputs) {
              inputs[el].classList.remove('active')
              inputs[el].previousElementSibling.classList.remove('active')
            }
            nameValid, emailValid, (messageValid = false)
            $ring.style.display = 'none'
            $info.textContent = `Sua mensagem foi enviada!`
            window.setTimeout(() => {
              hide($loading)
            }, 2000)
          }),
            error => {
              $ring.style.display = 'none'
              $info.textContent = `Houve um erro ao enviar a mensagem.`
              console.log('Failed...', error)
            }
        } else {
          let limit = 24
          let timeSpent = currentSec() - lastTimestamp
          const convertHours = number => {
            return number / 60 / 60 // Converting seconds to hours
          }

          convertHours(timeSpent) > limit
            ? ((token = localStorage.token = 3), (lastTimestamp = localStorage.lastTimestamp = currentSec()))
            : console.log(`Você só poderá enviar outra mensagem após ${limit} horas.`)
        }
      } else {
        showInputLog(ev.target.querySelector('input[type="submit"]'))
      }

      if (!this.hasErrors) {
      }
    })
  }

  registerInput(selector, rules) {
    // Register
    const defaultPattern = /[^]*/
    const inputField = this._form.querySelector(`[data-input="${selector}"]`)
    this._inputWithErrors.add(inputField)
    rules.pattern = rules.pattern ?? defaultPattern // ? If the pattern is null it will match any string
    rules.message = ''
    inputField.addEventListener('input', ev => this.checkErrors(ev, inputField, rules))
    this.createElementError(inputField)
  }

  checkErrors(event, input, rules) {
    if (!input.value.match(rules.pattern)) {
      this._inputWithErrors.add(input)
      rules.message = `O padrão de ${'email'} digitado não é válido.`
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
      input.previousElementSibling.classList.add('active')
      input.classList.add('active')
    } else {
      input.previousElementSibling.classList.remove('active')
      input.classList.remove('active')
      rules.message = ''
    }

    this.updateElementError(event.currentTarget, rules.message)
  }

  get hasErrors() {
    return this._inputWithErrors.size > 0
  }

  createElementError(input) {
    // This function verifies whether the log element exists or not

    const logElement = input.closest('li').querySelector('.log') ?? false
    // select the closest <li> ancestor

    if (!logElement) {
      const log = document.createElement('p')
      log.classList.add('log')
      input.after(log)
    }
  }

  updateElementError(input, message) {
    const logElement = input.closest('li').querySelector('.log')
    if (message !== '') {
      logElement.textContent = message
      logElement.classList.add('active')
      input.classList.add('invalid')
    } else {
      logElement.classList.remove('active')
      input.classList.remove('invalid')
    }
  }

  verifyToken() {
    token = localStorage.token
  }
}
