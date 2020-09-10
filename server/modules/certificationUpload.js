const multer = require('multer');
const path = require('path');
const { checkDirectory } = require('../util/file');

// file filter
const fileFilter = (req, file, cb) => {
    const position = req.params.position;
    const isValidPosition = position >= 0 && position <= 2;
    const isValidType = file.mimetype === 'application/pdf';
    if (isValidPosition && isValidType)
        // store file
        cb(null, true);
    else {
        // reject file
        if (!isValidPosition) cb(new Error('Illegal certification position'), false);
        if (!isValidType) cb(new Error('Illegal file mime type'), false);
    }
};
// storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const directory = path.join(
            global.root_dir,
            'uploads',
            'talents',
            req.user.id,
            'edit_request',
            'certifications'
        );
        // check if directory exist if not create it
        checkDirectory(directory, err => {
            if (err) new Error(err.message);
            else cb(null, directory);
        });
    },
    filename: function(req, file, cb) {
        cb(null, `${req.user.id}-${req.params.position}.${file.mimetype.split('/').pop()}`);
    }
});

const certificationUpload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 4 }
});

module.exports = certificationUpload;
