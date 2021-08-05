import {closeModal, showModal} from './modals';
// import {postData, getData} from '../services/services';

function forms(modalTimerId) {

    // обработка форм

    const forms = document.querySelectorAll('form');
    const modal = document.querySelector('.modal');


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

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        showModal('.modal', modalTimerId);

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

}

export default forms;