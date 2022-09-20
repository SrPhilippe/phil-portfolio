export default class FormValidator {
    constructor(selector) {
        this.form = document.querySelector(selector)
        this.inputsErrors = new Set()

        this.form.addEventListener('submit', ev => {
            ev.preventDefault()

            if (!this.hasErrors) {
                this.form.submit()
            }
        })
    }

    get hasErrors() {
        return this.inputsErrors.size > 0
    }

    register(selector, check) {
        const inputField = this.form.querySelector('input')
    }
}