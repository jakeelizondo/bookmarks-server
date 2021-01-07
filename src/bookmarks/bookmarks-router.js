const express = require('express');
const { v4: uuid } = require('uuid');
const bookmarks = require('../dataStore');
const logger = require('../logger');

const BookmarksService = require('./bookmarks-service');

const bookmarksRouter = express.Router();
const bodyParser = express.json();

bookmarksRouter
  .route('/')
  .get((req, res) => {
    BookmarksService.getAllBookmarks(req.app.get('db')).then((data) =>
      res.json(data)
    );
  })
  .post(bodyParser, (req, res) => {
    const { title, url, description, rating } = req.body;

    if (!title) {
      logger.error('Title is required');
      return res.status(400).send('Missing title');
    }

    if (!url) {
      logger.error('URL is required');
      return res.status(400).send('Missing URL');
    }

    if (!description) {
      logger.error('Description is required');
      return res.status(400).send('Missing Description');
    }

    if (!rating) {
      logger.error('Rating is required');
      return res.status(400).send('Missing Rating');
    }

    const id = uuid();
    const bookmark = {
      id,
      title,
      url,
      description,
      rating,
    };
    bookmarks.push(bookmark);
    return res
      .status(201)
      .json({ message: `Bookmark available at /bookmarks/${id}` });
  });

bookmarksRouter
  .route('/:id')
  .get((req, res, next) => {
    const id = req.params.id;

    BookmarksService.getBookmarkById(req.app.get('db'), id)
      .then((data) => {
        if (!data) {
          logger.error(`Bookmark with id ${id} not found`);
          return res.status(404).send(`Bookmark with id ${id} not found`);
        }
        return res.json(data);
      })
      .catch(next);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const index = bookmarks.findIndex((bm) => bm.id === id);

    if (index === -1) {
      logger.error(
        `Attempt to delete bookmark with id ${id} failed; no such id found`
      );
      res
        .status(400)
        .send(
          `Attempt to delete bookmark with id ${id} failed; no such id found`
        );
    }

    bookmarks.splice(index, 1);

    return res.status(204).end();
  });

module.exports = bookmarksRouter;
