import { apiKeys, mailPrefs } from './config.js'

// Local storage variables to control submit rate in the contact form
let token = (localStorage.formToken) ? localStorage.formToken : localStorage.formToken = 3,
	lastTimestamp = localStorage.lastTimestamp ?? false,
	deviceWidth = window.innerWidth

const $header = document.querySelector('header')
const $navbar = document.querySelector('nav.menu')
const $form = document.querySelector('.contact-form')
const $firstSection = document.querySelector('.sc.intro')
const $scrollTop = document.querySelector('.scroll-top')
const $menuItems = $navbar.querySelectorAll('ul>li')

document.addEventListener('DOMContentLoaded', ev => {
	correctElDetails()
	const $clonedHeader = cloneHeader($header) // Clones the header of the page
	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (!entry.isIntersecting) {
				$clonedHeader.classList.add('active')
				show($scrollTop)
			} else {
				$clonedHeader.classList.remove('active')
				hide($scrollTop, null)
			}
		})
	}, { rootMargin: `-${$firstSection.offsetHeight}px 0px 0px 0px` })

	observer.observe($firstSection) // Observes the first section of the page


	if (deviceWidth < 768) {
		showNavigation()
		console.log($clonedHeader)
		const $menuButton = document.querySelectorAll('.menu-mobile').item(0)
		const $newNav = document.querySelectorAll('nav.menu').item(0)
		$newNav.remove()
	
		$menuButton.addEventListener('click', ev => {
			$navbar.classList.toggle('active')
			ev.currentTarget.classList.toggle('active')
		})
	}
})

emailjs.init(apiKeys.public.emailjs) // Inits the emailjs instance

const inputs = {
	name: $form.querySelector('input[name="username"]'),
	email: $form.querySelector('input[type="email"]'),
	message: $form.querySelector('textarea'),
	submit: $form.querySelector('input[type="submit"]')
}

let nameValid = false,
	emailValid = false,
	messageValid = false

for (const element in inputs) {
	inputs[element].addEventListener('input', ev => {
		let input = ev.currentTarget
		if (input.value.length > 0) {
			input.classList.add('active')
			input.previousElementSibling.classList.add('active')
			showInputLog(input)
		} else {
			input.nextSibling.remove()
			input.classList.remove('active', 'invalid')
			input.previousElementSibling.classList.remove('active')
		}
	})
}

function showInputLog(input) {
	let message = checkInput(input)
	if (!input.nextElementSibling) {
		let $p = document.createElement('p')
		$p.classList.add('log')
		input.after($p)
	}

	if (message === true) {
		input.classList.remove('invalid')
		input.nextSibling.remove()
	} else {
		input.classList.add('invalid')
		input.nextElementSibling.textContent = message
		input.nextSibling.style.top = `-${input.nextSibling.offsetHeight + 10}px`
	}
}

function checkInput(input) {
	const char = {
		// min and max permited characters
		name: {
			min: 3,
			max: 23,
		},
		message: {
			min: 5,
			max: 1000,
		},
	}
	if (input.isSameNode(inputs.name)) {
		if (input.value.length < char.name.min) {
			nameValid = false
			return `Nome muito pequeno. Precisa conter pelo menos ${char.name.min} caracteres.`
		} else if (input.value.length > char.name.max) {
			nameValid = false
			return `Nome muito grande. Pode conter até ${char.name.max} caracteres.`
		} else {
			nameValid = true
			return true
		}
	} else if (input.isSameNode(inputs.email)) {
		const mailPatt = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/ // regular expression to match e-mail pattern
		if (!input.value.match(mailPatt)) {
			emailValid = false
			return `O padrão de e-mail não é válido.`
		} else {
			emailValid = true
			return true
		}
	} else if (input.isSameNode(inputs.message)) {
		if (input.value.length < char.message.min || input.value.length > char.message.max) {
			messageValid = false
			return `A mensagem precisa estar entre ${char.message.min} e ${char.message.max} caracteres.`
		} else {
			messageValid = true
			return true
		}
	} else if (input.isSameNode(inputs.submit)) {
		if (nameValid || emailValid || messageValid !== true) {
			return `Você precisa preencher todos os campos antes de validar!`
		} else {
			return true
		}
	}
}

function showNavigation() {
	const $div = document.createElement('div')
	$div.classList.add('menu-mobile')
	for (let i = 0; i < 3; i++) {
		let el = document.createElement('span')
		$div.append(el)
	}
	$navbar.after($div)
}

function cloneHeader(header) {
	const node = header.firstElementChild.cloneNode(true)
	const $clonedHeader = document.querySelector('.header.clone')
	$clonedHeader.appendChild(node)
	return $clonedHeader

}

function correctElDetails() {
	const $el = document.querySelector('.sc.intro .mask')
	$el.style.borderRightWidth = `${$el.parentNode.offsetWidth}px`
	$el.style.borderTopWidth = `${$el.parentNode.offsetHeight}px`
}

function show(el) {
	el.style.visibility = 'visible'
	window.setTimeout(() => (el.style.opacity = 1), 30)
}

function hide(el, animationTime) {
	if (animationTime === null) {
		animationTime = 300
	}

	el.style.opacity = 0
	window.setTimeout(() => (el.style.visibility = 'hidden'), animationTime)
}

$form.addEventListener('submit', ev => {
	ev.preventDefault()

	if (nameValid && emailValid && messageValid) {
		const $loading = document.querySelector('.sc.contact .popup')
		const $info = $loading.querySelector('.info')
		const $ring = $loading.querySelector('.lds-ring')

		token = localStorage.formToken
		if (token > 0) {
			token--
			localStorage.formToken = token

			$ring.style.display = 'inline-block'
			$info.textContent = `Enviando`
			show($loading)

			// Generate five digits number to be used as message ID
			ev.target.id_number.value = (Math.random() * 100000) | 0
			ev.target.to_name.value = 'Philippe'
			emailjs.sendForm(mailPrefs.contactService, mailPrefs.templateId, ev.target).then(() => {
				$form.reset()
				for (const el in inputs) {
					inputs[el].classList.remove('active')
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
			let todayInMs = (Date.now() / 1000 | 0),
				timeSpent = todayInMs - Number(lastTimestamp),
				convertHours = number => {
					return (number / 60) / 60
				}

			if (convertHours(timeSpent) > 24) {
				localStorage.formToken = 3
				localStorage.lastTimestamp = todayInMs
			} else {
				console.log(`Você só poderá enviar depois de ${24 - convertHours(timeSpent)} horas.`)
			}
		}

	} else {
		showInputLog(ev.target.querySelector('input[type="submit"]'))
	}
})

window.addEventListener('resize', ev => {
	correctElDetails()
	if (window.innerWidth < 768) {
	}
})

$scrollTop.addEventListener('click', ev => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	})
})