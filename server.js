//connection with express framework, bodyparser and mongodb
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectID

//setting the authentication to the database
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://adm000:adm000@cluster0.ggpsq.mongodb.net/MotorBikeDealer?retryWrites=true&w=majority";

MongoClient.connect(uri, (err, client) => {
    if (err) return console.log(err)
    db = client.db('MotorBikeDealer')

    app.listen(3000, () => {
        console.log('Server running on port 3000')
    })
})
//CRUD functions
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/', (req, res) => {
    var cursor = db.collection('data').find()
})

app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', { data: results })

    })
})

app.post('/show', (req, res) => {
    db.collection('data').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('Save in the database')
        res.redirect('/show')
    })
})

app.route('/edit/:id')
.get((req, res) => {
  var id = req.params.id

  db.collection('data').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('edit.ejs', { data: result })
  })
})
.post((req, res) => {
  var id = req.params.id
  var model = req.body.model
  var brand = req.body.brand
  var year = req.body.year
  var engineSize = req.body.engineSize
  var availability = req.body.availability
  
  db.collection('data').updateOne({_id: ObjectId(id)}, {
    $set: {
      model: model,
      brand: brand,
      year: year,
      engineSize: engineSize,
      availability: availability,
    }
  }, (err, result) => {
    if (err) return res.send(err)
    res.redirect('/show')
    console.log('Updated Database')
  })
})

app.route('/delete/:id')
.get((req, res) => {
  var id = req.params.id

  db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    console.log('Deleted from the database!')
    res.redirect('/show')
  })
})



