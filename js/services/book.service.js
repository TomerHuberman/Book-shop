'use strict'
const STORAGE_KEY = 'booksDB'
const PAGE_SIZE = 5
var gPageIdx = 0
var gBooks
var gBooksFiltered
var gFilterBy = { maxPrice: Infinity, minRate: 0, name: '' }

_createBooks()

function getBooks() {
    var books = gBooks.filter(book => book.price <= gFilterBy.maxPrice &&
        book.rate >= gFilterBy.minRate && book.name.includes(gFilterBy.name))
    gBooksFiltered = books

    const startIdx = gPageIdx * PAGE_SIZE
    books = books.slice(startIdx, startIdx + PAGE_SIZE)
    return books
}

function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function addBook(name, price, rate) {
    const book = _createBook(name, price, rate)
    gBooks.unshift(book)
    _saveBooksToStorage()
    return book
}

function getBookById(bookId) {
    const book = gBooks.find(book => bookId === book.id)
    return book
}

function updateBook(bookId, price) {
    const book = getBookById(bookId)
    book.price = price
    _saveBooksToStorage()
    return book
}

function setBookFilter(filterBy) {
    if (filterBy.maxPrice) gFilterBy.maxPrice = filterBy.maxPrice
    else gFilterBy.maxPrice = Infinity
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
    if (filterBy.name !== undefined) gFilterBy.name = filterBy.name
    return gFilterBy
}

function setRate(book, rate) {
    book.rate = rate
}

function paging(nextOrPrev) {
    gPageIdx += nextOrPrev
    if (gPageIdx * PAGE_SIZE >= gBooksFiltered.length) gPageIdx = 0
    if (gPageIdx === -1) gPageIdx = +getMaxPage() - 1
    renderPage(gPageIdx)
}

function setPage(page) {
    if (page * PAGE_SIZE > gBooksFiltered.length) return
    if (page === -1) return
    gPageIdx = page
}

function getMaxPage() {
    return Math.ceil(gBooksFiltered.length / PAGE_SIZE)
}

function _createBook(name, price, rate = 0) {
    return {
        id: makeId(),
        name,
        price,
        rate,
        // imgUrl:
    }
}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)
    // Nothing in storage - generate demo data
    if (!books || !books.length) {
        books = []
        for (let i = 0; i < 15; i++) {
            var name = makeId(5)
            var price = getRandomIntInclusive(20, 80)
            var rate = getRandomIntInclusive(0, 10)
            books.push(_createBook(name, price, rate))
        }
    }
    gBooks = books
    _saveBooksToStorage()
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}
