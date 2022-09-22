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

// Select all inputs inside the contact form excluding the input submit type
const inputsForm = $form.querySelectorAll('input:not([type="submit"], [type="hidden"]), textarea')
inputsForm.forEach(el => {
	el.addEventListener('input', ev => {
		ev.currentTarget.value.length > 0
			? (ev.currentTarget.classList.add('active'), ev.currentTarget.previousElementSibling.classList.add('active'))
			: (ev.currentTarget.classList.remove('active'),
			  ev.currentTarget.previousElementSibling.classList.remove('active'))
	})
})

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
		// clearForm()
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
