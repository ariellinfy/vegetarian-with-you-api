const userAuth = require('./generate-auth-token');

const handleSignUp = (knex, bcrypt) => async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		return res.status(400).json({ error: 'please enter valid name, email and password' });
	};

    const hash = await bcrypt.hash(password, 9);
    
    try {
        await knex.transaction(trx => {
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
                    return res.status(201).json({ user: user[0], token });
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => {
            console.log(err)
            if (err.code === '23505') {
                return res.status(400).json({ error: 'This email already existed, please sign in or use another email to create a new account.' })
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'Fail to sign up, please contact admin for further assistance.' });
    }
};

module.exports = {
    handleSignUp: handleSignUp
};