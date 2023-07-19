(function () {

    let booksData
    let allBooksData;
    const content = document.querySelector('.content');
    const booklistArray = document.querySelector('.book-list-array');
    const bookListPage = document.querySelector('.book-list-page');
    const navMain = document.querySelector('.nav-main');
    const allCategories = document.querySelectorAll('.nav-main a');
    const categories = document.querySelector('.categories');
    let pageNumberList;
    let currentPage = 1;
    let activeNavMenuLink = 1;
    const booksOnPage = 12;
    const wrapperBookDescription = document.querySelector('.wrapper-book-description');
    let selectedSection;
    let cartAdd;

    const cartPrice = document.querySelector('.cart-price span');
    const searchMain = document.querySelector('.search-main');
    const navMainBurger = document.querySelector('.nav-main');


    getAjaxJsonBookData();

    function getAjaxJsonBookData() {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                booksData = JSON.parse(xhr.response);
                creationBookStore(booksData);
            }
        }
        xhr.open('GET', 'book-data.json');
        xhr.send();
    }

    function creationBookStore(booksData) {
        allBooksData = booksData;
        selectedSection = booksData;
        creationBooklist(allBooksData);

        bookListPage.addEventListener('click', function (event) {
            changePage(event, allBooksData);
        });

        navMain.querySelector('ul').addEventListener('click', function (event) {
            menuSectionChange(event);
        });

        searchMain.addEventListener('click', function () {
            search(booksData)
        });

        calculatorCartPrice();
        slider();
        clickOnBook();
    };

    function creationBooklist(allBooksData) {
        currentPage = 1;
        let quantityPages = Math.ceil(allBooksData["data-id"].length / booksOnPage);
        // quantity pages-------------------
        let pageIndex = "";
        for (let i = 1; i <= quantityPages; i++) {
            pageIndex += `<p class="page" data-list="${i}">${i}</p>`;
        };
        bookListPage.innerHTML = pageIndex;
        // creation page (12 books)-------------------------
        booklistArray.innerHTML = "";
        for (let i = 0; i < booksOnPage && i < allBooksData["data-id"].length; i++) {
            creationBookArticles(i, allBooksData);
        };
        // 1-st page set setAttribute data-list="active"--------------
        pageNumberList = document.querySelectorAll('.book-list-page .page');
        pageNumberList[currentPage - 1].setAttribute('data-list', 'active');
    };

    function creationBookArticles(i, allBooksData) {
        booklistArray.innerHTML +=
            `
        <article class="main-article" data-id="${allBooksData["data-id"][i]}">
            <img class="book-img" src="${allBooksData["url"][i]}.png" alt="Title ${allBooksData["name"][i]}" height="160">
            <h3 class="book-name">${allBooksData["name"][i]}</h3>
            <p class="book-author">${allBooksData["author"][i]}</p>
            <p class="book-price">$<span>${(allBooksData["price"][i]/100).toFixed(2)}</span></p>
        </article>
            `
    };

    function changePage(event, allBooksData) {
        allBooksData = selectedSection;
        if (event.target.className === 'page' && event.target.attributes[1].nodeValue !== 'active') {
            booklistArray.innerHTML = '';
            for (let i = booksOnPage * (event.target.innerText - 1); i < booksOnPage * event.target.innerText && i < allBooksData["data-id"].length; i++) {
                creationBookArticles(i, allBooksData);
            };
            pageNumberList[event.target.innerText - 1].setAttribute('data-list', 'active');
            pageNumberList[currentPage - 1].setAttribute('data-list', 'no-active');
            currentPage = event.target.innerText;
        };
    };

    function clickOnBook() {
        content.addEventListener('click', function (event) {
            let dataId = '';
            if (event.target.className === 'book-img') {
                // definition data-id
                dataId = event.target.parentElement.getAttribute("data-id");
                creationBookDescription(dataId, booksData);
            } else if (event.target.className === 'aside-button') {
                // definition data-id
                dataId = event.target.parentElement.parentElement.getAttribute("data-id");
                creationBookDescription(dataId, booksData);
            }
        });
    };

    function creationBookDescription(dataId, allBooksData) {
        let description =
            `
        <div class="book-description">
        <div class="close-description"></div>
        <div class="description-img-price">
            <img class="book-img" src="${allBooksData["url"][dataId]}.png" alt="Title ${allBooksData["name"][dataId]}">
            <p>Our price:$</p>
            <p class="book-price">${(allBooksData["price"][dataId]/100).toFixed(2)}</p>
            <button class="description-button green-btn" type="button">Add cart</button>
        </div>
        <div class="book-description-info">
            <h3 class="book-name">${allBooksData["name"][dataId]}</h3>
            <p class="book-author">${allBooksData["author"][dataId]}</p>
            <p class="book-year">${allBooksData["year"][dataId]}</p>
            <p class="description">${allBooksData["description"][dataId]}</p>
            <div class="data-id">Book data-id: <span>${allBooksData["data-id"][dataId]}</span></div>
        </div>
        </div>
                `;
        wrapperBookDescription.innerHTML = description;
        wrapperBookDescription.style.visibility = 'visible';
        closeBookDescription();
        addBook();
    };

    function addBook() {
        let addCart = document.querySelector('.description-button.green-btn');

        addCart.addEventListener('click', function () {
            if (localStorage.getItem("cart") != null) {
                cartAdd = JSON.parse(localStorage.getItem("cart"));
            } else {
                cartAdd = [];
            };

            let bookDataId = document.querySelector('.book-description-info .data-id span');
            let bookImg = document.querySelector('.description-img-price .book-img');
            let bookAuthor = document.querySelector('.book-description-info .book-author');
            let bookYear = document.querySelector('.book-description-info .book-year');
            let bookName = document.querySelector('.book-description-info .book-name');
            let bookDescription = document.querySelector('.book-description-info .description');
            let bookPrice = document.querySelector('.description-img-price .book-price');

            cartAdd.push({
                "data-id": bookDataId.innerHTML,
                "url": bookImg.src,
                "author": bookAuthor.innerHTML,
                "year": bookYear.innerHTML,
                "name": bookName.innerHTML,
                "description": bookDescription.innerHTML,
                "price": bookPrice.innerHTML
            })

            localStorage.setItem("cart", JSON.stringify(cartAdd));
            calculatorCartPrice()
        });
    }

    function calculatorCartPrice() {
        let tempChartPrice;
        if (localStorage.getItem("cart") != null) {
            cartAdd = JSON.parse(localStorage.getItem("cart"));
            tempChartPrice = 0;
            for (let i = 0; i < cartAdd.length; i++) {
                tempChartPrice += +cartAdd[i]["price"];
            }
            cartPrice.innerHTML = tempChartPrice.toFixed(2);
        } else if (localStorage.getItem("cart") != "[]") {
            cartPrice.innerHTML = (0).toFixed(2);
        } else {
            cartPrice.innerHTML = (0).toFixed(2);
        };
    };

    function closeBookDescription() {
        let = descriptionClose = document.querySelector('.close-description');
        let = descriptionButton = document.querySelector('.description-button');
        descriptionClose.addEventListener('click', function closeDescriptionWindow() {
            wrapperBookDescription.style.visibility = 'hidden';
        });

        descriptionButton.addEventListener('click', function () {
            wrapperBookDescription.style.visibility = 'hidden';
        });
    };

    function menuSectionChange(event) {
        let selectedMenu = '';
        if (event.srcElement.nodeName != 'UL' && event.target.attributes['data-list'].nodeValue === 'no-active') {
            if (event.target.textContent === 'All Categories') {
                categories.innerHTML = 'All Categories';
                event.target.setAttribute('data-list', 'active');
                allCategories[activeNavMenuLink - 1].setAttribute('data-list', 'no-active');
                activeNavMenuLink = event.target.attributes[2].value;
                selectedSection = booksData;
                creationBooklist(booksData);
            } else {
                categories.innerHTML = event.target.textContent;
                event.target.setAttribute('data-list', 'active');
                allCategories[activeNavMenuLink - 1].setAttribute('data-list', 'no-active');
                activeNavMenuLink = event.target.attributes[2].value;
                selectedMenu = event.target.textContent;
                selectedSection = {
                    "data-id": [],
                    "url": [],
                    "author": [],
                    "year": [],
                    "name": [],
                    "description": [],
                    "section": [],
                    "price": []
                };
                allBooksData["section"].forEach((section, i) => {
                    if (section === selectedMenu) {
                        selectedSection["data-id"].push(i);
                        selectedSection["url"].push(allBooksData["url"][i]);
                        selectedSection["author"].push(allBooksData["author"][i]);
                        selectedSection["year"].push(allBooksData["year"][i]);
                        selectedSection["name"].push(allBooksData["name"][i]);
                        selectedSection["description"].push(allBooksData["description"][i]);
                        selectedSection["section"].push(section);
                        selectedSection["price"].push(allBooksData["price"][i]);
                    }
                });
                creationBooklist(selectedSection);
            };
        };
    };

    function search(booksData) {
        let searchValue = document.querySelector('#search-main').value;
        if (searchValue.length > 1) {
            let result = booksData['name'].filter(function (name) {
                return name.toLowerCase().includes(searchValue.toLowerCase());
            });
            if (result.length > 0) {
                creationSearchList(result)
                closeSearchList()
                eventSearch(booksData);
            } else {
                result = ['No book found']
                creationSearchList(result)
                closeSearchList()
            };
        } else {
            result = ['Please enter at least 2 characters']
            creationSearchList(result);
            closeSearchList();
        };
        searchValue.blur();
    };

    function creationSearchList(result) {

        let description = "";
        for (let i = 0; i < result.length; i++) {
            description += `
                 <p class="search-book">${result[i]}</p> 
                     `
        }
        wrapperBookDescription.innerHTML = `
                <div class="book-description search">
                <p class="search-result-title">Search result :</p>
                <div class="close-description"></div>
               ${description}
                </div>`
        wrapperBookDescription.style.visibility = 'visible';
    }

    function closeSearchList() {
        let = descriptionClose = document.querySelector('.close-description');
        descriptionClose.addEventListener('click', function closeDescriptionWindow() {
            wrapperBookDescription.style.visibility = 'hidden';
        });
    };

    function eventSearch(booksData) {

        let eventSearchBook = document.querySelector('.search');
        eventSearchBook.addEventListener('click', function (event) {
            booksData["name"].forEach(function (data, i) {
                if (event.target.innerText === booksData["name"][i]) {
                    dataId = booksData["data-id"][i];
                    creationBookDescription(dataId, booksData)
                };
            })
        })
    };

    function slider() {
        let sliderImg = {
            "data-id": [],
            "url": []
        };
        let numbePicturesSlider = 11;

        for (let i = 0; i < numbePicturesSlider && i < allBooksData["data-id"].length; i++) {
            sliderImg["data-id"].push(i);
            sliderImg["url"].push(allBooksData["url"][i]);
        }

        let sliderWrapper = document.querySelector('.slider-wrapper')
        let sliderArrowLeft = document.querySelector('.arrow-left');
        let sliderArrowRight = document.querySelector('.arrow-right');
        let sliderAllImages;

        creationSlider(sliderImg);

        function creationSlider(img) {
            let sliderImages = '';
            for (let i = 0; i < img['data-id'].length; i++) {
                sliderImages += `<img src="${img["url"][i]}.png" alt="slider imager" class="book-img" data-id="${i}" data-position="${i}">`
            };
            sliderWrapper.innerHTML = sliderImages;
            sliderAllImages = document.querySelectorAll('.slider-wrapper img');
        };

        //conversion to array for use all array functions------
        let arrSliderImg = Array.from(sliderAllImages);

        //control buttons--------------------
        sliderArrowLeft.addEventListener("click", function () {
            slideLeft(event);
        });

        sliderArrowRight.addEventListener("click", function () {
            slideRight();
        });

        function slideLeft() {
            arrSliderImg.unshift(arrSliderImg.pop());
            for (let i = 0; i < arrSliderImg.length; i++) {
                arrSliderImg[i].setAttribute('data-position', i);
            }
        };

        function slideRight() {
            arrSliderImg.push(arrSliderImg.shift());
            for (let i = 0; i < arrSliderImg.length; i++) {
                arrSliderImg[i].setAttribute('data-position', i);
            };
        };

        // auto slide --------------------------------------------
        function autoSlide() {
            slideRight();
        };
        setInterval(autoSlide, 5000);

        // event click slider wrapper---------------------------------------------------
        sliderWrapper.addEventListener('click', function (event) {
            if (event.target.className === 'book-img') {
                // definition data-id
                dataId = event.target.attributes[3].nodeValue;
                creationBookDescription(dataId, allBooksData);
            };
        });
    };

    // burger menu close ----------------------------
    navMainBurger.addEventListener('click', function () {
        document.querySelector('#nav-main-call').checked = false;
    });

})();