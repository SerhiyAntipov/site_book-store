(function () {

    let cart = document.querySelector('.cart');
    let cartEmpty = document.querySelector('.cart-empty');
    let cartPrice = document.querySelector('.cart-price span');
    let cartAdd;
    let tempChartPrice;
    // let bookOrderList;

    calculatorCartPrice();

    // creation Cart Article 
    if (localStorage.getItem("cart") === null || localStorage["cart"] === '[]') {
        cartEmpty.classList.toggle('hidden-cart');
    } else if (localStorage.getItem("cart") != null) {
        let cartLocalStorage = JSON.parse(localStorage["cart"]);
        for (let i = 0; i < cartLocalStorage.length; i++) {
            cart.innerHTML +=
                `
        <article class="cart-article"  data-num-cart-array="${i}">
            <img class="book-img" src="${cartLocalStorage[i]["url"]}" alt="Title${cartLocalStorage[i]["name"]}"
                height="120">
                <div class="data-id hiden">data-id: ${cartLocalStorage[i]["data-id"]}</div>
            <div class="cart-article-information">
                <h3 class="book-name">${cartLocalStorage[i]["name"]}</h3>
                <p class="description">${cartLocalStorage[i]["description"]}</p>
                
                <div>
                    <p class="book-price">Our price:$ <span>${cartLocalStorage[i]["price"]}</span></p>
                    <label class="cart-delete-label" chart-index="${i}">
                        <img src="img/cart_delete.png" alt="cart-delete-button" width="25">
                        <button class="cart-delete-button" type="button"></button>
                    </label>
                </div>
            </div>
        </article>
                `
        };
    }

    // clear cart -----------------------------
    cart.addEventListener("click", function (event) {
        let cartArticle = document.querySelectorAll('.cart-article');
        if (event.target.className === 'cart-delete-button' && cartArticle.length > 1) {
            deleteCartBook(event)
            cartArticle = document.querySelectorAll('.cart-article');
        } else if (event.target.className === 'cart-delete-button' && cartArticle.length === 1) {
            deleteCartBook(event)
            document.location.href = "index.html"
        };
    });

    function deleteCartBook(event) {
        let path = event.composedPath ? event.composedPath() : event.path;
        let localStorageCart = JSON.parse(localStorage["cart"]);
        let chartIndex = event.target.parentElement.getAttribute("chart-index");
        
        localStorageCart.splice(chartIndex, 1);
        localStorageCart = JSON.stringify(localStorageCart);
        localStorage.setItem("cart", localStorageCart);
        
        path[4].remove();
        calculatorCartPrice();
    };

    function calculatorCartPrice() {
        if (localStorage.getItem("cart") != null) {
            cartAdd = JSON.parse(localStorage.getItem("cart"));
            tempChartPrice = 0;
            for (let i = 0; i < cartAdd.length; i++) {
                tempChartPrice += +cartAdd[i]["price"];
            }
            cartPrice.innerHTML = tempChartPrice.toFixed(2);
            sendOrder();
        } else if (localStorage.getItem("cart") != "[]") {
            cartPrice.innerHTML = (0).toFixed(2);
        } else {
            cartPrice.innerHTML = (0).toFixed(2);
        };
    };

    function sendOrder() {
        let submitForm = document.querySelector('#submit-form');
        let bookOrderList = document.querySelector('.book-order-list');
        // bookOrderList = document.querySelector('.book-order-list');
        submitForm.addEventListener('click', function () {
            let cartArticle = document.querySelectorAll('.cart-article');
            // creation new field order form 
            bookOrderList.innerHTML = "";
            for (let i = 0; i < cartArticle.length; i++) {
                bookOrderList.innerHTML += `<input class="orderForm" type="text" name="${i+1}-book">`
            };
            fillingOrderForm(cartArticle)
        });
    };

    function fillingOrderForm(cartArticle) {
        let orderForm = document.querySelectorAll('.orderForm');
        for (let i = 0; i < orderForm.length; i++) {
            orderForm[i].value = cartArticle[i].children[1].innerHTML + " / " + cartArticle[i].childNodes[5].children[0].innerText;
            orderForm[i].value += " / Price: " + cartArticle[i].children[2].children[2].children[0].children[0].innerText;
        };

    }
})();