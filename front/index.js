const baseUrl = "http://localhost:3000/api/products";

getAllProducts();

//Get and Display all products
function getAllProducts() {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            let allItemsHtml = "";
            let products = JSON.parse(xmlHttp.responseText);
            for (let product of products) {
                allItemsHtml = allItemsHtml.concat("<a href='./product.html?id=" + product._id + "'>" +
                "<article id='" + product._id + "'> <img src='" + product.imageUrl + "' alt='" + product.altText + "'>" +
                "<h3 class='productName'>" + product.name + "</h3>" +
                "<p class='productDescription'>" + product.description + "</p>" +
                "</article>" +
                "</a>");
            }
            document.getElementById("items").innerHTML = allItemsHtml;
        }
    };
    xmlHttp.open( "GET", baseUrl + '/');
    xmlHttp.send();
}

