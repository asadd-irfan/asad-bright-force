const multer = require('multer');
const path = require('path');
const { checkDirectory, clearFolder } = require('../utils/file');

const fileFilter = (req, file, cb) => {
  if (req.type == 'image') {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'), false);
    }  
  }
  if (req.type == 'pdf') {
    if (file.mimetype === 'application/pdf' || file.mimetype.includes(".document")) {
      cb(null, true);
    } else {
      cb(new Error('Not a pdf File! Please upload only PDF file.'),  false);
    }
  }
};


const fileUpload = (uploadPath) => {
return multer({
  storage : multer.diskStorage({
    destination: (req, file, cb) => {
      checkDirectory(uploadPath, err => {
        if (err) new Error(err.message);
        else {
            clearFolder(uploadPath);
            // store file
            cb(null, '');
        }
      })
    },
    filename: function (req, file, cb) {
      const ext = file.mimetype.split('/')[1];
      cb(null, `${uploadPath}${req.user.id}-${Date.now()}.${ext}`);
    }
  }),
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 4 }
});
};

module.exports = fileUpload;
