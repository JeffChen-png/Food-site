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
        
        convertPriseFromTo(current, convert) {
            let index;
            const convertValues = {
                USD: 80,
                RUB: 1,
                EU: 90,
                FR: 100,
                GR: 2 
            };
            if(convertValues[current] < convertValues[convert]) {
                index = convertValues[current]/convertValues[convert];
            } else if (convertValues[current] >= convertValues[convert]){
                index = convertValues[convert]/convertValues[current];
            } else {
                return this.price.toFixed(2);
            }
            return (this.price*index).toFixed(2);
        }
    }

    const fitnesMenu = new MenuItem('.menu__field', 'img/tabs/vegy.jpg', 'vegy', 'Фитнес', 'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!', 20, 'USD', 'EU');
    const premMenu = new MenuItem('.menu__field', 'img/tabs/elite.jpg', 'vegy', 'Фитнес', 'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.', 50, 'USD', 'EU');
    const postMenu = new MenuItem('.menu__field', 'img/tabs/post.jpg', 'vegy', 'Фитнес', 'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!', 70, 'USD', 'EU');
    
    fitnesMenu.render();
    premMenu.render();
    postMenu.render();

    // обработка форм

    const forms = document.querySelectorAll('form');

    const message = {
        loading: './img/form/spinner.svg',
        success: 'success',
        failed: 'failed',
    };

    forms.forEach(item => {
        postData(item);
    });

    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');

            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;

            form.append(statusMessage);

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');

            const formData = new FormData(form);

            request.send(formData);

            // request.setRequestHeader('Content-type', 'application/json'); // для json

            // const object = {};

            // formData.forEach(function (value, key) {
            //     object[key] = value;
            // });

            // const json = JSON.stringify(object); // для json
            // request.send(json);

            request.addEventListener('load', () => {
                if (request.status === 200) {
                    console.log(request.response);
                    showThanksModal(message.success);
                    form.reset();
                    statusMessage.remove();
                } else {
                    showThanksModal(message.failed);
                }
            });

        });
    }

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
});