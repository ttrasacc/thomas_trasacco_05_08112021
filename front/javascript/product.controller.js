const baseUrl = "http://localhost:3000/api/products";
let myCart = JSON.parse(window.localStorage.getItem('cart')) || [];
let myProduct;

getProduct();

//Get and Display selected product informations
function getProduct() {
    const query = new URLSearchParams(window.location.search);
    let request = new XMLHttpRequest();
    request.onreadystatechange = () => {
        if (request.readyState == 4 && request.status == 200) {
            myProduct = JSON.parse(request.responseText);
            fillProductHtml(myProduct);
            let form = document.getElementById('form');
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                const formData = Object.fromEntries(new FormData(event.target).entries());
                formData.id = myProduct._id
                formData.price = myProduct.price;
                addToCart(formData);
            });
        }
    }
    request.open('GET', baseUrl + '/' + query.get('id'));
    request.send();
}


//Add product to cart
function addToCart(data) {
    const newProduct = data;
    let isAdded = false;
    if (newProduct.id && newProduct.color && newProduct.quantity) {
        myCart = myCart.map(product => {
            if (product.id == newProduct.id && product.color == newProduct.color) {
                product.quantity = Number(product.quantity) + Number(newProduct.quantity);
                isAdded = true;
            }
            return product;
        });
        if (!isAdded) myCart.push(newProduct);
        window.localStorage.setItem('cart', JSON.stringify(myCart));
        window.location.href = './index.html';
    }
}

//Display selected product informations
function fillProductHtml(product) {
    let colors = "";
    for (let color of product.colors) {
        colors = colors.concat("<option value='" + color + "'>" + color + "</option>");
    }

    document.getElementById('product-image').innerHTML = 
    "<img src='" + product.imageUrl + "' alt='" + product.altText + "'>";
    document.title = product.name;
    document.getElementById('title').innerHTML = product.name;
    document.getElementById('price').innerHTML = product.price;
    document.getElementById('description').innerHTML = product.description;
    document.getElementById('colors').innerHTML += colors;
}

//handle quantity change event
function onChangeQuantity(quantity) {
    document.getElementById('price').innerHTML = myProduct.price * quantity;
}
