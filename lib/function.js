const axios = require('axios')

exports.isValidURL = function isValidURL(string) {
    try {
        new URL(string);  // Coba membuat objek URL
        return true;      // Jika berhasil, itu adalah URL yang valid
    } catch (_) {
        return false;     // Jika terjadi error, berarti bukan URL yang valid
    }
}

exports.imgBB = function imgBB(req, imageUrl) {
  return new Promise((resolve, reject) => {
    try {
      // Ambil protokol (http atau https) dan host (misalnya localhost:8080)
      const fullHost = `${req.protocol}://${req.get('host')}`;
      
      // Endpoint API lengkap untuk upload
      const apiUrl = `${fullHost}/imgbb/upload`;

      // Kirimkan request ke API kamu
      axios.post(apiUrl, null, {
        params: {
          url: imageUrl
        }
      })
      .then(response => {
        // Jika upload berhasil, ambil URL gambar dari respons
        const uploadedImageUrl = response.data.url;
        console.log('Upload successful. Image URL:', uploadedImageUrl);
        resolve(uploadedImageUrl); // Kembalikan URL gambar yang diupload
      })
      .catch(error => {
        console.error('Upload failed:', error);
        reject(error); // Kembalikan error jika terjadi kegagalan
      });
    } catch (err) {
      console.error('Error:', err);
      reject(err); // Kembalikan error jika terjadi kesalahan di dalam blok try
    }
  });
};