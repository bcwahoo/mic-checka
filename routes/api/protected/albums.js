const router = require("express").Router();
const albumsController = require("../../../controllers/albumsController");

// Matches with "/api/protected/albums"
router.route("/")
  .get(albumsController.findAll)
  .post(albumsController.create);

// Matches with "/api/protected/albums/:id"
router.route("/:id")
  .get(albumsController.findById)
  .put(albumsController.update)
  .delete(albumsController.remove);

module.exports = router;
