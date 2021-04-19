const express = require('express')

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("mongodb").ObjectID;
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config()

const port = process.env.PORT || 5500
const app = express()
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t3lkk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const servicesCollection = client.db("weddingPhotography").collection("services");
    const reviewsCollection = client.db("weddingPhotography").collection("reviews");
    const bookingsCollection = client.db("weddingPhotography").collection("bookings");
    const adminCollection = client.db("weddingPhotography").collection("admin");
    console.log("database Connected")

    app.post("/addService", (req, res) => {
        const newService = req.body;
        servicesCollection.insertOne(newService)
            .then(result => {
                console.log("inserted count", result)
                res.send(result.insertedCount > 0)
            })
    })

    app.get("/services", (req, res) => {
        servicesCollection.find()
            .toArray((err, items) => {
                res.send(items)
                // console.log("data from database", items)
            })
    })

    app.get("/service/:id", (req, res) => {
        servicesCollection.find({ _id: ObjectID(req.params.id) })
            .toArray((err, items) => {
                res.send(items[0]);
            })
    })

    app.delete("/delete/:id", (req, res) => {
        servicesCollection.deleteOne({ _id: ObjectID(req.params.id) })
            .then(result => {
            })
    })


    app.post("/addReview", (req, res) => {
        const newReview = req.body;
        console.log("new review", newReview);
        reviewsCollection.insertOne(newReview)
            .then(result => {
                console.log("inserted count", result)
                res.send(result.insertedCount > 0)
            })
    })
    app.get("/reviews", (req, res) => {
        reviewsCollection.find()
            .toArray((err, items) => {
                res.send(items)
                // console.log("data from database", items)
            })
    })

    app.post("/addBooking", (req, res) => {
        const newBooking = req.body;
        console.log("adding new book", newBooking)
        bookingsCollection.insertOne(newBooking)
            .then(result => {
                console.log("inserted count", result)
                res.send(result.insertedCount > 0)
            })
    })





    app.get("/bookings", (req, res) => {
        console.log(req.query.email);
        let email = req.query.email;
        adminCollection.find({ email: email })
            .toArray((err, admin) => {
                let filter = {};
                if (admin.length === 0) {
                    filter.email = email
                }
                bookingsCollection.find(filter)
                    .toArray((err, items) => {
                        res.send(items)
                    })
            })
    })




    // app.get("/bookings", (req, res) => {
    //     console.log(req.query.email);
    //     let email = req.query.email;
    //     bookingsCollection.find({ email: email })
    //         .toArray((err, items) => {
    //             res.send(items)
    //         })
    // })

    // app.get("/bookings", (req, res) => {
    //     bookingsCollection.find({})
    //         .toArray((err, items) => {
    //             res.send(items);
    //         })
    // })


    app.post("/makeAdmin", (req, res) => {
        const newAdmin = req.body;
        adminCollection.insertOne(newAdmin)
            .then(result => {
                console.log("inserted count", result)
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/isAdmins', (req, res) => {
        console.log(req.body.email);
        const email = req.body.email;

        adminCollection.find({ email: email })
            .toArray((err, admin) => {
                res.send(admin.length > 0)
                console.log(admin.length > 0)
            })
    })


});




app.listen(process.env.PORT || port)