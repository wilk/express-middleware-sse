var request = require ('request') ,
		expect = require('chai').expect;

describe ('/text', function () {
	it ('should return only text data', function () {
		request.get ('http://localhost:9500/text', function (err, res, body) {
			expect(res.headers['content-type']).to.contain ('text/event-stream');
			expect(body).to.equal ("data:text\n");
			done ();
		});
	});
});
