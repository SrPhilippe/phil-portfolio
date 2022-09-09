function toggleMenu(menuEl) {
    console.log(menuEl)
    // stop the default event of A element
}

const   $navbar = document.querySelector('nav.menu ul:first-child')
toggleMenu($navbar.children)


window.addEventListener("resize", (event) => {
    console.log(event)
})