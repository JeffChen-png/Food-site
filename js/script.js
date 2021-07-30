'use strict';

window.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabsContent() {
        tabsContent.forEach(item => {
            item.style.display = 'none';
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i) {
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabsContent();
    showTabContent(1);

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabsContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer 

    const deadLine = '2021-10-11';

    function getTimeRemain(endtime) {
        const tmp = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(tmp / (1000 * 60 * 60 * 24)),
            hours = Math.floor((tmp / (1000 * 60 * 60)) % 24),
            minutes = Math.floor(tmp / (1000 * 60) % 60),
            seconds = Math.floor(tmp / 1000 % 60);

        return {
            'total': tmp,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, deadLine) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemain(deadLine);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadLine);

    // Modals

    const modal = document.querySelector('.modal'),
        buttonsOpen = document.querySelectorAll('[data-modal]');

    function showModal() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    function hideModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openModal(item) {
        item.addEventListener('click', () => {
            showModal();
        });
    }

    function closeModal(item) {
        item.addEventListener('click', (event) => {
            if (event.target === item || event.target.getAttribute('data-close') == '') {
                hideModal();
            }
        });
        document.addEventListener('keydown', (event) => {
            if (event.code === "Escape" && modal.classList.contains('show')) {
                hideModal();
            }
        });
    }

    buttonsOpen.forEach(btn => {
        openModal(btn);
    });

    closeModal(modal);

    const modalTimerId = setTimeout(showModal, 5000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            showModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // Классы для карточек 

    class MenuItem {
        constructor(selector, img, alt, subtitle, descr, price, current, convert) {
            this.img = img;
            this.alt = alt;
            this.subtitle = subtitle;
            this.descr = descr;
            this.price = price;
            this.convert = convert;
            this.parentSelector = document.querySelector(selector);
            this.price = this.convertPriseFromTo(current, convert);
        }

        render() {
            this.parentSelector.children[0].insertAdjacentHTML('beforeend', `
                <div class="menu__item">
                    <img src="${this.img}" alt="${this.alt}">
                    <h3 class="menu__item-subtitle">Меню "${this.subtitle}"</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                        <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price} </span> ${this.convert}/день</div>
                    </div>
                </div>
            `);
        }

        convertPriseFromTo(current = undefined, convert = undefined) {
            let index;
            const convertValues = {
                USD: 80,
                RUB: 1,
                EU: 90,
                FR: 100,
                GR: 2
            };
            if (convertValues[current] < convertValues[convert]) {
                index = convertValues[current] / convertValues[convert];
            } else if (convertValues[current] >= convertValues[convert]) {
                index = convertValues[convert] / convertValues[current];
            } else {
                this.convert = 'грн';
                return this.price.toFixed(2);
            }
            return (this.price * index).toFixed(2);
        }
    }

    // обработка форм

    const forms = document.querySelectorAll('form');

    const message = {
        loading: './img/form/spinner.svg',
        success: 'success',
        failed: 'failed',
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');

            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;

            form.append(statusMessage);

            const formData = new FormData(form);
            // const object = {};

            // formData.forEach(function (value, key) {
            //     object[key] = value;
            // });

            // const json = JSON.stringify(Object.fromEntries(formData.entries()));

            // postData('http://localhost:3000/requests', json)
            //     .then(data => {
            //         console.log(data);
            //         showThanksModal(message.success);
            //         form.reset();
            //         statusMessage.remove();
            //     }).catch(() => {
            //         showThanksModal(message.failed);
            //     }).finally(() => {
            //         form.reset();
            //     });

            axios.post('http://localhost:3000/requests', Object.fromEntries(formData.entries()))
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    form.reset();
                    statusMessage.remove();
                }).catch(() => {
                    showThanksModal(message.failed);
                }).finally(() => {
                    form.reset();
                });
        });
    }


    // const postData = async (url, data) => {
    //     const res = await fetch(url, {
    //         method: "POST",
    //         headers: {
    //             'Content-type': 'application/json'
    //         },
    //         body: data
    //     });

    //     return await res.json(); // async - await - для создания очереди выполнения 
    // };

    const getData = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Ошибка получения данных ${res.status}, ${url}`);
        }
        return await res.json();
    };

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        showModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div data-close="" class="modal__close">×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        modal.append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.remove('hide');
            closeModal(modal);
        }, 4000);
    }

    // fetch('http://localhost:3000/menu')
    //     .then(data => data.json())
    //     .then(res => console.log(res));


    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({
                img,
                altimg,
                title,
                descr,
                price
            }) => {
                new MenuItem('.menu__field', img, altimg, title, descr, price).render();
            });
        });

    // getData('http://localhost:3000/menu')
    //     .then(data => {
    //         data.forEach(({
    //             img,
    //             altimg,
    //             title,
    //             descr,
    //             price
    //         }) => {
    //             new MenuItem('.menu__field', img, altimg, title, descr, price).render();
    //         });
    //     });

    // Slider 

    const prev = document.querySelector('.offer__slider-prev'),
        slider = document.querySelector('.offer__slider'),
        next = document.querySelector('.offer__slider-next'),
        current = document.querySelector('#current'),
        total = document.querySelector('#total'),
        slides = document.querySelectorAll('.offer__slide'),
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

    // дописать

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
            hideSlide(i)
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

    // Калькулятор

    const result = document.querySelector('.calculating__result span');
    let sex = 'female', ratio = 1.375, height, weight, age;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', sex)
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', ratio);
    }

    if (localStorage.getItem('height')) {
        height = localStorage.getItem('height');
        document.querySelector('#height').value = height;
    }

    if (localStorage.getItem('weight')) {
        weight = localStorage.getItem('weight');
        document.querySelector('#weight').value = weight;
    }

    if (localStorage.getItem('age')) {
        age = localStorage.getItem('age');
        document.querySelector('#age').value = age;
    }

    function calcTotal() {

        if (!height || !weight || !age) {
            result.textContent = 'Ошибка ввода данных';
            return;
        }

        if (sex == 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    function initLocalSettings(target, activeClass) {
        const elements = document.querySelectorAll(target);

        elements.forEach(element => {
            element.classList.remove(activeClass);

            if (element.getAttribute('data-ratio') === localStorage.getItem('ratio') || element.getAttribute('id') === localStorage.getItem('sex')) {
                element.classList.add(activeClass);
            }
        });
    }

    function getStaticInfo(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(element => {
            element.addEventListener('click', (event) => {
                if (event.target.getAttribute('data-ratio')) {
                    ratio = +event.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', ratio);
                } else if (event.target.getAttribute('id')) {
                    sex = event.target.getAttribute('id');
                    localStorage.setItem('sex', sex);
                }

                elements.forEach(item => {
                    item.classList.remove(activeClass);
                });

                event.target.classList.add(activeClass);
                calcTotal();
            });
        });
    }

    function getDynamicInfo(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', (event) => {

            if (input.value.match(/\D/g)) {
                input.style.border = '1px solid red';
            } else {
                input.style.border = '';
            }

            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    localStorage.setItem('height', +input.value);
                    break;
                case 'weight':
                    weight = +input.value;
                    localStorage.setItem('weight', +input.value);
                    break;
                case 'age':
                    age = +input.value;
                    localStorage.setItem('age', +input.value);
                    break;
            }
            calcTotal();
        })
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');
    calcTotal();

    getDynamicInfo('#height');
    getDynamicInfo('#weight');
    getDynamicInfo('#age');

    getStaticInfo('#gender div', 'calculating__choose-item_active');
    getStaticInfo('.calculating__choose_big div', 'calculating__choose-item_active');
    
});