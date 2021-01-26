const {JSDOM} = require('jsdom');

class Parser{
    constructor(client){
        this.client = client;
        this.document = null;
        this.wave = 0;
    }

    start(url = []){
        // 'https://zakaz.atbmarket.com/search/647?text=%D0%B3%D1%80%D0%B5%D1%87%D0%B0%D0%BD%D0%B0','https://www.tavriav.ua/catalog/search/?catalogId=94&query=%D0%B3%D1%80%D0%B5%D1%87%D0%B0%D0%BD%D0%B0%20%D0%BA%D1%80%D1%83%D0%BF%D0%B0'
        if(url.length === 0){
            this.client.query(`SELECT * FROM key_words kw JOIN shop s ON kw.shopId=s.id;`, (error, result, fields) => {
                this.client.query(`SELECT MAX(wave) FROM products;`, (e, r, f) => {
                    this.wave = !r.rows[0].max ? 1 : r.rows[0].max + 1;
                    this.getPages(result.rows);
                });
            });
        }
    }

    getPages(keyWords){
        for(let i = 0; i < keyWords.length; i++){
            if(keyWords[i].search_url && keyWords[i].search){
                const url = `${keyWords[i].search_url}${keyWords[i].search}`;
                console.log(url);
                JSDOM.fromURL(url, {}).then(dom => {
                    this.document = dom.window.document;
                    this.parsePage(keyWords[i]);
                });
            }
        }

    }

    parsePage(keyWords){
        const url = keyWords.url;
        let productsArray = [];
        if(url.indexOf('tavriav') !== -1){
            productsArray = this.parseTavria();
        }else if(url.indexOf('atbmarket') !== - 1){
            productsArray = this.parseATB();
        }else if(url.indexOf('produkty24') !== - 1){
            productsArray = this.parseObjora();
        }
        console.log(productsArray);
        this.saveData(productsArray, keyWords);
    }

    convertMeasure(segment, prevSegment, char){
        if(segment === 'г' || segment === 'кг' || prevSegment.indexOf('0г') !== -1){
            let weight = 0;
            weight = prevSegment.replace(/,/, '.');
            if(weight.indexOf(char) !== -1){
                const weightSegments = weight.split(char);
                weight = weightSegments[0] * weightSegments[1];
            }else{
                weight = parseFloat(weight);
            }
            if(segment === 'кг') weight = weight * 1000;
            return weight;
        }
        return false;
    }

    parseTavria(){
        const document = this.document;
        const price = document.querySelectorAll('.product__price');
        const title = document.querySelectorAll('.product__title > a');
        const image = document.querySelectorAll('.product__image img');

        let productArray = [];
        for(let i = 0; i < price.length; i++){
            const product = {}
            product.price = parseFloat(price[i].textContent);
            product.title = title[i].textContent;
            product.image = image[i].src;
            product.weight = 0;
            // Split title for find product weight
            const titleSegments = product.title.split(' ');
            for(let j = 1; j < titleSegments.length; j++){
                const convertResult = this.convertMeasure(titleSegments[j], titleSegments[j - 1], 'х');
                if(convertResult){
                    product.weight = convertResult;
                    break;
                }
            };

            productArray.push(product); 
        }
        
        return productArray;
    }

    parseATB(){
        const document = this.document;
        let price = document.querySelectorAll('.price');
        const title = document.querySelectorAll('.product-detail.text-center div');
        const image = document.querySelectorAll('.img-fluid.bg-img');

        let productArray = [];
        for(let i = 0; i < price.length; i++){
            const product = {}
            product.price = price[i].innerHTML.split('>');
            product.price = parseInt(product.price[0]) + parseFloat('0.' + parseInt(product.price[1]));
            product.title = title[i].textContent;
            product.image = image[i].src;
            product.weight = 0;
            // Split title for find product weight
            const titleSegments = product.title.split(' ');
            for(let j = 1; j < titleSegments.length; j++){
                const convertResult = this.convertMeasure(titleSegments[j], titleSegments[j - 1], 'х');
                if(convertResult){
                    product.weight = convertResult;
                    break;
                }
            };
            productArray.push(product); 
        }
        
        return productArray;
    }

    parseObjora(){
        const document = this.document;
        let priceVal = document.querySelectorAll('.val');
        let priceCents = document.querySelectorAll('.cents');
        const title = document.querySelectorAll('.products .header');
        const image = document.querySelectorAll('.photo');

        let productArray = [];
        for(let i = 0; i < title.length; i++){
            const product = {}
            product.price = parseInt(priceVal[i].textContent) + parseFloat('0.' + priceCents[i].textContent);
            product.title = title[i].textContent;
            product.image = image[i].src;
            product.weight = 0;
            // Split title for find product weight
            const titleSegments = product.title.split(' ');
            for(let j = 1; j < titleSegments.length; j++){
                const convertResult = this.convertMeasure(titleSegments[j], titleSegments[j - 1], '*');
                if(convertResult){
                    product.weight = convertResult;
                    break;
                }
            };
            productArray.push(product); 
        }

        return productArray;
        
    }

    saveData(productsArray, keyWords){
        let query = 'INSERT INTO products VALUES ';
        for(let i = 0; i < productsArray.length; i++){
            const product = productsArray[i];
            query += `(DEFAULT, '${product.title}', ${keyWords.shopid}, ${keyWords.categoryid}, ${product.price}, ${product.weight}, '', '', ${this.wave}, DEFAULT, '${product.image}'), `;
        }
        query = query.slice(0, -2) + ';';

        this.client.query(query, (error, result, fields) => {
            
        });

    }
}

module.exports = Parser;