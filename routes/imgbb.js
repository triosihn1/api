const path = process.cwd(); // pastikan path yang benar
const express = require('express');
const axios = require('axios');
const router = express.Router();
const cors = require('cors');
router.use(cors());

// Pastikan path yang benar di sini untuk mengimpor isValidURL
const { isValidURL } = require(path + '/lib/function');

//------------[ KEY & BASE URL IMGBB & CREATOR ]---------------
const key = '318d944a11a4c39a97361ce85f394b66';
const baseUrl = 'https://api.imgbb.com/1/upload';
let creator = '@triosihn';

//-----------------------[Main Router ]-----------------------
router.post('/upload', async (req, res) => {
    const imageUrl = req.body.url;
    const expiration = req.body.expiration || 60;  // Set default expiration to 60 jika tidak ada
    const name = req.body.name ? `&name=${encodeURIComponent(req.body.name)}` : '';  // Encode name jika ada

    // Cek apakah URL gambar ada dan valid
    if (!imageUrl) {
        return res.status(400).json({ status: false, creator: creator, message: 'Enter Image Url!' });
    }

    if (!isValidURL(imageUrl)) {
        return res.status(400).json({ status: false, creator: creator, message: 'Please double check the url you entered!!' });
    }

    // Persiapkan konfigurasi untuk request API
    let config = {
        method: 'POST',
        maxBodyLength: Infinity,
        url: `${baseUrl}?key=${encodeURIComponent(key)}&image=${encodeURIComponent(imageUrl)}${name}&expiration=${encodeURIComponent(expiration)}`, // Encode seluruh URL
        //headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36' }
    };

    try {
        // Menunggu response dari axios
        const response = await axios.request(config);
        const result = response.data;

        // Periksa apakah data berhasil atau tidak
        if (!result.data || result.data.length === 0) {
            return res.json({ status: false, creator: creator, message: 'Try again !!' });
        }
		
        // Kirimkan hasil upload gambar ke client
        res.json({
            status: true,
            creator: creator,
            data: {
                id: result.data.id,
                title: result.data.title,
                url: result.data.url,
                expired: result.data.expiration,
                size: result.data.size,
                image: result.data.image
            }
        });
    } catch (eParams) {
        // Tangani kesalahan
        res.json({ status: false, creator: creator, message: `${eParams.message}` });
    }
});

module.exports = router;