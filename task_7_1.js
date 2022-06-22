const basket = {
    items: [
        {
            id: 0,
            productId: 0,
            name: 'plate',
            model: "A1",
            color: "white",
            price: 115,
            count: 1,
        },
        {
            id: 1,
            productId: 1,
            name: 'fork',
            model: "B2",
            color: "silver",
            price: 34,
            count: 2,
        },
        {
            id: 2,
            productId: 2,
            name: 'spoon',
            model: "C3",
            color: "grey",
            price: 32,
            count: 1,
        },
        {
            id: 3,
            productId: 3,
            name: 'knife',
            model: "D4",
            color: "black",
            price: 80,
            count: 2,
        },
    ],

    getTotalPrice() {
        return this.items.reduce((acc, item) => {
            return acc + item.price * item.count;
        }, 0);
    },

    getBasketLength() {
        return this.items.length;
    },

    addToBasket(product) {
        const idx = this.items.findIndex(item => {
            return item.productId === +product.id;
        });

        if (idx === -1) {
            this.items.push({
                id: this.items.length === 0 ? 0 : this.items[this.items.length - 1].id + 1,
                productId: product.id,
                name: product.name,
                price: product.price,
                count: 1,
            });
        } else {
            this.items[idx].count++;
        }
        this.render();
    },

    render() {
        const basketWrapperElem = document.getElementById('basket');
        basketWrapperElem.innerHTML = '';
        const basketElem = document.createElement('div');
        if (this.getBasketLength() === 0) {
            basketElem.textContent = 'Корзина пуста';
        } else {
            basketElem.textContent = `В корзине: ${this.getBasketLength()} товаров на сумму ${this.getTotalPrice()} рублей`;
        }
        basketWrapperElem.appendChild(basketElem);
    },
};

const catalog = {
    basket,

    items: [
        {
            id: 0,
            name: 'plate',
            model: "A1",
            color: "white",
            price: 115,
        },
        {
            id: 1,
            name: 'fork',
            model: "B2",
            color: "silver",
            price: 34,
        },
        {
            id: 2,
            name: 'spoon',
            model: "C3",
            color: "grey",
            price: 32,
        },
        {
            id: 3,
            name: 'knife',
            model: "D4",
            color: "black",
            price: 80,
        },
    ],

    clickHandler(event) {
        if (event.target.tagName === 'BUTTON') {
            const idx = this.items.findIndex(item => {
                return item.id === +event.target.dataset.id;
            });
            basket.addToBasket(this.items[idx]);
        }
    },

    render() {
        const catalogWrapperElem = document.getElementById('catalog');
        const catalogElem = document.createElement('div');
        this.items.forEach(item => {
            const itemElem = document.createElement('div');

            const itemH2Elem = document.createElement('h2');
            itemH2Elem.textContent = item.name;
            itemElem.appendChild(itemH2Elem);

            const itemPElem = document.createElement('p');
            itemPElem.innerHTML = item.price;
            itemElem.appendChild(itemPElem);

            const itemButtonElem = document.createElement('button');
            itemButtonElem.textContent = 'buy';
            itemButtonElem.dataset.id = item.id;
            itemElem.appendChild(itemButtonElem);

            catalogElem.appendChild(itemElem);
        });

        catalogElem.addEventListener('click', (event) => {
            this.clickHandler(event);
        });

        catalogWrapperElem.appendChild(catalogElem);
    }
}

catalog.render();
basket.render(); 