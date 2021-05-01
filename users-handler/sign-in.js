const userAuth = require('./generate-auth-token');

const handleSignIn = (knex, bcrypt) => async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ error: 'Please enter valid email and password.' });
	};

    try {
        await knex.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return knex('users')
                .where('email', '=', email)
                .update({
                    last_login: new Date()
                })
                .returning('*')
                .then(user => {
                    const token = userAuth.token(user[0]);
                    return res.status(200).json({ user: user[0], token });
                })
            } else {
                return res.status(400).json({ error: 'Wrong credentials, please double check your email and/or password.' });
            }
        })
        .catch(err => res.status(400).json({ error: `Account's up in the air, please sign up one to continue.` }))
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'Fail to sign in, please contact admin for further assistance.' });
    }
};

module.exports = {
    handleSignIn: handleSignIn
};