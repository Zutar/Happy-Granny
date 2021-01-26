class Product{
    constructor(){
        this.products = [];
    }
    
    getProductsFromSerser(){
        return new Promise((resolve, reject) => {
            fetch('/products')
            .then(result => result.json())
            .then(data => {
                resolve(data);
            });
        });
    }

    sortResult(sort = ''){
        let result = null;
        if(sort === '' || sort === 'price/weight'){
            result = this.getBest();
        }else if(sort === 'lowerPrice'){

        }else if(sort === 'biggestWeight'){

        }
        
        return result;
    }

    displayResult(productsArray){
        const gridWrpper = document.querySelector('.grid-wrpper');
        const bestChoiseMain = document.querySelector('.bestChoise-main');
        const priceArray = productsArray[0].price.toString().split('.');
        priceArray[1] = priceArray[1].length < 2 ? priceArray[1] + '0' : priceArray[1];

        bestChoiseMain.innerHTML = `
                <div class="col-sm-5 col-md-6">
                    <img class="product-img" src="${productsArray[0].image}" alt="" width="200px">
                </div>
                <div class="description col-sm-7 col-md-6">
                    <h4 class="product-title">${productsArray[0].name}</h4>
                    <div class="cost d-flex">
                        <p class="hrn">${priceArray[0]}</p>
                        <p class="coin">${priceArray[1]}</p>

                        <p class="product-weight">
                        ${productsArray[0].weight} г
                        </p>
                    </div>
                    <div class="nazva-saller d-flex">
                        <p>Назва товару:   </p>
                        <p>Продавець:</p>
                    </div>
                    <div class="nazva-saller-names m-bottom_0 d-flex">
                        <p>Гречана з грибами</p>
                        <p>${productsArray[0].shop_name}</p>
                    </div>
                </div>`;


        let htmlElems = '';
        const bestProduct = productsArray.shift();

        productsArray.forEach((product) => {
            const priceArray = product.price.toString().split('.');
            priceArray[1] = priceArray[1].length < 2 ? priceArray[1] + '0' : priceArray[1];
            htmlElems += `<div class="">
            <div class="icon">
                <img src="${product.image}" alt="" width="150px">
            </div>

            <div class="product-title">${product.name}</div>

            <div class="cost d-flex">
                <p class="hrn">${priceArray[0]}</p>
                <p class="coin">${priceArray[1]}</p>

                <p class="product-weight">
                    ${product.weight} г
                </p>
            </div>
        </div>`;
        });
        gridWrpper.innerHTML = htmlElems;
    }

    getBest(){
        let resultArray = [...this.products];

        resultArray.forEach((item, index, arr) => {
            arr[index].pricePerGram = item.price / item.weight;
            if(!item.pricePerGram){
                arr.splice(index, 1);
            }
        });

        resultArray.sort((a, b) => {
            if(a.pricePerGram < b.pricePerGram) return -1;
            if(a.pricePerGram > b.pricePerGram) return 1;
            return 0;
        });

        return resultArray;
    }

    start(){
        return new Promise((resolve, reject) => {
            this.getProductsFromSerser().then(result => {
                this.products = result.data;

                if(this.products.length > 0){
                    resolve();
                }else{
                    reject();
                }
            });
        });
    }
}