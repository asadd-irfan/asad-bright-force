const multer = require('multer');
const path = require('path');
const { checkDirectory, clearFolder } = require('../util/file');

let directory = '';

// file filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/x-rar-compressed' || file.mimetype === 'application/zip') {
        directory = path.join(global.root_dir, 'uploads', 'talents', req.user.id, 'edit_request', 'codeSample');
        // check if directory exist if not create it
        checkDirectory(directory, err => {
            if (err) new Error(err.message);
            else {
                clearFolder(directory);
                // store file
                cb(null, true);
            }
        });
    }
    // reject file
    else cb(new Error('Illegal file mime type'), false);
};
// storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, directory);
    },
    filename: function(req, file, cb) {
        if (file.mimetype === 'application/x-rar-compressed') cb(null, `${req.user.id}.rar`);
        else cb(null, `${req.user.id}.${file.mimetype.split('/').pop()}`);
    }
});

const codeSampleUpload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 4 }
});

module.exports = codeSampleUpload;
