const handleSignUp = (knex, bcrypt, jwt) => (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password){
		return res.status(400).json('incorrect form submission');
	}

    const hash = bcrypt.hashSync(password, 9);
    
	knex.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
			.returning('*')
			.insert({
				public_name: name,
				email: loginEmail[0],
				joined: new Date()
			})
			.then(user => {
                const token = jwt.sign({ id: user[0].id}, 'shh');
                console.log(token);
				res.status(200).json({ user: user[0], token });
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('unable to register'))
}

module.exports = {
	handleSignUp: handleSignUp
};