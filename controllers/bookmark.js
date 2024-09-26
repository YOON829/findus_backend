const { Bookmark, Place, Image, Work } = require("../models");

exports.addBookmark = async (req, res) => {
  const { place_id } = req.body;
  const user_id = req.session.user_id;

  if (!user_id) {
    return res.status(401).send("User not logged in");
  }

  try {
    const existingBookmark = await Bookmark.findOne({
      where: { place_id, user_id },
    });

    if (existingBookmark) {
      return res.status(400).json({ message: "Bookmark already exists" });
    }

    const bookmark = await Bookmark.create({ place_id, user_id });
    res.json(bookmark);
  } catch (error) {
    res.status(500).json({ error: "Failed to add bookmark" });
  }
};

exports.deleteBookmark = async (req, res) => {
  const { place_id } = req.params;
  const user_id = req.session.user_id;

  if (!user_id) {
    return res.status(401).send("User not logged in");
  }

  try {
    const bookmark = await Bookmark.findOne({
      where: { place_id, user_id },
    });
    if (bookmark) {
      await bookmark.destroy();
      res.status(200).json({ message: "Bookmark deleted" });
    } else {
      res.status(404).json({ error: "Bookmark not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete bookmark" });
  }
};

exports.checkBookmarkStatus = async (req, res) => {
  const { place_id } = req.params;
  const user_id = req.session.user_id;

  if (!user_id) {
    return res.status(401).send("User not logged in");
  }

  try {
    const bookmark = await Bookmark.findOne({
      where: { place_id, user_id },
    });

    res.json({ isBookmarked: !!bookmark });
  } catch (error) {
    res.status(500).json({ error: "Failed to check bookmark status" });
  }
};

exports.getAllBookmarks = async (req, res) => {
  const user_id = req.session.user_id;

  if (!user_id) {
    return res.status(401).send("User not logged in");
  }

  try {
    const bookmarks = await Bookmark.findAll({
      where: { user_id },
      include: [
        {
          model: Place,
          include: [
            {
              model: Work,
            },
            {
              model: Image,
            },
          ],
        },
      ],
    });

    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve bookmarks",
      details: error.message,
    });
  }
};
