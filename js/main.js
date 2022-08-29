// GET ELEMENTS FROM HTML
let elBody = document.querySelector(".body");
let elHeader = document.querySelector("header");
let elMain = document.querySelector("main");
let elSvg = document.querySelector(".header__svg");
let elDarkBtn = document.querySelector(".header__dark-mode");
let elNewest = document.querySelector(".results__btn");
let elCounter = document.querySelector(".results__span");
let elCross = document.querySelector(".hero__right-info-cross");
let elBookmarkWrapper = document.querySelector(".hero__left-list");
let elBookTemplate = document.querySelector("#books__temp").content;
let elInfoTemplate = document.querySelector("#info__temp").content;
let elBookmarkTemplate = document.querySelector("#bookmark__temp").content;
let elBooksWrapper = document.querySelector(".hero__right-list");
let elInfoWrapperRender = document.querySelector(".hero__right");
let elForm = document.querySelector(".header__form");
let elFormInput = document.querySelector(".header__form-input");

// localStorage SETTINGS
let localStorageBooks = JSON.parse(localStorage.getItem("book"));
let bookmarkedBooks = localStorageBooks ? localStorageBooks : [];
renderBookmarks(bookmarkedBooks);

elForm.addEventListener("submit", function(evt) {
    evt.preventDefault();
    let formInput = elFormInput.value.trim();
    
    fetch(`https://books.googleapis.com/books/v1/volumes?maxResults=12&q=${formInput}`)
    .then(res => res.json())
    .then(data => {
        renderBooks(data.items, elBooksWrapper)
        elFormInput.value = null;
    })
    
    elNewest.addEventListener("click", function() {
        fetch(`https://books.googleapis.com/books/v1/volumes?maxResults=12&q=${formInput}&orderBy=newest`)
        .then(res => res.json())
        .then(data => {
            renderBooks(data.items, elBooksWrapper)
            elFormInput.value = null;
        })
    })
})

elBooksWrapper.addEventListener("click", function(evt) {
    let infoId = evt.target.dataset.infoId;
    let bookmarkId = evt.target.dataset.bookmarkId
    
    if (infoId) {
        fetch(`https://www.googleapis.com/books/v1/volumes/${infoId}`)
        .then(res => res.json())
        .then(data => {
            renderInfo([data])
        })
    } 
    
    if (bookmarkId) {
        if (bookmarkedBooks.length == 0) {
            fetch(`https://www.googleapis.com/books/v1/volumes/${bookmarkId}`)
            .then(res => res.json())
            .then(data => {
                bookmarkedBooks.push(data)
                renderBookmarks(bookmarkedBooks)
                localStorage.setItem("book", JSON.stringify(bookmarkedBooks))
            })
        } else if (!bookmarkedBooks.find(item => item.id == bookmarkId)) {
            fetch(`https://www.googleapis.com/books/v1/volumes/${bookmarkId}`)
            .then(res => res.json())
            .then(data => {
                bookmarkedBooks.push(data)
                renderBookmarks(bookmarkedBooks)
                localStorage.setItem("book", JSON.stringify(bookmarkedBooks))
            })
        }
        renderBookmarks(bookmarkedBooks)
    }
})

elBookmarkWrapper.addEventListener("click", function(evt) {
    let bookmarkCurrentId = evt.target.closest(".hero__left-item-right-delete").dataset.bookmarkId;
    
    if (bookmarkCurrentId) {
        let findBookmarkId = bookmarkedBooks.findIndex(function(item) {
            return item.id == bookmarkCurrentId
        })
        
        bookmarkedBooks.splice(findBookmarkId, 1)
        localStorage.setItem("book", JSON.stringify(bookmarkedBooks))
    }
    renderBookmarks(bookmarkedBooks)
})

elDarkBtn.addEventListener("click", function() {
    elBody.classList.toggle("header__dark-bg")
    elInfoWrapperRender.classList.remove("hero__right-light")
    elInfoWrapperRender.classList.toggle("hero__right-dark")
    elSvg.classList.toggle("header__black")
    elSvg.classList.toggle("header__white")
})


function renderBooks(array, wrapper) {
    wrapper.innerHTML = null;
    elCounter.innerHTML = array.length;
    let fragment = document.createDocumentFragment();
    
    for (const item of array) {
        let bookItem = elBookTemplate.cloneNode(true);
        
        bookItem.querySelector(".hero__right-item-img").src = item.volumeInfo.imageLinks.thumbnail;
        bookItem.querySelector(".hero__right-item-heading").textContent = item.volumeInfo.title;
        bookItem.querySelector(".hero__right-item-author").textContent = item.volumeInfo.authors;
        bookItem.querySelector(".hero__right-item-year").textContent = item.volumeInfo.publishedDate;
        bookItem.querySelector(".hero__right-item-btn-bookmark").dataset.bookmarkId = item.id;
        bookItem.querySelector(".hero__right-item-btn-info").dataset.infoId = item.id;
        bookItem.querySelector(".hero__right-item-btn-read").dataset.readId = item.id;
        bookItem.querySelector(".hero__right-item-btn-read").href = item.accessInfo.webReaderLink;
        
        fragment.appendChild(bookItem)
    }
    
    wrapper.appendChild(fragment)
}

function renderInfo(array) {
    let fragment = document.createDocumentFragment();
    
    for (const item of array) {
        let infoItem = elInfoTemplate.cloneNode(true)
        
        infoItem.querySelector(".hero__right-info-heading").textContent = item.volumeInfo.title;
        infoItem.querySelector(".hero__right-info-img").src = item.volumeInfo.imageLinks.thumbnail;
        infoItem.querySelector(".hero__right-info-text").textContent = item.volumeInfo.description;
        infoItem.querySelector(".hero__span-author").textContent = item.volumeInfo.authors;
        infoItem.querySelector(".hero__span-year").textContent = item.volumeInfo.publishedDate;
        infoItem.querySelector(".hero__span-publishers").textContent = item.volumeInfo.publisher;
        infoItem.querySelector(".hero__span-categories").textContent = item.volumeInfo.categories;
        infoItem.querySelector(".hero__span-pages").textContent = item.volumeInfo.pageCount;
        infoItem.querySelector(".hero__right-info-cross").dataset.crossId = item.id;
        
        fragment.appendChild(infoItem)
    }
    
    elInfoWrapperRender.appendChild(fragment)
}

function renderBookmarks(array) {
    elBookmarkWrapper.innerHTML = null;
    let fragment = document.createDocumentFragment();
    
    for (const item of array) {
        let bookmarkItem = elBookmarkTemplate.cloneNode(true)
        
        bookmarkItem.querySelector(".hero__left-item-right-heading").textContent = item.volumeInfo.title;
        bookmarkItem.querySelector(".hero__left-item-right-text").textContent = item.volumeInfo.authors;
        bookmarkItem.querySelector(".hero__left-item-right-read").href = item.accessInfo.webReaderLink;
        bookmarkItem.querySelector(".hero__left-item-right-delete").dataset.bookmarkId = item.id;   
        
        fragment.appendChild(bookmarkItem)
    }
    
    elBookmarkWrapper.appendChild(fragment)
}