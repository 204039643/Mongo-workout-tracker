const express = require('express')
const mongoose = require('mongoose')
const logger = require('morgan')
const connection = mongoose.connection
const db = require('./models')
const PORT = process.env.PORT || 3002
const app = express()
const path = require('path')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('./public'))
app.use(logger('dev'))

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/workout', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})

app.listen(PORT, () => {
  console.log(`app running on PORT ${PORT}`)
})

//View routes

app.get('/exercise', (req, res) => {
  res.sendFile(
    path.join(__dirname, '../Mongo-workout-tracker/public/exercise.html')
  )
})

app.get('/stats', (req, res) => {
  res.sendFile(
    path.join(__dirname, '../Mongo-workout-tracker/public/stats.html')
  )
})

//API Routes

//Get Last Workout
app.get('/api/workouts', (req, res) => {
  db.Workout.find({})
    .then(dbWorkout => {
      res.json(dbWorkout)
    })
    .catch(err => {
      res.json(err)
    })
})

//Add exercise

app.put('/api/workouts/:id', (req, res) => {
  console.log(req.body)
  db.Workout.findByIdAndUpdate(
    req.params.id,
    {
      $push: { exercises: req.body }
    },
    { new: true }
  ).then(dbWorkout => {
    res.json(dbWorkout)
  })
})

//Create workout
app.post('/api/workouts', (req, res) => {
  console.log(req.body)
  db.Workout.create(req.body).then(saved => {
    console.log('saved: ', saved)
    res.send(saved)
  })
})

//Get workouts in range
app.get('/api/workouts/range', (req, res) => {
  db.Workout.find({}).limit(7)
    .then(dbWorkout => {
      res.json(dbWorkout)
    })
    .catch(err => {
      res.json(err)
    })
})
