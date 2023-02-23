// Selectors
const bookInputEl = document.querySelector(".book-input");
const bookButtonEl = document.querySelector(".book-btn");
const bookListEl = document.querySelector(".book-list");
const bookFormEl = document.querySelector(".book-form");

let bookList = JSON.parse(localStorage.getItem("book"));

// Event Listeners
window.addEventListener("load", renderBooks);
bookFormEl.addEventListener("submit", addBook);

// Functions
function addBook(e) {
  e.preventDefault();
  bookList.unshift(bookInputEl.value);
  localStorage.setItem("book", JSON.stringify(bookList));
  bookFormEl.reset()

  renderBooks();
}

function renderBooks() {
  bookListEl.innerHTML = "";

  const listMarkup = bookList
    .map((book) => {
      return `
      <li>
      <p>${book}</p>
      </li>
    `;
    })
    .join("");

  bookListEl.insertAdjacentHTML("beforeend", listMarkup);
}
