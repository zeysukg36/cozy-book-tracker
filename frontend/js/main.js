import { getBooks, createBook, updateBook, deleteBook } from "./api.js";
import { renderBooks, renderLoading, renderStats, showEmptyState, hideEmptyState } from "./render.js";
import { showToast } from "./toast.js";  
import { debounce } from "./utils.js";
import { sortBooks } from "./sort.js";

const bookGrid = document.getElementById("bookGrid");
const addBookBtn = document.getElementById("addBookBtn");
const addBookModal = document.getElementById("addBookModal");
const addBookForm = document.getElementById("addBookForm");
const cancelAddBook = document.getElementById("cancelAddBook");
const filterTabs = document.querySelectorAll(".filter-tabs__item");
const modalTitle = document.getElementById("modalTitle");
const submitBookBtn = document.getElementById("submitBookBtn"); 
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const ratingField =document.getElementById("ratingField");
const stateElements = {
    total: document.getElementById("statTotal"),
    finished: document.getElementById("statFinished"),
    reading: document.getElementById("statReading"),
  };

   let currentSearchTerm = "";
   let currentSort = "newest";
   
const emptyStateEls = {  
  container: document.getElementById("emptyState"),  
  title: document.getElementById("emptyStateTitle"),  
  text: document.getElementById("emptyStateText"),  
  cta: document.getElementById("emptyStateCta"),
};
emptyStateEls.cta.addEventListener("click", () => {
    if (emptyStateEls.cta.dataset.mode === "no-results") {
        setActiveFilter("all");
    } else {
  
        openModalForCreate();
    }
});

let allBooks = [];
let currentFilter = "all";
let editingBookId = null; // null: ekleme modu, dolu: düzenleme modu

function applyFilterAndRender() {
  let filtered = currentFilter === "all"
    ? allBooks
    : allBooks.filter((book) => book.status === currentFilter);

  if (currentSearchTerm) {
    filtered = filtered.filter((book) =>
      book.title.toLowerCase().includes(currentSearchTerm) ||
      book.author.toLowerCase().includes(currentSearchTerm)
    );
  }

  filtered = sortBooks(filtered, currentSort);

  renderBooks(bookGrid, filtered);

  if (allBooks.length === 0) {
    showEmptyState(emptyStateEls, "no-books");
  } else if (filtered.length === 0) {
    showEmptyState(emptyStateEls, "no-results");
  } else {
    hideEmptyState(emptyStateEls);
  }
}
async function loadBooks() {  
  renderLoading(bookGrid);  
  try {    
    allBooks = await getBooks();    
    renderStats(stateElements, allBooks);    
    applyFilterAndRender();  
  } catch (error) {    
    console.error("Kitaplar yüklenemedi:", error);    
    showToast("Kitaplar yüklenirken bir sorun oluştu.", "error");    
    showEmptyState(emptyStateEls, "error");   
  }
}

function setActiveFilter(filterValue) {
  currentFilter = filterValue;
  filterTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.filter === filterValue);
  });
    applyFilterAndRender();
}
function openModalForCreate() {
  editingBookId = null;
  modalTitle.textContent = "Yeni Kitap Ekle";
  submitBookBtn.textContent = "Kaydet";
  addBookForm.reset();
  toggleRatingField(addBookForm.elements.status.value);
  addBookModal.showModal();
}
function toggleRatingField(status) {
  const isFinished = status === "finished";
  ratingField.hidden = !isFinished;
  if (!isFinished) {
    addBookForm.elements.rating.value = "";
  }
}

addBookForm.elements.status.addEventListener("change", (event) => {
  toggleRatingField(event.target.value);
});

function openModalForEdit(book) {
  editingBookId = book.id; 
  modalTitle.textContent = "Kitabı Düzenle";
  submitBookBtn.textContent = "Güncelle";
  addBookForm.elements.title.value = book.title;
  addBookForm.elements.author.value = book.author;
  addBookForm.elements.genre.value = book.genre ?? "";
  addBookForm.elements.status.value = book.status;
  addBookForm.elements.rating.value = book.rating ?? "";
  toggleRatingField(book.status);
  addBookModal.showModal();
}

filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => setActiveFilter(tab.dataset.filter));
});

addBookBtn.addEventListener("click", openModalForCreate);
cancelAddBook.addEventListener("click", () => addBookModal.close());

addBookForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(addBookForm);
  const bookPayload = {
    title: formData.get("title"),
    author: formData.get("author"),
    genre: formData.get("genre") || null, 
    status: formData.get("status"),
      rating: formData.get("rating") ? Number(formData.get("rating")) : null,
  };

submitBookBtn.disabled = true
submitBookBtn.textContent = editingBookId ? "Güncelleniyor..." : "Kaydediliyor...";

  try {
    if (editingBookId) {
      await updateBook(editingBookId, bookPayload);
      showToast("Kitap güncellendi.");
    } else {
      await createBook(bookPayload);
      showToast("Kitap eklendi.");
    }
    addBookModal.close();
    await loadBooks();
  } catch (error) {
    console.error("İşlem başarısız:", error);
    showToast("Bir sorun oluştu, tekrar deneyin.", "error");
  } finally {
    submitBookBtn.disabled = false;
    submitBookBtn.textContent = editingBookId ? "Güncelle" : "Kaydet";
  }
});

// Kartlar dinamik olarak sürekli yeniden oluşturulduğu için her birine
// tek tek listener eklemek yerine, üst container'a tek listener bağlanır
// ve tıklanan elemente göre karar verilir (event delegation).
bookGrid.addEventListener("click", async (event) => {
  const actionBtn = event.target.closest("[data-action]");
  if (!actionBtn) return;
  
  const card = actionBtn.closest(".book-card");
  const bookId = card.dataset.id;
  const book = allBooks.find((b) => b.id === bookId);

  if (actionBtn.dataset.action === "edit") {
    openModalForEdit(book);
    return;
  }
  
  if (actionBtn.dataset.action === "delete") {
    const confirmed = confirm(`"${book.title}" silinsin mi?`);
    if (!confirmed) return;

    actionBtn.disabled = true;
    try {
      await deleteBook(bookId);
      showToast("Kitap silindi.");
      await loadBooks();
    } catch (error) { 
      console.error("Silme başarısız:", error);
      showToast("Kitap silinmedi.", "error");
      actionBtn.disabled = false;
    }
  }
});
searchInput.addEventListener(
  "input",
  debounce(() => {
    currentSearchTerm = searchInput.value.trim().toLowerCase();
    applyFilterAndRender();
  }, 250)
);
sortSelect.addEventListener("change", () => {
  currentSort = sortSelect.value;
  applyFilterAndRender();
}); 

emptyStateEls.cta.addEventListener("click", () => {
  if (emptyStateEls.cta.dataset.mode === "no-books") {
    openModalForCreate();
  } else if (emptyStateEls.cta.dataset.mode === "no-results") {
    searchInput.value = "";
    currentSearchTerm = "";
    setActiveFilter("all");
  }
});

loadBooks();