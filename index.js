const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
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

// function verifyJWT(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).send({ message: 'Unauthorized Access' });
//   }
//   const token = authHeader.split(' ')[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
//     if (err) {
//       return res.status(401).send({ message: 'Unauthorized Access' });
//     }
//     req.decoded = decoded;
//     next();
//   });
// }

async function run() {
  try {
    const serviceCollection = client.db('assignment11').collection('subjects');

    const orderCollection = client.db('assignment11').collection('reviews');

    app.get('/foods', async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query).sort({ date: -1 });
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
    app.get('/allreviews/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const food = await orderCollection.findOne(query);
      res.send(food);
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
    });

    //orders api
    app.get('/myreviews', async (req, res) => {
      const query = {};
      const cursor = orderCollection.find(query);
      const myReviews = await cursor.toArray();
      res.send(myReviews);
    });
    // verifyJWT,
    app.get('/myreviews/:email', async (req, res) => {
      const email = req.params.email;
      let query = {};
      if (email) {
        query = {
          email: email,
        };
      }
      const cursor = orderCollection.find(query);
      const myReviews = await cursor.toArray();
      res.send(myReviews);
      console.log(email);
    });

    app.post('/jwt', (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',
      });
      res.send({ token });
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

    // app.get('/myreviews/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const food = await orderCollection.findOne(query);
    //   res.send(food);
    // });

    // app.patch('/myreviews/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await orderCollection.updateOne(query, updatedDoc);
    //   res.send(result);
    // });

    app.delete('/myreviews/:id', async (req, res) => {
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
