const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use (cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gshit.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("tour_Package");
        const userCollection = database.collection("users");

        const packageCollection = database.collection("package");
        const setplan = database.collection("set_plan");

        //  Get Products API 
        app.get("/packages", async (req, res) => {
            const cursor= packageCollection.find({});
            const package = await cursor.toArray();
            res.send(package);
        });

        // get all plan

        app.get("/setplan", async (req, res) => {
            const cursor = setplan.find({});
            const plan = await cursor.toArray();
            res.send(plan);
        })

        // plan post  
        app.post("/setplan", async (req, res) => {
            const plan =req.body;
            const result = await setplan.insertOne(plan);
            res.json(result);
        })
        app.get("/packages", async (req, res) => {
            const cursor = packageCollection.findOne({email:email});
            const package = await cursor.toArray();
            res.send(package);
        })

        // app.get('/packages/:packsId', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const service = await packageCollection.findOne(query);
        //     res.json(service)
        // })

        app.get("/packages/:_id", async (req, res) => {
            const id = req.params._id;
            const query = { _id: ObjectId(id) };
            const product = await packageCollection.findOne(query);
            res.json(product);
          });

          app.get("/users/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === "admin") {
              isAdmin = true;
            }
            res.json({ admin: isAdmin });
          });

          app.get("/users", async (req, res) => {
            const cursor = userCollection.find({});
            const user = await cursor.toArray();
            res.send(user);
          });
          app.post("/users", async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.json(result);
            console.log(result);
          });

          app.put("/users", async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.json(result);
          });
      


    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);





app.get('/', (req, res) =>{
    res.send("server tour is running")
});

app.listen(port, () =>{
    console.log("server running in port", port);
});