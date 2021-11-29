

//get orderId in page url parameters
setTimeout(() => {
    let query = new URLSearchParams(window.location.search);
    document.getElementById('orderId').innerHTML = query.get('orderId');
}, 400);