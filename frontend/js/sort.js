export function sortBooks(books, sortKey) {
  const sorted = [...books];

  switch (sortKey) {
    case "title-asc":
      sorted.sort((a, b) => a.title.localeCompare(b.title, "tr"));
      break;
    case "rating-desc":
      sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
    case "newest":
    default:
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;
  }

  return sorted;
}