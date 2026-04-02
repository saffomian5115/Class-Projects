const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Configure storage for images
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/images/';
        ensureDirectoryExists(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Configure storage for 3D models
const modelStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/models/';
        ensureDirectoryExists(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filters
const imageFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const modelFilter = (req, file, cb) => {
    const allowedTypes = /glb|gltf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
        cb(null, true);
    } else {
        cb(new Error('Only .glb or .gltf files are allowed'), false);
    }
};

// Multer instances
const uploadImages = multer({
    storage: imageStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: imageFilter
}).array('images', 10); // Max 10 images

const uploadModel = multer({
    storage: modelStorage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for 3D models
    fileFilter: modelFilter
}).single('threeDModel');

module.exports = { uploadImages, uploadModel };