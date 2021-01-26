window.onload = () => {
    let product = new Product();

    product.start().then(() => {
        const productsArray = product.sortResult();
        console.log(productsArray);
        product.displayResult(productsArray);
    });

    const bestChoiseSwitcher = document.querySelector('.bestChoise-switcher');
    bestChoiseSwitcher.onclick = (event) => {
        console.log(event.target);
    }
}
