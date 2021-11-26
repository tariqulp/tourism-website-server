const express = require('express')
var cors = require('cors')
const { MongoClient } = require('mongodb');
const { ObjectId } = require('bson');
require('dotenv').config()



const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rgnum.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)

async function run() {
    await client.connect();
    const database = client.db('Tourism');
    const servicesCollection = database.collection('services');
    const ordersCollection = database.collection('orders');
    try {
        // get api
        app.get('/services', async (req, res) => {

            const query = {};
            const cursor = servicesCollection.find(query);
            services = await cursor.toArray()

            res.json(
                services
            );

        })
        // post api
        app.post('/services', async (req, res) => {
            const data = req.body;
            const result = await servicesCollection.insertOne(data);
            console.log("posted", data)
            res.json(result);
        })
        // post api
        app.post('/orders', async (req, res) => {

            const order = req.body;

            // console.log("hitting orders")
            const result = await ordersCollection.insertOne(order)
            res.json(result)

        })
        // get api
        app.get('/orders/manageall', async (req, res) => {

            const query = {};
            const cursor = ordersCollection.find(query);
            allorders = await cursor.toArray()

            res.json(allorders);

        })


        // delete api
        app.delete('/orders/delete/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query);
            // console.log("delete")
            res.send(result)

        })
        // put api
        app.put('/status/:id', async (req, res) => {
            console.log('hitting post')
            const id = req.params.id
            const data = req.body;
            console.log(data)

            const query = { _id: ObjectId(id) }


            const updateDoc = {
                $set: {
                    status: data.isStatus
                },
            };
            const result = await ordersCollection.updateOne(query, updateDoc);
            // console.log("delete")
            res.json(result)

        }
        )

    }
    finally {
        // await client.close()

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('server running')
})

app.listen(port, () => {
    console.log("listening to port", port)
})