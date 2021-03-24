const userAuth = require('./generate-auth-token');

const handleSignIn = (knex, bcrypt) => (req, res) => {
	const { email, password } = req.body;
	if (!email || !password){
		return res.status(400).json('incorrect form submission');
	}

    knex.select('email', 'hash').from('login')
	.where('email', '=', email)
	.then(data => {
		const isValid = bcrypt.compareSync(password, data[0].hash);
		if (isValid){
			return knex('users')
			.where('email', '=', email)
            .update({
				last_login: new Date()
			})
            .returning('*')
			.then(user => {
                const token = userAuth.token(user[0]);
				res.status(200).json({ user: user[0], token });
			})
			.catch(err => res.status(400).json('unable to get user'))
		} else {
			res.status(400).json('wrong credential');
		}
	})
	.catch(err => res.status(400).json('error, please enter valid credentials'))
}

module.exports = {
	handleSignIn: handleSignIn
};