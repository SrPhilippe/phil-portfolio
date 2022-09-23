import { apiKeys, mailPrefs } from './config.js'
// import FormValidator from './formValidator.js'

const $navbar = document.querySelector('nav.menu')
const $header = document.querySelector('header')
const $form = document.querySelector('.contact-form')

let scrollvalue = window.scrollY,
	devicewidth = window.innerWidth,
	headerheight = $header.offsetHeight,
	sticky = null

if (devicewidth < 768) {
	if (document.querySelector('.menu.mobile') === null) {
		showNavigation()
	}
}

window.addEventListener('load', ev => {
	$header.style.top = `-${headerheight}px` // to have a slide down animation
	scrollvalue >= headerheight ? (sticky = true) : (sticky = false)
	menuSticky()
	correctElDetails()
})

window.addEventListener('scroll', ev => {
	scrollvalue = window.scrollY
	menuSticky()

	scrollvalue > headerheight ? show($scrollTop) : hide($scrollTop, null)
})

window.addEventListener('resize', ev => {
	correctElDetails()
	if (window.innerWidth < 768) {
	}
})

const inputs = {
	name: $form.querySelector('input[name="username"]'),
	email: $form.querySelector('input[type="email"]'),
	message: $form.querySelector('textarea'),
}

let nameValid = false,
	emailValid = false,
	messageValid = false

for (const element in inputs) {
	inputs[element].addEventListener('input', ev => {
		let input = ev.currentTarget,
			message = verifyInput(ev.currentTarget)
		if (input.value.length > 0) {
			input.classList.add('active')
			input.previousElementSibling.classList.add('active')

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
				input.nextSibling.style.top = `-${(input.nextSibling.offsetHeight) + 5}px`
			}
		} else {
			input.nextSibling.remove()
			input.classList.remove('active')
			input.previousElementSibling.classList.remove('active')
			input.classList.remove('invalid')
		}
	})
}

function verifyInput(input) {
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
	}
}

function menuSticky() {
	if (scrollvalue >= headerheight && sticky === true) {
		$header.classList.add('sticky')
		document.body.style.paddingTop = headerheight + $header.offsetHeight + 'px'
		sticky = false
	} else if (scrollvalue < headerheight && sticky === false) {
		$header.classList.remove('sticky')
		headerheight = $header.offsetHeight
		document.body.style.paddingTop = '0'
		sticky = true
	}
}

function showNavigation() {
	const $mobNav = document.createElement('div')
	$mobNav.classList.add('menu', 'mobile')
	for (let i = 0; i < 3; i++) {
		let el = document.createElement('span')
		$mobNav.append(el)
	}
	$navbar.prepend($mobNav)
}

function correctElDetails() {
	const $el = document.querySelector('.sc.intro .mask')
	$el.style.borderRightWidth = `${$el.parentNode.offsetWidth}px`
	$el.style.borderTopWidth = `${$el.parentNode.offsetHeight}px`
}

const $scrollTop = document.querySelector('.scroll-top')
$scrollTop.addEventListener('click', ev => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	})
})

emailjs.init(apiKeys.public.emailjs)

$form.addEventListener('submit', ev => {
	ev.preventDefault()

	if (nameValid && emailValid && messageValid) {
		const $loading = document.querySelector('.sc.contact .popup')
		const $info = $loading.querySelector('.info')
		const $ring = $loading.querySelector('.lds-ring')

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
			nameValid, emailValid, messageValid = false
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
	}
})

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
