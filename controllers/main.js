// const express = require('express');
const jwt = require('jsonwebtoken');
const { BadRequestError } = require('../errors/');
const RestaurantsDAO = require('../DAO/restaurantsDAO');
const ReviewsDAO = require('../DAO/reviewsDAO');


const login = async (req, res) => {
    const { username, password } = req.body;
    //mongoose validation
    //Joi
    //check in the controller

    if (!username || !password) {
        throw new BadRequestError('Please provide a username and password')
    }

    const id = new Date().getDate();
    const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: '30d' });

    //console.log(username, password);
    res.status(200).json({ msg: 'user created', token })
    //res.send('fake login/register/signup route')
};
const dashboard = async (req, res) => {

    const luckyNumber = Math.floor(Math.random() * 100);
    res.status(200).json({ msg: `Hello, ${req.user.username}`, secret: `Here is your authorized data, your lucky number is ${luckyNumber}` });

};
const restaurantApiGetRestaurants = async (req, res, next) => {

    const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10) : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0

    let filters = {}
    if (req.query.cuisine) {
        filters.cuisine = req.query.cuisine
    } else if (req.query.zipcode) {
        filters.zipcode = req.query.zipcode
    } else if (req.query.name) {
        filters.name = req.query.name
    }

    const { restaurantsList, totalNumRestaurants } = await RestaurantsDAO.getRestaurants({
        filters,
        page,
        restaurantsPerPage,
    })

    let response = {
        restaurants: restaurantsList,
        page: page,
        filters: filters,
        entries_per_page: restaurantsPerPage,
        total_results: totalNumRestaurants,
    }
    res.status(200).json(response)
};
const restaurantApiGetRestaurantsById = async (req, res, next) => {
  try {
    let id = req.params.id || {}
    let restaurant = await RestaurantsDAO.getRestaurantByID(id)
    if (!restaurant) {
      res.status(404).json({ error: "Not found" })
      return
    }
    res.json(restaurant)
  } catch (e) {
    console.log(`api, ${e}`)
    res.status(500).json({ error: e })
  }
};
const restaurantApiGetCuisines = async (req, res, next) => {
  try {
    let cuisines = await RestaurantsDAO.getCuisines()
    res.json(cuisines)
  } catch (e) {
    console.log(`api, ${e}`)
    res.status(500).json({ error: e })
  }
};
const reviewsPostReviews = async (req, res, next) => {
    console.log("🚀 ~ file: main.js ~ line 84 ~ reviewsPostReviews ~ req.body", req)
  
 
    try {
        const restaurantId = req.body.restaurant_id
        const review = req.body.text
        const userInfo = {
          name: req.body.name,
          _id: req.body.user_id
        }
        const date = new Date()
  
        const ReviewResponse = await ReviewsDAO.addReview(restaurantId, userInfo, review, date);
        // console.log("🚀 ~ file: main.js ~ line 101 ~ reviewsPostReviews ~ ReviewResponse", ReviewResponse)
        res.json({ status: "success" })
      } catch (e) {
        res.status(500).json({ error: e.message })
      }
};
const reviewsUpdateReviews = async (req, res, next) => {
  console.log("🚀 ~ file: main.js ~ line 104 ~ reviewsUpdateReviews ~ req", req.body)
  
    try {
        const reviewId = req.body.review_id
        const text = req.body.text
        const date = new Date()
  
        const reviewResponse = await ReviewsDAO.updateReview(
          reviewId,
          req.body.user_id,
          text,
          date,
        )
  
        var { error } = reviewResponse
        if (error) {
          res.status(400).json({ error })
        }
  
        if (reviewResponse.modifiedCount === 0) {
          throw new Error(
            "unable to update review - user may not be original poster",
          )
        }
  
        res.json({ status: "success" })
      } catch (e) {
        res.status(500).json({ error: e.message })
      }
    // res.status(200).json({msg: 'Roger that'})
};
const reviewsDeleteReviews = async (req, res, next) => {
    try {
        const reviewId = req.query.id
        const userId = req.body.user_id
        console.log(reviewId)
        const reviewResponse = await ReviewsDAO.deleteReview(
          reviewId,
          userId,
        )
        res.json({ status: "success" })
      } catch (e) {
        res.status(500).json({ error: e.message })
      }
    // res.status(200).json({msg: 'Roger that'})
};
module.exports = {
    login,
    dashboard,
    restaurantApiGetRestaurants,
    restaurantApiGetRestaurantsById,
    restaurantApiGetCuisines,
    reviewsPostReviews,
    reviewsUpdateReviews,
    reviewsDeleteReviews
};