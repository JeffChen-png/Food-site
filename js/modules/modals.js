function closeModal(item) {
    item.addEventListener('click', (event) => {
        if (event.target === item || event.target.getAttribute('data-close') == '') {
            hideModal(item);
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.code === "Escape" && item.classList.contains('show')) {
            hideModal(item);
        }
    });
}

function hideModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}


function showModal(modalSelector, modalTimerId) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    if (modalTimerId) {
        clearInterval(modalTimerId);
    }
}

function modal(modalSelector, targerSelector, modalTimerId) {

    // Modals

    const modal = document.querySelector(modalSelector),
        buttonsOpen = document.querySelectorAll(targerSelector);

    function openModal(item) {
        item.addEventListener('click', () => {
            showModal(modalSelector, modalTimerId);
        });
    }

    buttonsOpen.forEach(btn => {
        openModal(btn);
    });

    closeModal(modal);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            showModal(modalSelector, modalTimerId);
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

}

export default modal;
export {
    closeModal
};
export {
    showModal
};