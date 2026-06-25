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
    read: "Read",
    startReading: "Start reading",
    continueReading: "Continue reading",
    search: "Search",
    clearSearch: "Clear search",
    toggleTheme: "Toggle theme",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    prevPage: "Previous page",
    nextPage: "Next page",
    decreaseFont: "Decrease text size",
    increaseFont: "Increase text size",
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
    preparingText: "Fetching the full text…",
    noFullText:
      "This title isn't available to read in full here. You can still read it on Open Library.",
  },
} as const
