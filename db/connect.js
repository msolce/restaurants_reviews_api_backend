const mongodb =require("mongodb");


const connectDB = (conn) =>{
    const MongoClient = mongodb.MongoClient

    return MongoClient.connect(
        conn,
        {
          maxPoolSize: 50,
          wtimeout: 2500,
        //   useNewUrlParse: true
        }
        )
        .catch(err => {
          console.error(err.stack)
          process.exit(1)
        })

};

module.exports = connectDB;