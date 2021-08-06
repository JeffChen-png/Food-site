'use strict';

import calculators from './modules/calculators';
import cards from './modules/cards';
import forms from './modules/forms';
import modals from './modules/modals';
import sliders from './modules/sliders';
import tabs from './modules/tabs';
import timers from './modules/timers';
import {
    showModal
} from './modules/modals';

window.addEventListener('DOMContentLoaded', () => {

    const modalTimerId = setTimeout(() => {
        showModal('.modal', modalTimerId);
    }, 5000);

    calculators();
    cards();
    forms(modalTimerId);
    modals('.modal', '[data-modal]', modalTimerId);
    sliders({
        prevSelector: '.offer__slider-prev',
        nextSelector: '.offer__slider-next',
        sliderContainerSelector: '.offer__slider',
        currentSelector: '#current',
        totalSelector: '#total',
        slideSelector: '.offer__slide',
        slidesWrapperSelector: '.offer__slider-wrapper',
        slidesInnerSelector: '.offer__slider-inner',

    });
    tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
    timers();
});