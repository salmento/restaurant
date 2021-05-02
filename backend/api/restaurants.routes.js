import express from 'express';
// eslint-disable-next-line import/extensions
import restaurantsController from './restaurants.controller.js';
// eslint-disable-next-line import/extensions
import reviewsController from './reviews.controller.js';

const router = express.Router();

router.route('/').get(restaurantsController.apiGetRestaurants);

router
  .route('/review')
  .post(reviewsController.apiPostReview)
  .put(reviewsController.apiUpdateReview)
  .delete(reviewsController.apiDeleteReview);

export default router;
