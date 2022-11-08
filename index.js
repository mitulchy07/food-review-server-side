const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mhsbjhf.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db('assignment11').collection('subjects');

    const orderCollection = client.db('assignment11').collection('reviews');

    app.get('/foods', async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const foods = await cursor.limit(3).toArray();
      res.send(foods);
    });
    app.get('/allfoods', async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const foods = await cursor.toArray();
      res.send(foods);
    });

    app.get('/allfoods/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const food = await serviceCollection.findOne(query);
      res.send(food);
    });

    app.get('/allreviews', async (req, res) => {
      const query = {};
      const cursor = orderCollection.find(query);
      const allReviews = await cursor.toArray();
      res.send(allReviews);
    });

    app.get('/allreviews/:name', async (req, res) => {
      const name = req.params.name;
      let query = {};
      if (name) {
        query = {
          name: name,
        };
      }
      const cursor = orderCollection.find(query);
      const myReviews = await cursor.toArray();
      res.send(myReviews);
      console.log(name);
    });

    //orders api
    app.get('/myreviews', async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = orderCollection.find(query);
      const myReviews = await cursor.toArray();
      res.send(myReviews);
    });

    app.post('/additem', async (req, res) => {
      const item = req.body;
      const result = await serviceCollection.insertOne(item);
      res.send(result);
    });
    app.post('/addreview', async (req, res) => {
      const review = req.body;
      const result = await orderCollection.insertOne(review);
      res.send(result);
    });

    app.patch('/orders/:id', async (req, res) => {
      const id = req.params.id;

      const status = req.body.status;
      const query = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: status,
        },
      };
      const result = await orderCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => {
  console.error(err);
});

app.get('/', (req, res) => {
  res.send('Genius Car Server is Running.');
});

app.listen(port, () => {
  console.log(`Genious Car server running on: ${port} `);
});
