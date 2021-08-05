function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeSelector) {
    
    //Tabs 

    const tabs = document.querySelectorAll(tabsSelector),
        tabsContent = document.querySelectorAll(tabsContentSelector),
        tabsParent = document.querySelector(tabsParentSelector);

    function hideTabsContent() {
        tabsContent.forEach(item => {
            item.style.display = 'none';
        });

        tabs.forEach(item => {
            item.classList.remove(activeSelector);
        });
    }

    function showTabContent(i) {
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add(activeSelector);
    }

    hideTabsContent();
    showTabContent(1);

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains(tabsSelector.slice(1))) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabsContent();
                    showTabContent(i);
                }
            });
        }
    });
}

export default tabs;