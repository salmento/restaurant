// eslint-disable-next-line import/extensions
import RestaurantsDAO from '../dao/restaurantsDao.js';

export default class RestaurantsController {
  static async apiGetRestaurants(req, res) {
    const restaurantsPerPage = req.query.restaurantsPerPage
      ? parseInt(req.query.restaurantsPerPage, 10) : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    const filters = {};
    if (req.query.cuisine) {
      filters.cuisine = req.query.cuisine;
    } else if (req.query.zipcode) {
      filters.zipcode = req.query.zipcode;
    } else if (req.query.name) {
      filters.name = req.query.name;
    }

    const { restaurantsList, totalNumRestaurants } = await RestaurantsDAO.getRestaurants({
      filters,
      page,
      restaurantsPerPage,
    });

    const response = {
      restaurants: restaurantsList,
      page,
      filters,
      entries_per_page: restaurantsPerPage,
      total_results: totalNumRestaurants,
    };
    res.json(response);
  }

  static async apiGetRestaurantById(req, res) {
    try {
      const id = req.params.id || {};
      const restaurant = await RestaurantsDAO.getRestaurantByID(id);
      if (!restaurant) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      res.json(restaurant);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiGetRestaurantCuisines(req, res) {
    try {
      const cuisines = await RestaurantsDAO.getCuisines();
      res.json(cuisines);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }
}
