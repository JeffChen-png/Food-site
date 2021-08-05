function calculators() {

    // Калькулятор

    const result = document.querySelector('.calculating__result span');
    let sex = 'female',
        ratio = 1.375,
        height, weight, age;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', sex);
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
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');
    calcTotal();

    getDynamicInfo('#height');
    getDynamicInfo('#weight');
    getDynamicInfo('#age');

    getStaticInfo('#gender div', 'calculating__choose-item_active');
    getStaticInfo('.calculating__choose_big div', 'calculating__choose-item_active');

}

export default calculators;