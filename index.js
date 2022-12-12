require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const  connectDB  = require('./db/connect')
const RestaurantsDAO = require('./DAO/restaurantsDAO')
const ReviewsDAO = require('./DAO/reviewsDAO')
const path = require('path');

const app = express();

const mainRouter = require('./routes/main');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


// middleware
// app.use(express.static('./public'));
app.use(cors())
app.use(express.json());

app.use(function (req, res, next) {
  res.set({
    'Content-Type': 'text/plain',
  })
  next();
});

// app.use(express.urlencoded({ extended: false }))

app.use('/api/v1', mainRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


// //Serve Static Assets in production 
// //set static folder
// app.use(express.static('client/build'));
// app.get('*', (req, res) => {
// res.sendFile(path.resolve(__dirname, 'client', 'build',  'index.html'));
// });

const port = process.env.PORT || 3001;

const start = async () => {
  try {
    const client = await connectDB(process.env.RESTREVIEWS_DB_URI);
    await ReviewsDAO.injectDB(client)
    await RestaurantsDAO.injectDB(client)
    app.listen(port, () =>
    console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(`Not listening on port ${port}`);
    console.log(error);
  }
};

start();