var app = require('express') () ,
		mw_sse = require ('../index.js');

app.use (mw_sse ());

app.get ('/text', function (req, res, next) {
	res.sse ('text');
});

app.listen ('9500');
