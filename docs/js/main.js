const $navbar = document.querySelector('nav.menu'),
	$navUl = $navbar.firstElementChild,
	$header = document.querySelector('header')

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
	console.log(scrollvalue)
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
