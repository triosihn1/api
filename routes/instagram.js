__path = process.cwd();
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();
const cors = require('cors');
const cloudscraper = require('cloudflare-scraper');
router.use(cors());

let creator = '@triosihn';
let api_fastdl = 'https://fastdl.app/api/';
let api_stealthgram = 'https://stealthgram.com/api/apiData';

//Router Get User Info
router.get('/userInfo/:username', async(req, res) => {
	try{
		const user = req.params.username;
		if(!user) return res.json({status : false, creator : creator, message: 'This Not Username!!!'});
		let config = {
			method : 'GET',
			maxBodyLength : Infinity,
			url : `${api_fastdl}ig/userInfoByUsername/${user}`,
			headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36' }
		}
		axios.request(config).then((response) => {
			const result = response.data.result
			const data = {
				username: result.user.username,
				full_name: result.user.full_name || null,
				akun_baru: result.user.is_new_to_instagram,
				akun_private: result.user.is_private,
				bio: result.user.biography || null,
				url_eksternal: result.user.external_url || null,
				jumlah_pengikut: result.user.follower_count || null,
				jumlah_mengikuti: result.user.following_count || null,
				jumlah_postingan: result.user.media_count || null,
				foto_profil: result.user.hd_profile_pic_url_info || null,
				link_threads: result.user.threads_profile_glyph_url || null,
				id_user : result.user.pk
			};
			const pic = result.user.has_anonymous_profile_picture
			data.foto_profil = pic ? null : result.user.hd_profile_pic_url_info;
			//Get Data Highlight 
			axios.get(`${api_fastdl}ig/highlights/${result.user.pk}`)
			.then(response => {
				if (response.data.result.length > 0) {
					const sor = response.data.result.map(item => ({
						id_highlights: item.id,
						title_highlights: item.title,
						highlights: item.cover_media.cropped_image_version
					}));
					data.highlights = sor; // Menyimpan hasil sorotan ke dalam data
					res.json({status : true, creator : creator, result : data })
				}else{
					data.highlights = null; // Menyimpan null jika tidak ada sorotan
					res.json({status : true, creator : creator, result : data })
				}
			})
			.catch(erHig => {
				res.json({ status : false, creator : creator, message : `${erHig.message}` });
			})
		}).catch((error) => {
			res.json({ status : false, creator : creator, message : `${error.message}` });
		})
	}catch(err){
		res.json({ status : false, creator : creator, message : `${err.message}` });
	}
});

//Get Stories
router.get('/stories/:id', async(req, res) => {
	try{
		const id_params = req.params.id;
		if(!id_params) return res.json({status : false, creator : creator, message: 'This Not id highlight stories!!!'});
		let config = {
			method : 'GET',
			maxBodyLength : Infinity,
			url : `${api_fastdl}ig/stories/${id_params}`,
			headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36' }
		}
		axios.request(config)
		.then((response) => {
			const result = response.data.result;
			if (!result || result.length === 0) {
				return res.json({ status: false, creator: creator, message: 'Sorry there were no stories shared in the last 24 hours ' });
			}
			const data = result.map(item => ({
				image: item.has_audio ? undefined : item.image_versions2.candidates[0],
				video: item.has_audio ? item.video_versions[0] : undefined,
				audio: item.has_audio || false // Menggunakan item.has_audio secara langsung
			}));
			res.json({ status: true, creator: creator, count : result.length, result: data }); // Kirim hasil ke klien
		}).catch((eParams) => {
			res.json({ status: false, creator: creator, message: eParams.message });
		})
	}catch(e){
		res.json({ status: false, creator: creator, message: e.message });
	}
});

router.get('/highlightStories/:id', async (req, res) => {
	try{
		const id_params = req.params.id;
		if (!id_params) return res.json({status: false, creator: creator, message: 'Check your id..'});
		let config = {
			method: 'GET',
			maxBodyLength: Infinity,
			url: `${api_fastdl}ig/highlightStories/${id_params}`,
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
			}
		}
		axios.request(config)
		.then((response) => {
			const result = response.data.result;
			if (!result || result.length === 0) {
				return res.json({
					status: false,
					creator: creator,
					message: 'Highlight data not found!!!'
				});
			}
			const data = result.map(item => ({
				image: item.has_audio ? undefined : item.image_versions2.candidates[0]?.url,
				video: item.has_audio ? item.video_versions[0]?.url : undefined,
				audio: item.has_audio || false 
			}));
			res.json({ status: true, creator: creator, result: data }); 
		}).catch((eParams) => {
			res.json({ status: false, creator: creator, message: eParams.message });
		});
	}catch(e){
		res.json({ status: false, creator: creator, message: e.message });
	}
})

router.get('/post/:id', async (req, res) => {
  try {
    const id_params = req.params.id;
    if (!id_params) return res.json({ status: false, creator: creator, message: 'Check your id..' });

    let data = {
      "body": {
        "id": 59238751652,
        "count": 50,
        "max_id": null,
        "userName": "triosihn"
      },
      "url": "user/get_media"
    };

    const options = {
      method: 'POST',
      url: api_stealthgram,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    const response = await cloudscraper(options);
    res.json(JSON.parse(response));
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ status: false, creator: creator, message: error.message });
  }
});

router.get('/reels/:id', async (req, res) => {
	try{
		const id_params = req.params.id;
		if (!id_params) return res.json({status: false, creator: creator, message: 'Check your id..'});
		const data = {
  body: {
    id: 59238751652
  },
  url: 'user/get_clips'
};
axios.post('https://stealthgram.com/api/apiData', data, {
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log(response.data); // Menampilkan respons dari server
})
.catch(error => {
  console.error('Error:', error.message); // Menampilkan error jika ada
});
	}catch(e){
		res.json({ status: false, creator: creator, message: e.message });
	}
});
module.exports = router

