export default function Carousel(carouselTarget) {

    const $slider = document.querySelector(carouselTarget)
    const $items = $slider.querySelector('.items')

    $items.addEventListener('wheel', ev => {
        if (ev.deltaY > 0) {
            ev.target.scrollBy(50, 0)
        } else {
            ev.target.scrollBy(-50, 0)
        }
        
    })
}

