const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId

let reviews

class ReviewsDAO {
    static async injectDB(conn) {
        if (reviews) {
          return
        }
        try {
          reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews") || 'H'
          // console.log(reviews)
        } catch (e) {
          console.error(`Unable to establish collection handles in userDAO: ${e}`)
        }
      }      
      static async addReview(restaurantId, user, review, date) {
        console.log("🚀 ~ file: reviewsDAO.js ~ line 19 ~ ReviewsDAO ~ addReview ~ restaurantId", restaurantId)
        
        try {
          const reviewDoc = { 
              name: user.name,
              user_id: user._id,
              date: date,
              text: review,
              restaurant_id: ObjectId(restaurantId)
            }
          console.log("🚀 ~ file: reviewsDAO.js ~ line 26 ~ ReviewsDAO ~ addReview ~ reviewDoc", reviewDoc)
          
    
          return await reviews.insertOne(reviewDoc)
        } catch (e) {
          console.error(`Unable to post review: ${e}`)
          return { error: e }
        }
      }    
      static async updateReview(reviewId, userId, text, date) {
        try {
          const updateResponse = await reviews.updateOne(
            { user_id: userId, _id: ObjectId(reviewId)},
            { $set: { text: text, date: date  } },
          )
    
          return updateResponse
        } catch (e) {
          console.error(`Unable to update review: ${e}`)
          return { error: e }
        }
      }    
      static async deleteReview(reviewId, userId) {
    
        try {
          const deleteResponse = await reviews.deleteOne({
            _id: ObjectId(reviewId),
            user_id: userId,
          })
    
          return deleteResponse
        } catch (e) {
          console.error(`Unable to delete review: ${e}`)
          return { error: e }
        }
      }
};

module.exports = ReviewsDAO;