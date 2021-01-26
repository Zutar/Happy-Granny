class Product{
    constructor(){
        this.products = [];
        this.chart = [];
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
        if(sort === '' || sort === 'best'){
            result = this.getBest();
        }else if(sort === 'lowerPrice'){
            result = this.getLowerPrice();
        }else if(sort === 'biggestWeight'){
            result = this.getBiggestWeight();
        }
        
        return result;
    }

    displayResult(productsArray){
        const gridWrpper = document.querySelector('.grid-wrpper');
        const bestChoiseMain = document.querySelector('.bestChoise-main');
        const priceArray = productsArray[0].price.toString().split('.');
        const bestProduct = productsArray.shift();

        priceArray[1] = priceArray[1].length < 2 ? priceArray[1] + '0' : priceArray[1];

        bestChoiseMain.innerHTML = `
                <div class="col-sm-5 col-md-6">
                    <img class="product-img" src="${bestProduct.image}" alt="" width="200px">
                </div>
                <div class="description col-sm-7 col-md-6">
                    <h4 class="product-title">${bestProduct.name}</h4>
                    <div class="cost d-flex">
                        <p class="hrn">${priceArray[0]}</p>
                        <p class="coin">${priceArray[1]}</p>

                        <p class="product-weight">
                        ${bestProduct.weight} г
                        </p>
                    </div>
                    <div class="nazva-saller d-flex">
                        <p></p>
                        <p>Магазин:</p>
                    </div>
                    <div class="nazva-saller-names m-bottom_0 d-flex">
                        <a href="${bestProduct.url}" target="_blank">Купити</a>
                        <p>${bestProduct.shop_name}</p>
                    </div>
                </div>`;


        let htmlElems = '';

        productsArray.forEach((product) => {
            if(product.weight !== 0 && product.price !== 0){
                const priceArray = product.price.toString().split('.');
                if(priceArray.length === 2){
                    priceArray[1] = priceArray[1].length < 2 ? priceArray[1] + '0' : priceArray[1];
                }else{
                    priceArray[1] = "00";
                }
                htmlElems += `<div class="product">
                <a href="${product.url}" target="_blank">
                    <div class="icon">
                        <img src="${product.image}" alt="">
                    </div>
                </a>
                <div class="product-title">${product.name}</div>
    
                <div class="cost d-flex">
                    <p class="hrn">${priceArray[0]}</p>
                    <p class="coin">${priceArray[1]}</p>
    
                    <p class="product-weight">
                        ${product.weight} г
                    </p>
                </div>
            </div>`;
            }
        });

        gridWrpper.innerHTML = htmlElems;
        this.drawChart();
    }

    drawChart(type='benefit'){
        google.charts.load('current', {packages: ['corechart', 'line']});
        google.charts.setOnLoadCallback(() => {
            let chartData = this.prepareChartData(this.chart);
            if(type === 'benefit'){
                let data = new google.visualization.DataTable();
                data.addColumn('date', 'Date');
                data.addColumn('number', 'Price');
                data.addRows(chartData);
            
                var chart = new google.visualization.ScatterChart(document.getElementById('price-chart'));
                chart.draw(data, {title: 'Графік ціни за грам',
                vAxis: {title: "Ціна", titleTextStyle: {color: "green"}},
                hAxis: {title: "Час", titleTextStyle: {color: "green"}},
                lineWidth: 1, backgroundColor: 'transparent'});
            }
        });
    }

    prepareChartData(data){
        let result = [];
        data.forEach((item, index) => {
            result.push([new Date(item.timestamp), item.avg]);
        });

        return result;
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

    getLowerPrice(){
        let resultArray = [...this.products];

        resultArray.sort((a, b) => {
            if(a.price < b.price) return -1;
            if(a.price > b.price) return 1;
            return 0;
        });

        return resultArray;
    }

    getBiggestWeight(){
        let resultArray = [...this.products];

        resultArray.sort((a, b) => {
            if(a.weight < b.weight) return 1;
            if(a.weight > b.weight) return -1;
            return 0;
        });

        return resultArray;
    }

    start(){
        return new Promise((resolve, reject) => {
            this.getProductsFromSerser().then(result => {
                this.products = result.data;
                this.chart = result.chart;
                if(this.products.length > 0){
                    resolve();
                }else{
                    reject();
                }
            });
        });
    }
}