const STATUS_LABELS = {
  to_read: "🔖 Okunacak",
  reading: "📖 Okunuyor",
  finished: "✨ Bitti",
}
function hashStringtoColorIndex(str) {
  let hash = 0;
  for (const char of str) {
    hash = (hash + char.charCodeAt(0)) % 6;
  }
  return hash;
}
function createBookAvatar(title) {
  const avatar = document.createElement("div");
  const colorIndex = hashStringtoColorIndex(title.trim().toLowerCase());
  const initial = title.trim().charAt(0).toUpperCase() || "?";

  avatar.className = `book-avatar book-avatar--${colorIndex}`;
  avatar.textContent = initial;
  avatar.setAttribute("aria-hidden", "true");

  return avatar;
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
} 

function createPawRating(rating) {
  const wrapper = document.createElement("div");
  wrapper.className = "book-card__rating";
  wrapper.setAttribute("aria-label", `5 üzerinden ${rating} pati puanı`);

  for (let i = 1; i <= 5; i++) {
    const paw = document.createElement("span");
    paw.className = i <= rating ? "paw paw--filled" : "paw paw--empty";
    paw.textContent = "🐾";
    paw.setAttribute("aria-hidden", "true");
    wrapper.append(paw);
  }

  return wrapper;
}

function createBookCard(book) {
  const card = document.createElement("article");
  card.className = "book-card";
  card.dataset.id = book.id;

  const badge = document.createElement("span");
  badge.className = `status-badge status-badge--${book.status}`;
  badge.textContent = STATUS_LABELS[book.status] ?? book.status;

  const title = document.createElement("h2");
  title.className = "book-card__title";
  title.textContent = book.title;

  const author = document.createElement("p");
  author.className = "book-card__author";
  author.textContent = book.author;

  const mainRow = document.createElement("div");
mainRow.className = "book-card__main";

  const info = document.createElement("div");
info.className = "book-card__info";

info.append(title, author);
mainRow.append(createBookAvatar(book.title), info);
card.append(mainRow);

  if (book.genre) {
  const genre = document.createElement("span");
  const colorIndex = hashStringtoColorIndex(book.genre.trim().toLowerCase());
  genre.className = `genre-tag genre-tag--${colorIndex}`;
  genre.textContent = book.genre;
  card.append(genre);
}

  if (book.rating) {
  card.append(createPawRating(book.rating));
}
  const footer = document.createElement("div");
  footer.className = "book-card__footer";

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "icon-btn";
  editBtn.textContent = "Düzenle";
  editBtn.dataset.action = "edit";

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "icon-btn icon-btn--danger";
  deleteBtn.textContent = "Sil";
  deleteBtn.dataset.action = "delete";

  footer.append(editBtn, deleteBtn);
  card.append(footer);
  
  const dateStamp = document.createElement("span");
  dateStamp.className = "book-card__date";
  dateStamp.textContent = formatDate(book.created_at);

  card.append(dateStamp);
  return card;
}

export function renderBooks(gridEl, books) {  
  gridEl.innerHTML = "";  
  if (books.length === 0) return;  
  const fragment = document.createDocumentFragment();  
  books.forEach((book) => fragment.append(createBookCard(book)));  
  gridEl.append(fragment);
}

export function renderLoading(gridEl) {
  gridEl.innerHTML = '<p class= "loading-state">Kitaplar yükleniyor...</p>';
} 

// frontend/js/render.js — dosyanın sonuna eklenecek

function updateStatValue(el, newValue) {
  const newValueStr = String(newValue);
  if (el.textContent === newValueStr) return; // Değişmediyse animasyon boşa tetiklenmesin

  el.textContent = newValueStr;
  el.classList.remove("stat-card__value--pop");
  void el.offsetWidth; // Reflow tetikleyerek animasyonun yeniden başlamasını sağlar
  el.classList.add("stat-card__value--pop");
}

export function renderStats(elements, books) {
  const finishedCount = books.filter((b) => b.status === "finished").length;
  const readingCount = books.filter((b) => b.status === "reading").length;

  updateStatValue(elements.total, books.length);
  updateStatValue(elements.finished, finishedCount);
  updateStatValue(elements.reading, readingCount);
}
const EMPTY_STATE_CONTENT = {
  "no-books": {
    title: "Henüz kitap eklenmedi",
    text: "Okuma listeni oluşturmaya ilk kitabını ekleyerek başla.",
    ctaLabel: "İlk Kitabını Ekle",
    showCta: true,
  },
  "no-results": {
    title: "Eşleşen kitap bulunamadı",
    text: "Arama veya filtre kriterlerini değiştirmeyi dene.",
    ctaLabel: "Filtreleri Temizle",
    showCta: true,
  },
  error: {
    title: "Bir şeyler ters gitti",
    text: "Kitaplar yüklenirken bir sorun oluştu. Sayfayı yenilemeyi dene.",
    ctaLabel: "",
    showCta: false,
  },
};

export function showEmptyState(els, mode) {
  const config = EMPTY_STATE_CONTENT[mode];
  els.title.textContent = config.title;
  els.text.textContent = config.text;
  els.cta.textContent = config.ctaLabel;
  els.cta.hidden = !config.showCta;
  els.cta.dataset.mode = mode;
  els.container.hidden = false;
}

export function hideEmptyState(els) {
  els.container.hidden = true;
}