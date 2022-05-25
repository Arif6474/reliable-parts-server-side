const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>{
    res.send('Running reliable parts server')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tu9v0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    const partsCollection = client.db('reliable_parts').collection('parts');
    const orderCollection = client.db('reliable_parts').collection('orders');
    const userCollection = client.db('reliable_parts').collection('users');
     // get all parts 
    app.get("/part" , async (req, res) => {
        const query ={}
        const cursor = partsCollection.find(query);
        const parts = await cursor.toArray();
        res.send(parts);
     })

       //get part details
    app.get('/part/:id' , async (req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const part= await partsCollection.findOne(query);
        res.send(part);
  
      })  
        // post order 
     app.post('/order', async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);

    });
    // get my order 
    app.get('/order', async (req, res) => {
      const customer = req.query.customer;
      const query = {customer : customer};
      const order = await orderCollection.find(query).toArray();
      res.send(order);

    })
    //post user info
    app.put('/user/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter ={email: email};
      const options = { upsert: true };
      const updateDoc = {
       $set: user
     };
     const result = await userCollection.updateOne(filter, updateDoc, options);
    //  const token = jwt.sign({email : email} , process.env.ACCESS_TOKEN_SECRET , { expiresIn: '1h' })
     res.send(result);
    })
  } finally {
   
   
  }
}
run().catch(console.dir);






app.listen(port, () => {
    console.log('Reliable parts server is running ');
})