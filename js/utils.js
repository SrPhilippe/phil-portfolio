export function addGlobalEventListener(type, selector, callback, options, parent = document) {
  parent.addEventListener(
    type,
    e => {
      if (e.target.matches(selector)) callback(e)
    },
    options
  )
}

export const addClass = (element, classes = ['active']) => {
  element.classList.add(...classes)
}

export const rmClass = (element, classes = ['active']) => {
  element.classList.remove(...classes)
}

export const toggClass = (element, classes = ['active']) => {
  element.classList.toggle(...classes)
}

export function qs(selector, parent = document) {
  return parent.querySelector(selector)
}

export function qsa(selector, parent = document) {
  return [...parent.querySelectorAll(selector)]
}

export const currentTimestampSec = () => {
  return (Date.now() / 1000) | 0
}

export function createElement(type, options = {}) {
  const element = document.createElement(type)
  Object.entries(options).forEach(([key, value]) => {
    if (key === 'class') {
      element.classList.add(value)
      return
    }

    if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue
      })
      return
    }

    if (key === 'text') {
      element.textContent = value
      return
    }

    element.setAttribute(key, value)
  })
  return element
}
