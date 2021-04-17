const userAuth = require('./generate-auth-token');

const handleSignUp = (knex, bcrypt) => async (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password){
		return res.status(400).json('incorrect form submission');
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
            if (err.code === '23505') {
                return res.status(400).json({ error: 'this email already existed, please try sign in or use another email to create new account' })
            } else {
                return res.status(400).json({ err })
            }
        })
    } catch (err) {
        res.status(400).json(err);
    }
};

module.exports = {
    handleSignUp: handleSignUp
};