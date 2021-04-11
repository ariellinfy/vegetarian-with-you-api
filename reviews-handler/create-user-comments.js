const createUserComment = async (knex, userId, reviewId, restaurantId) => {
    try {
        await knex('user_comments').insert({
            user_id: userId,
            review_id: reviewId,
            restaurant_id: restaurantId
        })
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    createUserComment: createUserComment
};