import { qs, addClass, rmClass, toggClass, createElement, currentTimestampSec as currentSec } from './utils.js'
import { apiKeys, mailPrefs, patterns } from './config.js'
import Carousel from './carousel.js'
import FormValidator from './formValidator.js'

let deviceWidth = window.innerWidth

// Contact form instance
const cf = new FormValidator('.contact-form', {
  token: Number(localStorage.token),
  lastTimestamp: Number(localStorage.lastTimestamp),
})

// Contact form registration instances
cf.registerInput('username', { min: 3, max: 23, pattern: null })
cf.registerInput('message', { min: 6, max: 1000, pattern: null })
cf.registerInput('mail', { min: 8, max: 30, pattern: patterns.mail })

// EmailJS instance
emailjs.init(apiKeys.public.emailjs)

Carousel('.items-wrapper.carousel')

const $header = qs('header')
const $sections = document.querySelectorAll('.sc')
const $scrollTop = qs('.scroll-top')
const $navbar = qs('nav.menu')
const $menuItems = document.querySelectorAll('ul>li[data-nav]')

window.addEventListener('load', ev => {
  correctElDetails()
  const $clonedHeader = cloneHeader($header) // Clones the header of the page
  if (deviceWidth < 768) {
    checkMenu(true)
  }

  const obsHeader = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      !entry.isIntersecting
        ? (addClass($clonedHeader), addClass($scrollTop))
        : (rmClass($clonedHeader), rmClass($scrollTop))
    })
  })

  obsHeader.observe($header)

  const obsSections = new IntersectionObserver(
    entries => {
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
      threshold: 0.5,
    }
  )

  $sections.forEach($section => {
    // Observes all sections
    obsSections.observe($section)

    $section.style.scrollMarginTop =
      // Fixes the overflowing fixed menu anchor
      `${$clonedHeader.offsetHeight}px`
  })
})

const checkMenu = isActive => {
  const menuMobile = document.querySelector('.menu-mobile') ?? false
  const $links = document.querySelectorAll('nav.menu>ul>li')

  if (!menuMobile) {
    const div = createElement('div', { class: 'menu-mobile' })
    for (let i = 0; i < 3; i++) {
      let span = createElement('span')
      div.append(span)
    }

    $navbar.after(div)

    div.addEventListener('click', ev => {
      toggClass($navbar)
      toggClass(ev.currentTarget, ['opened'])
    })

    $links.forEach(link => {
      link.addEventListener('click', ev => {
        rmClass($navbar)
        rmClass(div, ['opened'])
      })
    })

    if (isActive) {
      addClass(div)
    }
  } else {
    isActive ? addClass(menuMobile) : rmClass(menuMobile)
  }
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

const sectionRepo = document.querySelector('.sc.repo .container')
const content = createElement('div', { class: 'content' })
sectionRepo.append(content)

fetch(apiKeys.public.repos)
  .then(response => response.json())
  .then(data => {
    data.forEach((repo, i) => {
      if (repo.fork === false) {
        let htmlContent = `
          <p class="row name"><a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a></p>
          <p class="row description"> ${repo.description}</p>
          <p class="row language">{language_data}</p>
          <a class="row button" href="${repo.html_url}" target="_blank">Ir para repositório<i class="bx bx-link-external"></i></a>
        `
        let div = createElement('div', { class: `item` })
        div.innerHTML = htmlContent

        sectionRepo.querySelector('.content').append(div)
      }
    })
  })

fetch(apiKeys.public.github)
  .then(res => res.json())
  .then(data => {
    const profileImg = qs('.profile-image')
    const avatarURL = data.avatar_url
    const img = createElement('img', {
      src: avatarURL,
    })
    profileImg.append(img)
  })
