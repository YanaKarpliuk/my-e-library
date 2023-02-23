import { nanoid } from "nanoid";

// Selectors
const bookAuthorInputEl = document.querySelector(".book-author");
const bookNameInputEl = document.querySelector(".book-name");
const bookListEl = document.querySelector(".book-list");
const bookFormEl = document.querySelector(".book-form");
const readingListBtnEl = document.querySelector(".reading-list-btn");
const inProgressBtnEl = document.querySelector(".in-progress-btn");
const completedBtnEl = document.querySelector(".completed-btn");
const searchBtnEl = document.querySelector(".search-btn");
const searchInputEl = document.querySelector(".search-input");
const searchFormEl = document.querySelector(".search-form");

let bookList = JSON.parse(localStorage.getItem("book")) || [];

// Event Listeners
window.addEventListener("load", () => renderBooks(bookList));
bookFormEl.addEventListener("submit", addBook);
bookListEl.addEventListener("click", deleteOrCheckBook);
inProgressBtnEl.addEventListener("click", showBooksInProgress);
readingListBtnEl.addEventListener("click", showBooksAll);
completedBtnEl.addEventListener("click", showBooksCompleted);
searchBtnEl.addEventListener("click", toggleInput);
searchInputEl.addEventListener("keyup", showSearchedBooks);

// Functions
function addBook(e) {
  e.preventDefault();
  bookList.unshift({
    name: bookNameInputEl.value,
    author: bookAuthorInputEl.value,
    id: nanoid(),
    completed: false,
  });
  e.target.reset();

  refreshLS();

  renderBooks(bookList);
}

function renderBooks(items) {
  bookListEl.innerHTML = "";

  const listMarkup =
    items.length > 0
      ? items
          .map((book) => {
            return `
      <li data-book-id="${book.id}">
      <p>${book.author}</p>
        <p>${book.name}</p>
        <div>
          <button class="check-btn ${
            book.completed === true ? "completed" : "reading"
          }">
            <i class="fa-regular fa-square-check"></i>
          </button>
          <button class="delete-btn">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </li>
    `;
          })
          .join("")
      : `<p>No books in the list</p>`;

  bookListEl.insertAdjacentHTML("beforeend", listMarkup);
}

function deleteOrCheckBook(e) {
  const parentId =
    e.target.parentElement.parentElement.getAttribute("data-book-id");

  if (e.target.classList[0] === "delete-btn") {
    bookList = bookList.filter((book) => book.id !== parentId);
    refreshLS();
    renderBooks(bookList);
  } else if (e.target.classList[0] === "check-btn") {
    bookList.map((book) =>
      book.id === parentId ? (book.completed = !book.completed) : book.completed
    );
    refreshLS();
    renderBooks(bookList);
  }
}

function showBooksAll() {
  renderBooks(bookList);
}

function showBooksInProgress() {
  const booksInProgressList = bookList.filter(
    (book) => book.completed === false
  );
  renderBooks(booksInProgressList);
}

function showBooksCompleted() {
  const booksCompletedList = bookList.filter((book) => book.completed === true);
  renderBooks(booksCompletedList);
}

function refreshLS() {
  localStorage.setItem("book", JSON.stringify(bookList));
}

function toggleInput(e) {
  e.preventDefault();

  searchFormEl.classList.toggle('search-form-active')
  
  searchInputEl.value = ''

  renderBooks(bookList)
}

function showSearchedBooks(e) {
  if (e.target.value === "") {
    renderBooks(bookList);
  } else {
    const searchedBooks = bookList.filter((book) => {
      return (
        book.name.includes(e.target.value) ||
        book.author.includes(e.target.value)
      );
    });

    renderBooks(searchedBooks);
  }
}
