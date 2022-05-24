const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
   
    app.get("/part" , async (req, res) => {
        const query ={}
        const cursor = partsCollection.find(query);
        const parts = await cursor.toArray();
        res.send(parts);
     })
  } finally {
   
   
  }
}
run().catch(console.dir);






app.listen(port, () => {
    console.log('Reliable parts server is running ');
})