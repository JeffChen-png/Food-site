// import {postData, getData} from '../services/services';

function cards() {

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
}

export default cards;