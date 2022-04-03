const express = require('express');
const { send } = require('express/lib/response');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());
app.use(express.json());
const ObjectId = require('mongodb').ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oxbfj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const HairAndSpaDB = client.db('HairAndSpaDB');
    const packagesCollection = HairAndSpaDB.collection('packagesCollection');
    const sarynaKeyCollection = HairAndSpaDB.collection('sarynaKeyCollection');
    const kerastaseCollection = HairAndSpaDB.collection('kerastaseCollection');
    const hairToolsCollection = HairAndSpaDB.collection('hairToolsCollection');
    const servicesCollection = HairAndSpaDB.collection('servicesCollection');

    //POST API for packages
    app.post('/packages', async (req, res) => {
      const {
        PackageName,
        PackagePrice,
        Time,
        PackageCategory_1,
        PackageCategory_2,
        PackageCategory_3,
        PackageCategory_4,
        PackageCategory_5,
      } = req.body;
      const package = {
        name: PackageName,
        price: PackagePrice,
        time: Time,
        category: [
          PackageCategory_1,
          PackageCategory_2,
          PackageCategory_3,
          PackageCategory_4,
          PackageCategory_5,
        ],
      };
      const result = await packagesCollection.insertOne(package);
      res.send(result);
    });

    // GET API for packages
    app.get('/packages', async (req, res) => {
      const cursor = packagesCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // GET API for single package
    app.get('/packages/:packageID', async (req, res) => {
      const id = req.params.packageID;
      const query = { _id: ObjectId(id) };
      const package = await packagesCollection.findOne(query);
      res.send(package);
    });

    // PUT API for single package
    app.put('/packages/:packageID', async (req, res) => {
      const {
        PackageID,
        PackageName,
        PackagePrice,
        Time,
        PackageCategory_1,
        PackageCategory_2,
        PackageCategory_3,
        PackageCategory_4,
        PackageCategory_5,
      } = req.body;

      const filter = { _id: ObjectId(PackageID) };

      const package = {
        $set: {
          name: PackageName,
          price: PackagePrice,
          time: Time,
          category: [
            PackageCategory_1,
            PackageCategory_2,
            PackageCategory_3,
            PackageCategory_4,
            PackageCategory_5,
          ],
        },
      };

      const options = { upsert: true };
      const result = await packagesCollection.updateOne(
        filter,
        package,
        options
      );
      res.send(result);
    });

    // DELETE API for single package
    app.delete('/packages/:packageID', async (req, res) => {
      const id = req.params.packageID;
      const filter = { _id: ObjectId(id) };
      const result = await packagesCollection.deleteOne(filter);
      res.send(result);
    });
    //POST API for sarynaKey
    app.post('/sarynaKey', async (req, res) => {
      const {
        SarynaKeyName,
        SarynaKeyPrice,
        BrandName,
        Description,
        SarynaKeyImage,
      } = req.body;
      const sarynaKey = {
        name: SarynaKeyName,
        brand: BrandName,
        description: Description,
        price: SarynaKeyPrice,
        picture: SarynaKeyImage,
      };

      const result = await sarynaKeyCollection.insertOne(sarynaKey);
      res.send(result);
    });

    // GET API for sarynaKey
    app.get('/sarynaKey', async (req, res) => {
      const cursor = sarynaKeyCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    //POST API for kerastase
    app.post('/kerastase', async (req, res) => {
      const { CategoryName, Price, Name, BrandName, Description, image } =
        req.body;
      const filter = { categoryName: CategoryName };
      const options = { upsert: true };
      const updateDoc = {
        $push: {
          products: {
            PdID: Name,
            name: Name,
            brand: BrandName,
            description: Description,
            price: Price,
            image: image,
          },
        },
      };
      const result = await kerastaseCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });

    // GET API for kerastase
    app.get('/kerastase', async (req, res) => {
      const cursor = kerastaseCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    //POST API for hair Tools
    app.post('/hairTools', async (req, res) => {
      const { Name, Price, BrandName, Description, image } = req.body;
      const hairTool = {
        name: Name,
        brand: BrandName,
        description: Description,
        price: Price,
        picture: image,
      };

      const result = await hairToolsCollection.insertOne(hairTool);
      res.send(result);
    });

    // GET API for hair Tools
    app.get('/hairTools', async (req, res) => {
      const cursor = hairToolsCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    //POST API for services
    app.post('/services', async (req, res) => {
      const {
        service,
        category,
        categoryName,
        ageLimit,
        categoryTime,
        categoryValue,
      } = req.body;
      const filter = { service };
      const options = { upsert: true };
      const updateDoc = {
        $push: {
          data: {
            service,
            category,
            categoryName,
            ageLimit,
            categoryTime,
            categoryValue,
          },
        },
      };
      const result = await servicesCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });

    // GET API for services
    app.get('/services', async (req, res) => {
      const cursor = servicesCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hair and Spa server is running!');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
