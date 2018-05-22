const handleSignIn = (db, bcrypt) => (req, res) =>  {
	const {email, password} = req.body;
	if( !email ||  !password){
		return res.status(400).json("incorrect data");
	}

	db.select("user_id", "hash").from("login")
	.leftJoin("users", "login.user_id", "users.id")
	.where("users.email", "=", email)
	.then(data => {
		const isValid = bcrypt.compareSync(password, data[0].hash);
		if(isValid){
			return db.select("*").from("users")
			.where("email", "=", email)
			.then(user => {
				res.json(user[0]);
			})
			.catch(err => res.status(400).json("error logging in"))
		} else {
			res.status(400).json("wrong credentions");
		}
	})
	.catch(err => res.status(400).json("wrong credentions"));
}

module.exports = {
	handleSignIn: handleSignIn
}