const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mojnu:ineedjob@cluster0.jvd1e.mongodb.net/jibonerHisab?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});

client.connect(err => {
  //insert my day
  const dailyWorksCollection = client.db("jibonerHisab").collection("dailyUpdate");
  app.post("/addMyDay", (req, res) => {
    const works = req.body;
    dailyWorksCollection.insertOne(works)
    .then(result => {
      console.log('work update successfully');
    })
  })
  //read my day
  app.get('/myDays', (req, res) => {
    dailyWorksCollection.find({}).limit(5)
    .toArray( (err, documents) => {
      res.send(documents);
    })
  })
  //update data
  app.get('/myDay/:id', (req, res) => {
    dailyWorksCollection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, documents) => {
      res.send(documents[0]);
    })
  })
  app.patch('/update/:id', (req, res) => {
        dailyWorksCollection.updateOne({_id: ObjectId(req.params.id)}, 
        {
            $set: {date: req.body.date, namaj: req.body.namaj, priorityWork1: req.body.priorityWork1, priorityWork2: req.body.priorityWork2, priorityWork3: req.body.priorityWork3, lessImportantWork1: req.body.lessImportantWork1, lessImportantWork2: req.body.lessImportantWork2, workDone: req.body.workDone, valoKaj: req.body.valoKaj, ayat: req.body.ayat, expenditure: req.body.expenditure, hadith: req.body.hadith, motivation: req.body.motivation, idea: req.body.idea, gonah: req.body.gonah}
        })
        .then(result =>{
            //console.log(result);
            res.send(result.modifiedCount > 0);
        })
    })
});
app.listen(3000);