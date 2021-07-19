document.addEventListener('DOMContentLoaded', () => {
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
        buttonsOpen = document.querySelectorAll('[data-modal]'),
        buttonClose = document.querySelector('[data-close]');

    function showModal() {
        modal.classList.toggle('show');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    function hideModal() {
        modal.classList.toggle('show');
        document.body.style.overflow = '';
    }

    function openModal(item) {
        item.addEventListener('click', () => {
            showModal();
        });
    }

    function closeModal(item) {
        item.addEventListener('click', (event) => {
            if (event.target === item) {
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

    closeModal(buttonClose);
    closeModal(modal);

    const modalTimerId = setTimeout(showModal, 5000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            showModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);
});