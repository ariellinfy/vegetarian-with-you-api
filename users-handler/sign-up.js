const userAuth = require('./generate-auth-token');

const handleSignUp = (knex, bcrypt) => async (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password){
		return res.status(400).json('incorrect form submission');
	}

    const hash = await bcrypt.hash(password, 9);
    
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
                const token = userAuth.token(user[0]);
				res.status(201).json({ user: user[0], token });
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