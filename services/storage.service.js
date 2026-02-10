const ImageKit = require("imagekit");  // ✅ Also remove @imagekit/nodejs, use 'imagekit'

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

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