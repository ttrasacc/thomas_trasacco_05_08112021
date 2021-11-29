const baseUrl = "http://localhost:3000/api/products";
let cart = JSON.parse(window.localStorage.getItem('cart')) || [];
products = [];

showCartProducts();

//show cart products and fill array products
function showCartProducts() {
    for (let detailsProduct of cart) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState == 4 && request.status == 200) {
                let myProduct = JSON.parse(request.responseText);
                myProduct.quantity = detailsProduct.quantity;
                myProduct.color = detailsProduct.color;
                products.push(myProduct);
                createHtml(myProduct);
            }
        }
        request.open('GET', baseUrl + '/' + detailsProduct.id);
        request.send();
    }
    setTimeout(() => calculateCartTotal(), 400);
    setTimeout(() => handleFormSend(), 400);
}

//handle ordering Form
function handleFormSend() {
    let form = document.getElementById('formOrder');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (products.length == 0) return setErrorMessage('submitErrorMsg', 'Votre panier est vide.');
        const formData = Object.fromEntries(new FormData(event.target).entries());
        let request = new XMLHttpRequest();
        request.open('POST', baseUrl + '/order', true);
        request.setRequestHeader("Content-Type", "application/json");
        request.onload = (event) => {
            window.localStorage.clear();
            let data = JSON.parse(event.target.responseText);
            window.location.href = "./confirmation.html?orderId=" + data.orderId;
        }
        request.send(JSON.stringify({contact: formData, products: products.map(p => p._id)}));
    });
}

//generate html elements from product
function createHtml(myProduct) {
    let price = (myProduct.quantity * myProduct.price).toFixed(2);
    let article = document.createElement('article');
    article.setAttribute('class', 'cart__item');
    article.setAttribute('id', myProduct._id + '-' + myProduct.color);
    article.setAttribute('data-color', myProduct.color);
    article.innerHTML = `
        <div class="cart__item__img">
          <img src="${myProduct.imageUrl}" alt="${myProduct.altTxt}">
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${myProduct.name}</h2>
                <p>${myProduct.color}</p>
                <p id="price-${myProduct._id}-${myProduct.color}">${price}€</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" id="${myProduct._id}-${myProduct.color}" class="itemQuantity" name="itemQuantity" min="1" max="99" value="${myProduct.quantity}" onchange="onChangeQuantity(value, id)">
                </div>
                <div class="cart__item__content__settings__delete">
                    <p class="deleteItem" id="${myProduct._id}-${myProduct.color}" onclick='onDelete(this.id)'>Supprimer</p>
                </div>
            </div>
        </div>`;
    document.getElementById('cart__items').appendChild(article);
}

//handle quantity change event
function onChangeQuantity(quantity, idInput) {
    const id = idInput.split('-')[0];
    const color = idInput.split('-')[1];
    products = products.map(p => {
        if (p._id == id && p.color == color) p.quantity = quantity
        return p;
    });
    let myProduct = products.find(p => p._id == id && p.color == color);
    let newPrice = quantity * myProduct.price;
    document.getElementById("price-" + id + "-" + color).innerHTML = newPrice + "€";
    calculateCartTotal();
    window.localStorage.setItem('cart', JSON.stringify(products.map(p => ({id: p._id, color: p.color, quantity: p.quantity, price: p.price}))));   
}

//Display the amount of items and the total cost
function calculateCartTotal() {
    let total = 0;
    let nbElements = 0;
    for (let product of products) {
        total += product.price * product.quantity;
        nbElements += Number(product.quantity);
    }
    document.getElementById("totalPrice").innerHTML = total.toFixed(2);
    document.getElementById("totalQuantity").innerHTML = nbElements;
}

//handle product deletion event
function onDelete(composedId) {
    const id = composedId.split('-')[0];
    const color = composedId.split('-')[1];
    products = products.filter(p => p._id != id || p.color != color);
    document.getElementById(composedId).remove();
    window.localStorage.setItem('cart', JSON.stringify(products.map(p => ({id: p._id, color: p.color, quantity: p.quantity, price: p.price}))));   
    calculateCartTotal();
}

/**  Form errors handling  **/

//check Pattern for firstName input
function checkFirstNameValidity(event) {
    const id="firstNameErrorMsg";
    const value = event.value;
    if (!value || value == '') {
        setErrorMessage(id, 'Veuillez entrer votre prénom.');
        return;
    }
    if (value.match(/[A-zÀ-ú][A-zÀ-ú-]+$/)) {
        setErrorMessage(id, '');
        return;
    } else {
        setErrorMessage(id, "Veuillez entrer un prénom valide.");
        return;
    }
}

//check Pattern for lastName input
function checkLastNameValidity(event) {
    const id="lastNameErrorMsg";
    const value = event.value;
    if (!value || value == '') {
        setErrorMessage(id, 'Veuillez entrer votre nom.');
        return;
    }
    if (value.match(/[A-zÀ-ú][A-zÀ-ú-]+$/)) {
        setErrorMessage(id, '');
        return;
    } else {
        setErrorMessage(id, "Veuillez entrer un nom valide.");
        return;
    }
}

//check Pattern for address input
function checkAddressValidity(event) {
    const id="addressErrorMsg";
    const value = event.value;
    if (!value || value == '') {
        setErrorMessage(id, 'Veuillez entrer une adresse.');
        return;
    }
    if (value.match(/[0-9]{1,4}[\s,]{1,2}[A-zÀ-ú][A-zÀ-ú\s'-]{5,}$/)) {
        setErrorMessage(id, '');
        return;
    } else {
        setErrorMessage(id, "Veuillez entrer une adresse valide (ex: 15 rue Paris).");
        return;
    }
}

//check Pattern for city input
function checkCityValidity(event) {
    const id="cityErrorMsg";
    const value = event.value;
    if (!value || value == '') {
        setErrorMessage(id, 'Veuillez entrer le nom d\'une ville.');
        return;
    }
    if (value.match(/[A-zÀ-ú][A-zÀ-ú\s-]+$/)) {
        setErrorMessage(id, '');
        return;
    } else {
        setErrorMessage(id, "Veuillez entrer un nom de ville valide (ex: Paris).");
        return;
    }
}

//check Pattern for email input
function checkEmailValidity(event) {
    const id="emailErrorMsg";
    const value = event.value;
    if (!value || value == '') {
        setErrorMessage(id, 'Veuillez entrer une adresse email.');
        return;
    }
    if (value.match(/^[A-zÀ-ú-\.]+@([A-zÀ-ú-]+\.)+[A-zÀ-ú-]{2,4}$/)) {
        setErrorMessage(id, '');
        return;
    } else {
        setErrorMessage(id, "Veuillez entrer une adresse email valide (ex: exemple@email.com).");
        return;
    }
}

//add error message in html element with ID id
function setErrorMessage(id, error) {
    document.getElementById(id).innerHTML = error;
}