const $navbar = document.querySelector('nav.menu ul:first-child'),
	$header = document.querySelector('header')

let scrollvalue = window.scrollY,
	devicewidth = window.innerWidth,
	headerheight = $header.offsetHeight,
	sticky = null,
	ticking = false

// To define the initial state of the scroll
scrollvalue >= headerheight ? (sticky = true) : (sticky = false)
window.addEventListener('load', menuSticky())

console.log(sticky)

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

window.addEventListener('scroll', (event) => {
	scrollvalue = window.scrollY
    menuSticky()
})
