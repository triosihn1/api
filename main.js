const express = require('express');
const cors = require('cors');
const secure = require('ssl-express-www');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;
//+++++[ ROUTER API ]++++++//
const instagram = require('./routes/instagram.js'),
		   imgbb = require('./routes/imgbb.js'),
			test = require('./routes/test.js');

app.enable('trust proxy');
app.set('json spaces', 2);
app.use(cors());
app.use(secure);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/instagram',instagram);
app.use('/imgbb',imgbb);
app.use('/test',test);

app.listen(PORT, (error)=> {
	if(!error)
		console.log('Api berjalan di localhost:'+PORT)
	else
		console.log('Error : '+error);
});

module.exports = app
