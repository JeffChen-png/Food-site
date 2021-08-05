function sliders({sliderContainerSelector, prevSelector, nextSelector, currentSelector, totalSelector, slideSelector, slidesWrapperSelector, slidesInnerSelector}) {

    // дописать свойства 

    // Slider 

    const prev = document.querySelector('.offer__slider-prev'),
        slider = document.querySelector('.offer__slider'), //sliderContainerSelector
        next = document.querySelector('.offer__slider-next'),
        current = document.querySelector('#current'),
        total = document.querySelector('#total'),
        slides = document.querySelectorAll('.offer__slide'), //slideSelector
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesInner = document.querySelector('.offer__slider-inner'),
        slideWidth = window.getComputedStyle(slides[0]).width,
        prevImg = prev.querySelector('img'),
        nextImg = next.querySelector('img');

    function showDots(slider, slides) {
        slider.style.position = 'relative';

        const dots = document.createElement('ol');

        dots.classList.add('carousel-indicators');
        dots.style.cssText = `
            position: absolute;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 15;
            display: flex;
            justify-content: center;
            margin-right: 15%;
            margin-left: 15%;
            list-style: none;
        `;

        slider.append(dots);

        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('li');
            dot.setAttribute('data-slide-to', i + 1);
            dot.style.cssText = `
                box-sizing: content-box;
                flex: 0 1 auto;
                width: 30px;
                height: 6px;
                margin-right: 3px;
                margin-left: 3px;
                cursor: pointer;
                background-color: #fff;
                background-clip: padding-box;
                border-top: 10px solid transparent;
                border-bottom: 10px solid transparent;
                opacity: .5;
                transition: opacity .6s ease;
            `;

            if (i == (+current.textContent - 1)) {
                dot.style.opacity = 1;
            }

            dots.append(dot);
        }
    }

    function dotPassive(element) {
        element.style.opacity = 0.5;
    }

    function dotActive(element) {
        element.style.opacity = 1;
    }

    function dotsChanging(current) {
        const dots = document.querySelector('.carousel-indicators');

        dots.addEventListener('click', (event) => {

            for (let index = 0; index < slides.length; index++) {
                dotPassive(dots.children[index]);
            }

            if (event.target.tagName == 'LI') {
                current.textContent = event.target.getAttribute('data-slide-to');
                addZeros(current);
                dotActive(event.target);
            }
        });

        current.addEventListener('DOMSubtreeModified', () => {

            for (let index = 0; index < slides.length; index++) {
                dotPassive(dots.children[index]);
            }

            const currentObj = document.querySelector(`[data-slide-to="${+current.textContent}"]`);
            dotActive(currentObj);
        });
    }

    function addZeros(item) {
        if (+item.textContent < 10) {
            item.textContent = `0${item.textContent}`;
        }
    }

    function showSlide(index) {
        slides[index].classList.add('show');
        slides[index].classList.remove('hide');
    }

    function hideSlide(index) {
        slides[index].classList.add('hide');
        slides[index].classList.remove('show');
    }

    function setSlideVisibility(slides, currentIndex, total) {
        for (let i = 0; i < slides.length; i++) {
            hideSlide(i);
        }

        showSlide(currentIndex - 1);

        total.textContent = slides.length;
        addZeros(total);
    }

    function slideChange(slides, currentObjectPointer) {

        next.addEventListener('click', () => {
            let index = +currentObjectPointer.textContent;

            hideSlide(index - 1);

            if (index == slides.length) {
                index = 0;
            }

            showSlide(index);

            currentObjectPointer.textContent = index + 1;
            addZeros(currentObjectPointer);
        });

        prev.addEventListener('click', () => {
            let index = +currentObjectPointer.textContent;

            hideSlide(index - 1);

            if (index == 1) {
                index = slides.length + 1;
            }

            showSlide(index - 2);

            currentObjectPointer.textContent = index - 1;
            addZeros(currentObjectPointer);
        });

        currentObjectPointer.addEventListener('DOMSubtreeModified', () => {

            for (let index = 0; index < slides.length; index++) {
                hideSlide(index);
            }

            showSlide(+currentObjectPointer.textContent - 1);

        });
    }

    function setCarouselVisibility(slidesWrapper, slidesInner) {
        slidesWrapper.style.overflow = 'hidden';
        slidesInner.style.width = 100 * slides.length + `%`;
        slidesInner.style.display = 'flex';
        slidesInner.style.transition = '.5s all';
    }

    function carouselChange(slides, currentObjectPointer, slidesInner, slideWidth) {

        slidesInner.style.transform = `translateX(-${slideWidth * (+currentObjectPointer.textContent - 1)}px)`;

        document.querySelector('.offer__slider-counter').addEventListener('click', (event) => {
            if ((event.target.contains(next) || event.target.contains(nextImg)) || (event.target.contains(prev) || event.target.contains(prevImg))) {
                let index = +currentObjectPointer.textContent;

                if (event.target.contains(next) || event.target.contains(nextImg)) {
                    index++;
                }

                if (event.target.contains(prev) || event.target.contains(prevImg)) {
                    index--;
                }

                if (index > slides.length) {
                    index = 1;
                }

                if (index < 1) {
                    index = slides.length;
                }

                slidesInner.style.transform = `translateX(-${slideWidth * (index - 1)}px)`;

                currentObjectPointer.textContent = index;
                addZeros(currentObjectPointer);
            }
        });

        currentObjectPointer.addEventListener('DOMSubtreeModified', () => {
            let index = +currentObjectPointer.textContent;

            if (index > slides.length) {
                index = 1;
            }

            if (index < 1) {
                index = slides.length;
            }
            slidesInner.style.transform = `translateX(-${slideWidth * (index - 1)}px)`;

        });
    }

    // setSlideVisibility(slides, +current.textContent, total);
    // slideChange(slides, current);

    setCarouselVisibility(slidesWrapper, slidesInner);
    carouselChange(slides, current, slidesInner, slideWidth.replace(/\D/g, ''));

    showDots(slider, slides, current);
    dotsChanging(current);

}

export default sliders;