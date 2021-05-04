const addContribution = async (knex, userId) => {
    try {
        await knex('users').select('contributions')
        .where('user_id', '=', userId)
        .then(data => {
            return knex('users').where('user_id', '=', userId)
            .update({
                contributions: data[0].contributions+1
            })
        })
        .catch(err => console.log(err, 'error updating data'))
    } catch (e) {
        console.log(e);
    }
};

module.exports = {
    addContribution: addContribution
};