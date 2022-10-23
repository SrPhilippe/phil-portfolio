import { qs, addClass, rmClass, toggClass, currentTimestampSec as currentSec } from './utils.js'
import { apiKeys, mailPrefs, patterns } from './config.js'
import Carousel from './carousel.js'
import FormValidator from './formValidator.js'

// Local storage variables to control submit rate in the contact form
let token = Number(localStorage.token) ?? false
let lastTimestamp = Number(localStorage.lastTimestamp) ?? false
let deviceWidth = window.innerWidth

// Contact form instance
const cf = new FormValidator('.contact-form')
// Contact form registration
cf.registerInput('username', { min: 3, max: 23, pattern: null })
cf.registerInput('message', { min: 6, max: 1000, pattern: null })
cf.registerInput('mail', { min: 8, max: 30, pattern: patterns.mail })

// EmailJS instance
emailjs.init(apiKeys.public.emailjs)

Carousel('.items-wrapper.carousel')

const $header = qs('header')
const $form = qs('.contact-form')
const $sections = document.querySelectorAll('.sc')
const $scrollTop = qs('.scroll-top')
const $navbar = qs('nav.menu')

$form.addEventListener('submit', ev => {
	ev.preventDefault() // preventing fromssss submit method

	if (nameValid && emailValid && messageValid) {
		const $loading = qs('.sc.contact .popup')
		const $info = $loading.querySelector('.info')
		const $ring = $loading.querySelector('lds-ring')

		token = localStorage.token // It's important to check the token whenever the form is submitted

		if (!token || !lastTimestamp) { // newly user, or an user that never submitted the form
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
			emailjs.sendForm(mailPrefs.contactService, mailPrefs.templateId, ev.target)
				.then(() => {
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
				return (number / 60) / 60 // Converting seconds to hours
			}

			(convertHours(timeSpent) > limit)
				? (token = localStorage.token = 3, lastTimestamp = localStorage.lastTimestamp = currentSec())
				: console.log(`Você só poderá enviar outra mensagem após ${limit} horas.`)
		}
	} else {
		showInputLog(ev.target.querySelector('input[type="submit"]'))
	}
})

window.addEventListener('load', ev => {
	correctElDetails()
	const $clonedHeader = cloneHeader($header) // Clones the header of the page
	if (deviceWidth < 768) { checkMenu(true) }

	const $menuItems = document.querySelectorAll('ul>li[data-nav]')

	const obsHeader = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			(!entry.isIntersecting)
				? (addClass($clonedHeader), addClass($scrollTop))
				: (rmClass($clonedHeader), rmClass($scrollTop))
		})
	})

	obsHeader.observe($header)

	const obsSections = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				$menuItems.forEach(link => {
					rmClass(link)
					if (entry.target.classList.contains(link.dataset.nav)) {
						addClass(link)
					}
				})
			} else {
				$menuItems.forEach($item => {
					if ($item.dataset.nav === 'top') {
						addClass($item)
					}
				})
			}
		})
	},
		{
			threshold: 0.5
		})

	$sections.forEach($section => { // Observes all sections
		obsSections.observe($section)

		$section.style.scrollMarginTop = // Fixes the overflowing fixed menu anchor
			`${$clonedHeader.offsetHeight}px`
	})
})

const checkMenu = (isActive) => {
	const menuMobile = document.querySelector('.menu-mobile') ?? false
	const $links = document.querySelectorAll('nav.menu>ul>li')


	if (!menuMobile) {
		const div = document.createElement('div')
		addClass(div, ['menu-mobile'])
		for (let i = 0; i < 3; i++) {
			let span = document.createElement('span')
			div.append(span)
		}

		$navbar.after(div)

		div.addEventListener('click', ev => {
			toggClass($navbar)
			toggClass(ev.currentTarget, ['opened'])
		})

		if (isActive) { addClass(div) }
	} else {
		(isActive) ? addClass(menuMobile) : rmClass(menuMobile)
	}

	$links.forEach(link => {
		link.addEventListener('click', ev => {
			rmClass($navbar)
			rmClass(ev.currentTarget)
		})
	})
}

const cloneHeader = header => {
	const node = header.cloneNode(true)
	addClass(node, ['clone'])
	rmClass(node, ['top'])
	node.removeAttribute('id')
	header.before(node)
	return node
}

const correctElDetails = () => {
	const el = qs('.sc.intro .mask')
	el.style.borderRightWidth = `${el.parentNode.offsetWidth}px`
	el.style.borderTopWidth = `${el.parentNode.offsetHeight}px`
}

window.addEventListener('resize', e => {
	deviceWidth = window.innerWidth
	correctElDetails()
	if (deviceWidth < 768) {
		checkMenu(true)
	} else {
		checkMenu(false)
	}
})

$scrollTop.addEventListener('click', e => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	})
})