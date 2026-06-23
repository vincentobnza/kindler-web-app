/**
 * User-facing copy. Centralising labels keeps tone consistent and makes the
 * app trivially localisable later (swap this map for an i18n lookup).
 */

export const UI_LABELS = {
  actions: {
    retry: "Try again",
    save: "Save",
    cancel: "Cancel",
    remove: "Remove",
    viewAll: "View all",
    back: "Back",
    saveToLibrary: "Save to library",
    removeFromLibrary: "Remove from library",
    readOnline: "Read online",
    search: "Search",
    clearSearch: "Clear search",
    toggleTheme: "Toggle theme",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  states: {
    loading: "Loading…",
    error: "Something went wrong",
    empty: "Nothing here yet",
    notFound: "Page not found",
  },
  feedback: {
    networkError: "Network error — check your connection and try again.",
    notFoundBody: "We couldn't find what you were looking for.",
    emptyLibrary: "Your library is empty. Save a book to keep it here.",
    emptyResults: "No books matched your search.",
    searchPrompt: "Search by title, author or subject to begin.",
    noCover: "No cover available",
    noDescription: "No description available for this book yet.",
  },
} as const
