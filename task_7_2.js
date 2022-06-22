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

    addToBasket(id) {
        const idx = this.items.findIndex(item => {
            return item.id === +id;
        });

        this.items[idx].count++;
        this.render();
    },

    deleteFromBasket(id) {
        const idx = this.items.findIndex(item => {
            return item.id === +id;
        });

        if (this.items[idx].count === 1) {
            this.removeFromBasket(id);
            return;
        } else {
            this.items[idx].count--;
        }
        this.render();
    },

    removeFromBasket(id) {
        console.log(this.items);
        console.log(id);
        const indexItem = this.items.findIndex((item) => {
            return item.id === +id;
        });

        console.log(indexItem);
        this.items.splice(indexItem, 1);
        this.render();
    },

    clickHandler(event) {
        if (event.target.tagName === 'BUTTON') {
            const { id, action } = event.target.dataset

            switch (action) {
                case '/':
                    this.removeFromBasket(id);
                    return;
                case '+':
                    this.addToBasket(id);
                    return;
                case '-':
                    this.deleteFromBasket(id);
                    return;
            }
        }
    },

    renderOrder() {
        const basketWrapperElem = document.getElementById('order');

        basketWrapperElem.innerHTML = '';

        const itemH3Elem = document.createElement('h3');
        itemH3Elem.textContent = 'Состав корзины';
        basketWrapperElem.appendChild(itemH3Elem);

        const basketElem = document.createElement('div');
        this.items.forEach(item => {
            const itemElem = document.createElement('div');

            const itemH3Elem = document.createElement('h5');
            itemH3Elem.textContent = item.name;
            itemElem.appendChild(itemH3Elem);

            const itemPElem = document.createElement('p');
            itemPElem.innerHTML = item.price + '<br>';
            itemElem.appendChild(itemPElem);

            const itemCountElem = document.createElement('p');
            itemCountElem.innerHTML = item.count + '<br>';
            itemElem.appendChild(itemCountElem);

            basketElem.appendChild(itemElem);

        });

        basketWrapperElem.appendChild(basketElem);
    },

    render() {
        const basketWrapperElem = document.getElementById('basket');
        basketWrapperElem.innerHTML = '';
        const basketElem = document.createElement('div');
        this.items.forEach(item => {
            const itemElem = document.createElement('div');

            const itemH2Elem = document.createElement('h2');
            itemH2Elem.textContent = item.name;
            itemElem.appendChild(itemH2Elem);

            const itemPElem = document.createElement('p');
            itemPElem.innerHTML = item.price;
            itemElem.appendChild(itemPElem);

            const itemCountElem = document.createElement('p');
            itemCountElem.innerHTML = item.count + '<br>';
            itemElem.appendChild(itemCountElem);

            const itemButtonPlusElem = document.createElement('button');
            itemButtonPlusElem.textContent = '+';
            itemButtonPlusElem.dataset.id = item.id;
            itemButtonPlusElem.dataset.action = '+';
            itemElem.appendChild(itemButtonPlusElem);

            const itemButtonMinusElem = document.createElement('button');
            itemButtonMinusElem.textContent = '-';
            itemButtonMinusElem.dataset.id = item.id;
            itemButtonMinusElem.dataset.action = '-';
            itemElem.appendChild(itemButtonMinusElem);

            const itemButtonDeleteElem = document.createElement('button');
            itemButtonDeleteElem.textContent = 'x';
            itemButtonDeleteElem.dataset.id = item.id;
            itemButtonDeleteElem.dataset.action = '/';
            itemElem.appendChild(itemButtonDeleteElem);

            basketElem.appendChild(itemElem);
        });

        basketElem.addEventListener('click', (event) => {
            this.clickHandler(event);
        });

        basketWrapperElem.appendChild(basketElem);
    },

    nextEvent() {
        const next = document.getElementById('next');
        next.addEventListener('click', () => {
            this.nextHandler();
        });
    },

    nextHandler() {
        const close = document.getElementById('close');

        let element = null;
        for (let i = 0; i < close.children.length; i++) {
            if (close.children[i].dataset.display === 'true') {
                element = close.children[i];
                element.dataset.display = false;
                element.style.display = 'none';

                if (close.children[i + 1]) {
                    close.children[i + 1].dataset.display = true;
                    close.children[i + 1].style.display = 'block';
                } else {
                    close.children[0].dataset.display = true;
                    close.children[0].style.display = 'block';
                }
                break;
            }
        }
    }
};

basket.renderOrder();
basket.render();
basket.nextEvent();