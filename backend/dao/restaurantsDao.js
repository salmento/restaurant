import mongodb from 'mongodb';

const ObjectId = mongodb.ObjectID;

let restaurants;

export default class RestaurantsDao {
  static async injectDB(conn) {
    if (restaurants) {
      return;
    }

    try {
      restaurants = await conn.db(process.env.RESTRIVIES).collection('restaurants');
    } catch (e) {
      throw new Error(`Unable to establish a restaurant handle in restaurantsDao: ${e}`);
    }
  }

  static async getRestaurants({
    filters = null,
    page = 0,
    restaurantsPerPage = 20,
  } = {}) {
    let query;
    if (filters) {
      if ('name' in filters) {
        query = { $text: { $search: filters.name } };
      } else if ('cuisine' in filters) {
        query = { cuisine: { $eq: filters.cuisine } };
      } else if ('zipcode' in filters) {
        query = { 'address.zipcode': { $eq: filters.zipcode } };
      }
    }

    let cursor;

    try {
      cursor = await restaurants
        .find(query);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Unable to issue find command, ${e}`);
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }
    const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page);

    try {
      const restaurantsList = await displayCursor.toArray();
      const totalNumRestaurants = await restaurants.countDocuments(query);

      return { restaurantsList, totalNumRestaurants };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      );
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }
  }

  static async getRestaurantByID(id) {
    // eslint-disable-next-line no-useless-catch
    try {
      const pipeline = [
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $lookup: {
            from: 'reviews',
            let: {
              id: '$_id',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$restaurant_id', '$$id'],
                  },
                },
              },
              {
                $sort: {
                  date: -1,
                },
              },
            ],
            as: 'reviews',
          },
        },
        {
          $addFields: {
            reviews: '$reviews',
          },
        },
      ];
      return await restaurants.aggregate(pipeline).next();
    } catch (e) {
      throw e;
    }
  }

  static async getCuisines() {
    let cuisines = [];
    try {
      cuisines = await restaurants.distinct('cuisine');
      return cuisines;
    } catch (e) {
      return cuisines;
    }
  }
}
