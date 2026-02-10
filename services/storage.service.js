const ImageKit = require("imagekit");  // ✅ Also remove @imagekit/nodejs, use 'imagekit'

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

/**
 * Upload a file to ImageKit and store it in the "/menu-items" folder.
 * @param {Object} file - Incoming file object containing the data to upload.
 * @param {Buffer} file.buffer - File data as a Buffer.
 * @param {string} file.originalname - Original filename to use for the uploaded file.
 * @returns {Object} The ImageKit upload response object containing file metadata and URLs.
 * @throws {Error} Rethrows the underlying error if the upload fails.
 */
async function uploadFile(file) {
    try {
        const result = await imagekit.upload({  // ✅ Changed from imagekit.file.upload
            file: file.buffer.toString('base64'),
            fileName: file.originalname,
            folder: "/menu-items"
        });

        return result;
    } catch (error) {
        console.error("ImageKit upload failed:", error);
        throw error;
    }
}

module.exports = { uploadFile };