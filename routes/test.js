const axios = require('axios');
const FormData = require('form-data');
const express = require('express');
const cheerio = require('cheerio');
const router = express.Router();
let fetch;

// Menggunakan dynamic import untuk node-fetch
(async () => {
  fetch = (await import('node-fetch')).default;
})();

const baseUrl = 'https://instasupersave.com';

router.get('/:id', async (req, res) => {
    try {
        // Fetch halaman HTML dari baseUrl
        const response = await fetch(baseUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Mengambil HTML dari response
        const html = await response.text();

        // Parsing HTML menggunakan cheerio
        const $ = cheerio.load(html);

        // Contoh: Mengambil judul halaman
        const pageTitle = $('title').text();

        // Contoh: Mengambil semua tautan (anchor tag) dan teksnya
        const links = [];
        $('a').each((index, element) => {
            const link = $(element).attr('href');
            const text = $(element).text();
            if (link) {
                links.push({ text, link });
            }
        });

        // Mengirim data yang diparsing sebagai respons JSON
        res.json({
            status: true,
            pageTitle,
            links,
        });

    } catch (e) {
        res.json({ status: false, creator: "Your Name or App Name", message: e.message });
    }
});

module.exports = router;