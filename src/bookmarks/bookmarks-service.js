const BookmarksService = {
  getAllBookmarks(db) {
    return db.select('*').from('bookmarks');
  },
  getBookmarkById(db, id) {
    return db.select('*').from('bookmarks').where('id', id).first();
  },
};

module.exports = BookmarksService;
