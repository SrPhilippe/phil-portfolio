import { qs, qsa, createElement } from './utils.js'
import { apiKeys, mailPrefs } from './config.js'
import Carousel from './carousel.js'
import FormValidator from './formValidator.js'

const cf = new FormValidator('.contact-form')

// Contact form instances
cf.registerInput('username', {min: 3, max: 23, pattern: null})
cf.registerInput('message', {min: 6, max: 1000, pattern: null})
cf.registerInput('mail', {min: 8, max: 30, pattern: /^[^ ]+@[^ ]+\.[a-z]{2,3}$/})

// EmailJS instance
emailjs.init(apiKeys.public.emailjs)

Carousel('.items-wrapper.carousel')

// Local storage variables to control submit rate in the contact form
let token = Number(localStorage.token) ?? false,
	lastTimestamp = Number(localStorage.lastTimestamp) ?? false,
	deviceWidth = window.innerWidth

const $header = qs('header')
const $form = qs('.contact-form')
const $firstSection = qs('.sc.slider')
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
			lastTimestamp = localStorage.lastTimestamp = currStampSeconds()
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
			let limit = 24,
				timeSpent = currStampSeconds() - lastTimestamp,
				convertHours = number => {
					return (number / 60) / 60 // Converting seconds to hours
				}

			(convertHours(timeSpent) > limit)
				? (token = localStorage.token = 3, lastTimestamp = localStorage.lastTimestamp = currStampSeconds())
				: console.log(`Você só poderá enviar outra mensagem após ${limit} horas.`)
		}
	} else {
		showInputLog(ev.target.querySelector('input[type="submit"]'))
	}
})

window.addEventListener('load', ev => {
	correctElDetails()
	const $clonedHeader = cloneHeader($header) // Clones the header of the page
	const $menuItems = document.querySelectorAll('ul>li[data-nav]')
	const observerIntro = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (!entry.isIntersecting) {
				$clonedHeader.classList.add('active')
				$scrollTop.classList.add('active')
			} else {
				$clonedHeader.classList.remove('active')
				$scrollTop.classList.remove('active')
			}
		})
	}, { rootMargin: `-${$firstSection.offsetHeight}px 0px 0px 0px` })

	const observerSections = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				$menuItems.forEach(link => {
					link.classList.remove('active')
					if (entry.target.classList.contains(link.dataset.nav)) {
						link.classList.add('active')
					}
				})
			}
		})
	}, {
		threshold: 0.5
	})
	observerIntro.observe($firstSection) // Observes the first section of the page

	$sections.forEach(section => {
		observerSections.observe(section)
	})

	observerSections.observe($header)



	if (deviceWidth < 768) {
		showNavigation()
		const $menuButton = document.querySelectorAll('.menu-mobile').item(0)
		const $newNav = document.querySelectorAll('nav.menu').item(0)
		const $links = document.querySelectorAll('nav.menu>ul>li')
		$newNav.remove()

		$menuButton.addEventListener('click', ev => {
			$navbar.classList.toggle('active')
			ev.currentTarget.classList.toggle('active')
		})


		$links.forEach(link => {
			link.addEventListener('click', ev => {

				$navbar.classList.remove('active')
				$menuButton.classList.remove('active')
			})
		})
	}
})



const showNavigation = () => {
	const $div = document.createElement('div')
	$div.classList.add('menu-mobile')
	for (let i = 0; i < 3; i++) {
		let el = document.createElement('span')
		$div.append(el)
	}
	$navbar.after($div)
}

const cloneHeader = header => {
	const node = header.firstElementChild.cloneNode(true)
	const $clonedHeader = qs('.header.clone')
	$clonedHeader.appendChild(node)
	return $clonedHeader

}

const correctElDetails = () => {
	const $el = qs('.sc.intro .mask')
	$el.style.borderRightWidth = `${$el.parentNode.offsetWidth}px`
	$el.style.borderTopWidth = `${$el.parentNode.offsetHeight}px`
}

const currStampSeconds = () => {
	return (Date.now() / 1000 | 0)
}



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