const express    = require('express');
const router     = express.Router();
const multer     = require('multer');
const cloudinary = require('../lib/cloudinary');
const { requireAuth } = require('../middleware/auth');
const { Readable } = require('stream');
const logger = require('../utils/logger');

// Store file in memory — we pipe it directly to Cloudinary
const upload = multer({
    storage: multer.memoryStorage(),
    limits:  { fileSize: 10 * 1024 * 1024 }, // 10 MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image and video files are allowed'), false);
        }
    },
});

/**
 * POST /api/upload
 * Authenticated — any role can upload.
 * Body: multipart/form-data with field "file" and optional "folder" text field.
 * Returns: { url, publicId }
 */
router.post('/', requireAuth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file received' });
        }

        const folder = req.body.folder || 'uploads';

        // Pipe buffer → Cloudinary upload stream
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder:        `localtrust/${folder}`,
                    resource_type: 'auto',
                    use_filename:  false,
                    unique_filename: true,
                },
                (error, result) => {
                    if (result) resolve(result);
                    else reject(error);
                }
            );

            // Convert Buffer to Readable stream and pipe
            const readable = new Readable();
            readable._read = () => {};
            readable.push(req.file.buffer);
            readable.push(null);
            readable.pipe(stream);
        });

        logger.info(`Upload OK — ${uploadResult.secure_url}`);
        return res.status(200).json({
            url:      uploadResult.secure_url,
            publicId: uploadResult.public_id,
        });

    } catch (err) {
        logger.error('Upload error:', err);
        return res.status(500).json({ message: 'Upload failed', error: err.message });
    }
});

module.exports = router;
