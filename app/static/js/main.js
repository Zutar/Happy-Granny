window.onload = () => {
    let product = new Product();

    product.start().then(() => {
        const productsArray = product.sortResult();
        product.displayResult(productsArray);
        console.log(productsArray);
    });

    const bestChoiseSwitcher = document.querySelector('.bestChoise-switcher');
    const switherArr = document.querySelectorAll('.swither');

    bestChoiseSwitcher.onclick = (event) => {
        const activeElem = event.target;
        switherArr.forEach((item) => {
            item.classList.remove('swither-active');
        });
        activeElem.classList.add('swither-active');

        const productsArray = product.sortResult(activeElem.dataset.sort);
        product.displayResult(productsArray);
    }
}
