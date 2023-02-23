import { nanoid } from "nanoid";

// Selectors
const bookInputEl = document.querySelector(".book-input");
const bookButtonEl = document.querySelector(".book-btn");
const bookListEl = document.querySelector(".book-list");
const bookFormEl = document.querySelector(".book-form");

let bookList = JSON.parse(localStorage.getItem("book")) || [];

// Event Listeners
window.addEventListener("load", renderBooks);
bookFormEl.addEventListener("submit", addBook);
bookListEl.addEventListener("click", deleteOrCheckBook);

// Functions
function addBook(e) {
  e.preventDefault();
  bookList.unshift({ name: bookInputEl.value, id: nanoid(), completed: false });
  e.target.reset();

  renderBooks();
}

function renderBooks() {
  bookListEl.innerHTML = "";

  localStorage.setItem("book", JSON.stringify(bookList));

  const listMarkup = bookList
    .map((book) => {
      return `
      <li data-book-id="${book.id}">
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
    .join("");

  bookListEl.insertAdjacentHTML("beforeend", listMarkup);
}

function deleteOrCheckBook(e) {
  const parentId =
    e.target.parentElement.parentElement.getAttribute("data-book-id");

  if (e.target.classList[0] === "delete-btn") {
    bookList = bookList.filter((book) => book.id !== parentId);
    renderBooks();
  } else if (e.target.classList[0] === "check-btn") {
    bookList.map((book) =>
      book.id === parentId ? (book.completed = !book.completed) : book.completed
    );
    renderBooks();
  }
}
