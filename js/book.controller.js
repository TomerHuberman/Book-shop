'use strict'

var gCurrBook
var gIsTable = loadFromStorage('isTabel')
function onInit() {
    renderFilterByQueryStringParams()
    renderBooks()
    renderPage(0)
}

function isTable(isTable) {
    gIsTable = isTable
    renderBooks()
    saveToStorage('isTabel', gIsTable)
}

function renderBooks() {
    var books = getBooks()
    var strHtmls
    if (gIsTable) {
        strHtmls = ` <table><thead>
        <th>Id</th>
        <th>Title</th>
        <th>Rate </th>
        <th>Price</th>
        <th colspan="3">Actoins</th>
    </thead>
    <tbody>`
        strHtmls += books.map(book => `
    <tr>
    <td>${book.id}</td>
    <td>${book.name}</td>
    <td>${book.rate}</td>
    <td>$${book.price}</td>
    <td><buttom class="btn btn-read" onclick="onReadBook('${book.id}')">Read</buttom></td>
    <td><buttom class="btn btn-update" onclick="onUpdateBook('${book.id}')">Update</buttom></td>
    <td><buttom class="btn btn-delete" onclick="onRemoveBook('${book.id}')">Delete</buttom></td>
    </tr>
    `
        ).join('')
        strHtmls += `</tbody></table>`
    } else {
        strHtmls = books.map(book => `
        <article class="book-preview">
            <span class="rate">rate: ${book.rate}</span>
            <buttom class="btn btn-delete" onclick="onRemoveBook('${book.id}')">Delete</buttom>
            <h5>${book.name}</h5>
            <h6>Price : <span>$${book.price}</span></h6>
            <buttom class="btn btn-read" onclick="onReadBook('${book.id}')">Read</buttom>
            <buttom class="btn btn-update" onclick="onUpdateBook('${book.id}')">Update</buttom>
        </article> 
        `).join('')
    }
    document.querySelector('.cards-table-container').innerHTML = strHtmls
}

function onAddBook(ev) {
    ev.preventDefault()
    const newName = document.querySelector('#new-book-name').value
    const newPrice = +document.querySelector('#new-book-price').value
    const newRate = +document.querySelector('#new-book-rate').value

    if (newPrice === undefined || !newName) return
    addBook(newName, newPrice, newRate)
    renderBooks()
    document.querySelector('.add-book-modal').classList.remove('open')
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
}

function onUpdateBook(bookId) {
    const price = +prompt('What is the new price of the book')
    updateBook(bookId, price)
    renderBooks()
}

function onReadBook(bookId) {
    var book = getBookById(bookId)
    gCurrBook = book
    var elModal = document.querySelector('.modal')
    elModal.querySelector('h3').innerText = book.name
    elModal.querySelector('h4 span').innerText = book.price
    elModal.classList.add('open')
}

function onSetRate(rate) {
    setRate(gCurrBook, rate)
    renderBooks()
}

function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)
    renderBooks()
    onPaging(1)
    renderPage(0)

    const queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}&name=${filterBy.name}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        maxPrice: +queryStringParams.get('maxPrice') || 0,
        minRate: +queryStringParams.get('minRate') || 0,
        name: queryStringParams.get('name') || ''
    }

    if (!filterBy.maxPrice && !filterBy.minRate && !filterBy.name) return

    document.querySelector('.filter-max-price').value = filterBy.maxPrice
    document.querySelector('.filter-min-rate').value = filterBy.minRate
    document.querySelector('.filter-name').value = filterBy.name
    setBookFilter(filterBy)
}

function onPaging(nextOrPrev) {
    paging(nextOrPrev)
    renderBooks()
}

function onSetPage(page) {
    page--
    setPage(page)
    renderBooks()
}

function renderPage(pageNum) {
    if (pageNum < 0) pageNum = -1
    const elPageNum = document.querySelector('.page-num')
    const elMaxPage = document.querySelector('.max-page')
    elMaxPage.innerText = getMaxPage()
    elPageNum.value = +pageNum + 1
}

function onOpenAddBookModal(){
    document.querySelector('.add-book-modal').classList.add('open')
}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
}