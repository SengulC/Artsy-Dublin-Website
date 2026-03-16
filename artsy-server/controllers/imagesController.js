// this is the controller for image related stuff

//A. for handling images uploaded by users
const multer = require('multer');
const path = require('path');

const createUpload = (folder) => {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'public', 'uploads', folder)),
      filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
      }
    });
    
    return multer({
        storage,
        fileFilter: (req, file, cb) => {
          cb(null, file.mimetype.startsWith('image/'));
        }
      });
    };


  
module.exports = {
  createUpload
};