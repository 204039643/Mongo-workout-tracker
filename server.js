//JS variables
const express = require('express')
const mongoose = require('mongoose')
const logger = require('morgan')
const db = require('./models')
const PORT = process.env.PORT || 3002
const app = express()
const path = require('path')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('./public'))
app.use(logger('dev'))

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/workout', {
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
    path.join(__dirname, './public/exercise.html')
  )
})

app.get('/stats', (req, res) => {
  res.sendFile(
    path.join(__dirname, './public/stats.html')
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

//Aggregate route for get exercises
app.get('/api/workouts', (req, res) => {
  db.Workout.aggregate([
    {
      $addFields: {
        totalDuration: {
          $sum: '$exercises.duration',
        },
      },
    },
  ])
    .then((dbWorkouts) => {
      res.json(dbWorkouts);
    })
    .catch((err) => {
      res.json(err);
    });
});

//Add exercise
app.put('/api/workouts/:id', (req, res) => {
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
  db.Workout.create(req.body).then(saved => {
    res.send(saved)
  })
})

//Get workouts in range
app.get('/api/workouts/range', (req, res) => {
  db.Workout.aggregate([
    {
      $addFields: {
        totalDuration: {
          $sum: '$exercises.duration',
        },
      },
    },
  ]).sort({ _id: -1 }).limit(7)
    .then(dbWorkout => {
      res.json(dbWorkout)
    })
    .catch(err => {
      res.json(err)
    })
})