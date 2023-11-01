const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express")
const cors = require("cors")
const app = express()
const port = process.env.PORT || 3000;
app.use(cors())

app.use(express.json())
app.get("/", (req, res) => {
    res.send("Welcome to the server")
})


const uri = "mongodb+srv://simple-curd:ruU22OyLCtoQ9qYJ@cluster0.1u9t2.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const userCollection = client.db("userDb").collection("users")

        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result)
        })
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const cursor = { _id: new ObjectId(id) }

            const result = await userCollection.deleteOne(cursor)
            res.send(result)
        })


        app.get('/users', async (req, res) => {
            const query = {}
            const getUsers = await userCollection.find(query).toArray()
            res.send(getUsers)
        })


        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const userInfo = req.body;
            const options = { upsert: true }
            const updatedUser = {
                $set: {
                    name: userInfo.name,
                    email: userInfo.email
                }
            }
            const result = await userCollection.updateOne(filter, updatedUser, options)
            res.send(result)
        })

        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const finds = await userCollection.findOne(query);
            res.send(finds)
        })


    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log("simple curd server is running");
})



//simple-curd
//ruU22OyLCtoQ9qYJ