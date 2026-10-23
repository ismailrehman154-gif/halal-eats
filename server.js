require('dotenv').config()

const express = require('express') // connecting express to the file
const { MongoClient, ObjectId } = require('mongodb')  //connecting the mongodb 
const app = express() // creating the app, the whole server is this
//tell express that the pages being used are actually ejs files
app.set('view engine', 'ejs')

//let express read the data that is recieved by forms in the ejs, without this the req.body return empty
app.use(express.urlencoded({ extended: true}))
//second translator for express, this one read json from fetch calls, unlike the other one reading from forms, this one is not for POST its for PUT and DELETE
app.use(express.json()) // without this, if you tru updating then the body would return undefined as it couldnt read the request from fetch and did not respodn properly
//let express hand out everytinh to the client side from the public folder, like styles and images and stuff
app.use(express.static('public'))
//grabbing the connection string for the env file that hides it
const connectionString = process.env.MONGO_URI

//connect to mongo using the string
MongoClient.connect(connectionString)
    .then(client => {
        //if this logs, then the connection is succesful
        // console.log('Connected to the data base')

        //this connects the db inside the cluster (room inside house)
        const db = client.db('Halal-Eats')

        // this connects the box in the room (collection)
        const spotsCollection = db.collection('halal-eats')


        // req is everytihng the browser sends to me, and res is everything i respond with
        app.get('/', (req, res) => { //when you visit this url, the starting one, itll run the function within
            //grab every item in the box and turn it into an array
            spotsCollection
            .find()
            .toArray()
            .then(results => {
                //build the page and it the spots(items), inside the page they are called 'spots'
                res.render('index.ejs', {spots: results})
            })
            .catch(error => console.error(error))
        })

        //when the form send a new spot that was inputted into /spots (the url) then run this,
        app.post('/spots', (req, res) => {
            //save everything the form sent (req.body) as one item in the box
            spotsCollection
            .insertOne(req.body)
            .then(() => {
                //after it saves and adds that item to the box (document to collection) send em back to homepage
                res.redirect('/')
            }) 
            .catch(error => console.error(error))
        })
        // adding my update/PUT handler

        app.put('/spots', (req, res) => {
            // find the one spot with its specific id, and change its rating only
            // console.log('body:', req.body)
            spotsCollection
            .findOneAndUpdate(
                { _id: new ObjectId(req.body.id) },
                //using $set, which is mongo exclusive updates only the thing being specified, and leaves everythin else alone
                { $set: { rating: req.body.rating }}
            )
            .then(() => {
                // give the browser a response with json so it knows the update went through
                res.json('Rating updated')
            })
            .catch(error => console.error(error))
        })

        //when the browser sends a delete request to /spots (the url) run this handler
        app.delete('/spots', (req, res) => {
            //find the one spot with this id and delete it, the filter given is just the id selected
            // console.log('delete body', req.body)
        spotsCollection
            .findOneAndDelete({ _id: new ObjectId(req.body.id) })
            .then(() => {
                
                res.json('SPot Deleted')
        })
        .catch(error => console .error(error))
        })

        app.listen(3000, () => { //just giving the server a port to be hosted on, itll print a message in the terminal console so i know its working
            console.log('Listening on 3000')
        })
    })

    //if the connection does not work then print an error
    .catch(error => console.error(error))





