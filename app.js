import { nanoid } from "nanoid";
import { Notify } from "notiflix/build/notiflix-notify-aio";

// Selectors
const bookAuthorInputEl = document.querySelector(".book-author");
const bookNameInputEl = document.querySelector(".book-name");
const bookInputAllEl = document.querySelectorAll(".book-input");
const bookListEl = document.querySelector(".book-list");
const bookFormEl = document.querySelector(".book-form");
const readingListBtnEl = document.querySelector(".reading-list-btn");
const inProgressBtnEl = document.querySelector(".in-progress-btn");
const completedBtnEl = document.querySelector(".completed-btn");
const searchBtnEl = document.querySelector(".search-btn");
const searchInputEl = document.querySelector(".search-input");
const searchFormEl = document.querySelector(".search-form");
const titleEl = document.querySelector(".title");

let bookList = JSON.parse(localStorage.getItem("book")) || [];

// Event Listeners
window.addEventListener("load", showBooksAll());
bookFormEl.addEventListener("submit", addBook);
bookListEl.addEventListener("click", deleteOrCheckBook);
inProgressBtnEl.addEventListener("click", showBooksInProgress);
readingListBtnEl.addEventListener("click", showBooksAll);
completedBtnEl.addEventListener("click", showBooksCompleted);
searchBtnEl.addEventListener("click", toggleInput);
searchInputEl.addEventListener("keyup", showSearchedBooks);
bookInputAllEl.forEach((el) => el.addEventListener("click", hideTitle));

// Functions
function addBook(e) {
  e.preventDefault();
  if (bookNameInputEl.value || bookAuthorInputEl.value) {
    bookList.unshift({
      name: bookNameInputEl.value,
      author: bookAuthorInputEl.value,
      id: nanoid(),
      completed: false,
    });
    e.target.reset();

    refreshLS();

    Notify.success("The book has been added");

    inProgressBtnEl.classList.remove("active-filter");
    readingListBtnEl.classList.add("active-filter");
    completedBtnEl.classList.remove("active-filter");

    renderBooks(bookList);
  } else {
    Notify.info("Please fill in all the fields");
  }
}

function hideTitle() {
  titleEl.classList.add("title-hidden");
}

function renderBooks(items) {
  bookListEl.innerHTML = "";

  const listMarkup =
    items.length > 0
      ? items
          .map((book) => {
            return `
      <li class="book-item ${
        book.completed === true ? "completed" : "reading"
      }" data-book-id="${book.id}">
        <div class="book-info">
          <p class="book-item-name">${book.name}</p>
          <p class="book-item-author">by ${book.author}</p>
        </div>
        <div class="book-btns">
          <button class="check-btn" title="Check the completed book">
            <i class="fa-solid fa-check"></i>
          </button>
          <button class="delete-btn" title="Delete the book">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </li>
    `;
          })
          .join("")
      : `<p class="book-empty">No books in the list</p>`;

  bookListEl.insertAdjacentHTML("beforeend", listMarkup);
}

function deleteOrCheckBook(e) {
  const parentId =
    e.target.parentElement.parentElement.getAttribute("data-book-id");

  if (e.target.classList[0] === "delete-btn") {
    bookList = bookList.filter((book) => book.id !== parentId);
    refreshLS();
    Notify.success("The book has been deleted");

    if (inProgressBtnEl.classList.contains("active-filter")) {
      showBooksInProgress();
    } else if (completedBtnEl.classList.contains("active-filter")) {
      showBooksCompleted();
    } else {
      renderBooks(bookList);
    }
  } else if (e.target.classList[0] === "check-btn") {
    bookList.map((book) =>
      book.id === parentId ? (book.completed = !book.completed) : book.completed
    );
    refreshLS();

    if (inProgressBtnEl.classList.contains("active-filter")) {
      console.log(inProgressBtnEl.classList.contains("active-filter"))
      showBooksInProgress();
    } else if (completedBtnEl.classList.contains("active-filter")) {
      showBooksCompleted();
    } else {
      renderBooks(bookList);
    }

    if (e.target.parentElement.parentElement.classList[1] === "reading") {
      Notify.success("The book has been added to completed");
    } else if (
      e.target.parentElement.parentElement.classList[1] === "completed"
    ) {
      Notify.success("The book has been removed from completed");
    }
  }
}

function showBooksAll() {
  inProgressBtnEl.classList.remove("active-filter");
  readingListBtnEl.classList.add("active-filter");
  completedBtnEl.classList.remove("active-filter");
  renderBooks(bookList);
}

function showBooksInProgress() {
  inProgressBtnEl.classList.add("active-filter");
  readingListBtnEl.classList.remove("active-filter");
  completedBtnEl.classList.remove("active-filter");
  const booksInProgressList = bookList.filter(
    (book) => book.completed === false
  );
  renderBooks(booksInProgressList);
}

function showBooksCompleted() {
  inProgressBtnEl.classList.remove("active-filter");
  readingListBtnEl.classList.remove("active-filter");
  completedBtnEl.classList.add("active-filter");
  const booksCompletedList = bookList.filter((book) => book.completed === true);
  renderBooks(booksCompletedList);
}

function refreshLS() {
  localStorage.setItem("book", JSON.stringify(bookList));
}

function toggleInput(e) {
  e.preventDefault();

  searchFormEl.classList.toggle("search-form-active");

  searchInputEl.value = "";

  inProgressBtnEl.classList.remove("active-filter");
  readingListBtnEl.classList.add("active-filter");
  completedBtnEl.classList.remove("active-filter");

  renderBooks(bookList);
}

function showSearchedBooks(e) {

  if (e.target.value === "") {
    renderBooks(bookList);
  } else {
    const searchedBooks = bookList.filter((book) => {
      
      return (
        book.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        book.author.toLowerCase().includes(e.target.value.toLowerCase())
      );
    });

    renderBooks(searchedBooks);
  }
}
