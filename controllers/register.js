const handleRegister = (db, bcrypt) => (req, res) => {
	const {email, name, password} = req.body;

	if( !email || !name || !password){
		return res.status(400).json("incorrect data");
	}

	const hash = bcrypt.hashSync(password);

	db.transaction(trx => {
		trx("users")
		.insert({name: name, email: email, joined: new Date()})
		.returning("*")
		.then(user => {
			res.json(user[0]);
			return trx("login")
			.insert({hash: hash, user_id: user[0].id})
			.returning("user_id");
		})	
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch( err => res.status(400).json("unable to register"));
}

module.exports = {
	handleRegister: handleRegister
}