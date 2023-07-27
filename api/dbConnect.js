//Here we put our instructions for our database connection
const { MongoClient } = require('mongodb');
const uri = process.env.DB_URL

const withDB = async (operations, response) => {
    try {
        const client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("mongoDb database connected");
        const db = client.db("Signup_LoginDB");
        await operations(db);
        client.close();
    } catch (err) {
        console.error(`Error with database operations: ${err}`);
    }
};

module.exports = { withDB };
