const express = require('express');
const router = express.Router();
const {
        login,
        dashboard,
        restaurantApiGetRestaurants,
        restaurantApiGetRestaurantsById,
        restaurantApiGetCuisines,
        reviewsPostReviews,
        reviewsUpdateReviews,
        reviewsDeleteReviews,
    } = require('../controllers/main');


const authenticationMiddleware = require('../middleware/auth');

router.route('/login').post(login);
// router.route('/dashboard').get(authenticationMiddleware, dashboard);

router.route('/restaurants').get(restaurantApiGetRestaurants)
router.route('/restaurants/id/:id').get(restaurantApiGetRestaurantsById);
router.route('/cuisines').get(restaurantApiGetCuisines);

router.route('/reviews')
        .post(reviewsPostReviews)
        .put(reviewsUpdateReviews)
        .delete(reviewsDeleteReviews);

module.exports = router;