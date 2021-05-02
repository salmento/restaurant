import mongodb from 'mongodb';

const ObjectId = mongodb.ObjectID;

let reviews;

export default class ReviewsDAO {
  static async injectDB(conn) {
    if (reviews) {
      return;
    }
    try {
      reviews = await conn.db(process.env.RESTREVIEWS_NS).collection('reviews');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }

  static async addReview(restaurantId, user, review, date) {
    try {
      const reviewDoc = {
        name: user.name,
        // eslint-disable-next-line no-underscore-dangle
        user_id: user._id,
        date,
        text: review,
        restaurant_id: ObjectId(restaurantId),
      };

      return await reviews.insertOne(reviewDoc);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Unable to post review: ${e}`);
      return { error: e };
    }
  }

  static async updateReview(reviewId, userId, text, date) {
    try {
      const updateResponse = await reviews.updateOne(
        { user_id: userId, _id: ObjectId(reviewId) },
        { $set: { text, date } },
      );

      return updateResponse;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Unable to update review: ${e}`);
      return { error: e };
    }
  }

  static async deleteReview(reviewId, userId) {
    try {
      const deleteResponse = await reviews.deleteOne({
        _id: ObjectId(reviewId),
        user_id: userId,
      });

      return deleteResponse;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Unable to delete review: ${e}`);
      return { error: e };
    }
  }
}
