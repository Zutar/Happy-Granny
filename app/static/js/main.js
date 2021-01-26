window.onload = () => {
    let product = new Product();

    product.start().then(() => {
        const productsArray = product.sortResult();
        console.log(productsArray);
        product.displayResult(productsArray);
    });
}
