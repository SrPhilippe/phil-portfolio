export default class FormValidator {
    constructor(form) {
        this._form = document.querySelector(form)
        this._inputWithErrors = new Set()

        this._form.addEventListener('submit', e => {
            e.preventDefault()
            if (!this.hasErrors) {
                // Submit
                console.log('the form was submitted')
            }
        })
    }

    registerInput(selector, rules) { // Register
        const inputField = this._form.querySelector(`[data-input="${selector}"]`)
        this._inputWithErrors.add(inputField)
        rules.pattern = rules.pattern ?? /[^]*/ // ? If the pattern is null it will match any string
        rules.message = ''
        inputField.addEventListener('input', ev => this.checkErrors(ev, inputField, rules))
        this.createElementError(inputField)
    }

    checkErrors(event, input, rules) {
        if (!input.value.match(rules.pattern)) {
            this._inputWithErrors.add(input)
            rules.message =
                `O padrão de ${'email'} digitado não é válido.`
        } else {

            if (input.value.length < rules.min || input.value.length > rules.max) {
                this._inputWithErrors.add(input)
                rules.message =
                    `Pode conter entre ${rules.min} e ${rules.max} caracteres.`
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

}