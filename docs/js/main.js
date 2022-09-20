import { apiKeys, mailPrefs } from './config.js'

const $navbar = document.querySelector('nav.menu'),
	$header = document.querySelector('header'),
	$form = document.querySelector('.contact-form'),
	test = null


let scrollvalue = window.scrollY,
	devicewidth = window.innerWidth,
	headerheight = $header.offsetHeight,
	sticky = null,
	ticking = false

if (devicewidth < 768) {
	if (document.querySelector('.menu.mobile') === null) {
		showNavigation()
	}
}

function menuSticky() {
	if (!ticking) {
		window.requestAnimationFrame(() => {
			if (scrollvalue >= headerheight && sticky === true) {
				$header.classList.add('sticky')
				document.body.style.paddingTop =
					headerheight + $header.offsetHeight + 'px'
				sticky = false
			} else if (scrollvalue < headerheight && sticky === false) {
				$header.classList.remove('sticky')
				headerheight = $header.offsetHeight
				document.body.style.paddingTop = '0'
				sticky = true
			}
			ticking = false
		})
		ticking = true
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

window.addEventListener('load', () => {
	scrollvalue >= headerheight ? (sticky = true) : (sticky = false)
	console.log(`Initial scroll offset: ${Math.floor(scrollvalue)}px`)
	menuSticky()
	correctElDetails()
})

window.addEventListener('scroll', (ev) => {
	scrollvalue = window.scrollY
	menuSticky()
})

window.addEventListener('resize', (ev) => {
	if (window.innerWidth < 768) {
	}

	correctElDetails()
})

// Select all inputs inside the contact form excluding the input submit type
$form.querySelectorAll('input:not([type="submit"], [type="hidden"]), textarea').forEach(el => {
	el.addEventListener('input', (e) => {
		console.log(`Fired at ${el.tagName}`)
		e.currentTarget.value.length > 0
			? (e.currentTarget.classList.add('active'), e.currentTarget.previousElementSibling.classList.add('active'))
			: (e.currentTarget.classList.remove('active'), e.currentTarget.previousElementSibling.classList.remove('active'))
	})
})

emailjs.init(apiKeys.public.emailjs)

$form.addEventListener('submit', (ev) => {
	ev.preventDefault()

	// Generate five digits number to be used as message ID
	ev.target.id_number.value = Math.random() * 100000 | 0
	ev.target.to_name.value = "Philippe"

	emailjs.sendForm(mailPrefs.contactService, mailPrefs.templateId, ev.target)
	.then(() => {
		console.log('Email successfully sended!')
	}), error => {
		console.log('Failed...', error)
	}


})
