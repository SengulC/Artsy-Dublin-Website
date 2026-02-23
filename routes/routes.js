
//map of all URLs in application
//defines what happens when a user visits a specific URL, connecting each URL to the correct controller method
const express        = require("express");
const multer         = require("multer");
const path           = require("path");

const eventController = require("../controllers/eventController");
const diaryController = require("../controllers/diaryController");

const router = express.Router();

// Multer config — stores uploaded images in public/uploads/, Multer is a Node.js package that handles file uploads, sets size lims,unique filename 
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../public/uploads")),
  filename:    (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error("Only JPG, PNG, WebP allowed."));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// --- Event routes ---
router.get("/",              eventController.getHomePage.bind(eventController));
router.get("/events",        eventController.getAllEvents.bind(eventController));
router.get("/events/:eventId", eventController.getEventDetail.bind(eventController));

// --- Diary routes ---
router.get("/diary",                        diaryController.getDiary.bind(diaryController));
router.get("/diary/:entryId",               diaryController.getDiaryEntry.bind(diaryController));
router.get("/events/:eventId/log",          diaryController.getLogForm.bind(diaryController));
router.post("/diary",         upload.single("image"), diaryController.postDiaryEntry.bind(diaryController));
router.post("/diary/:entryId/comments",     diaryController.postComment.bind(diaryController));

module.exports = router;