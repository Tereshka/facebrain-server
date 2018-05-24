const Clarifai = require('clarifai');

const app = new Clarifai.App({
   // apiKey: process.env.API_CLARIFAI
   apiKey: 'd21412e671bc420182dbe37f6eea810a'
  });

const handleApiCall = () => (req, res) => {
	app.models.predict("a403429f2ddf4b49b307e318f00e528b", req.body.input)
	.then(data => {
		res.json(data);
	})
	.catch(err => res.status(400).json("unable to work with API"));
}


const handleImage = (db) => (req, res) => {
	const {id} = req.body;

	db("users")
		.where("id", "=", id)
		.increment("entry", 1)
		.returning("entry")
	.then( entry => {
		if(entry.length){
			res.json(entry);
		} else {
			res.status(400).json("unable to get entries of user with id = " + id);
		}
	})
	.catch( err => res.status(400).json("unable to get entries"));
}

module.exports = {handleImage, handleApiCall}