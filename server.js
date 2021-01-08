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

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname, "../Mongo-workout-tracker/public/exercise.html"));
});

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname, "../Mongo-workout-tracker/public/stats.html"));
});

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

app.put('/api/workouts/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  const exercise = await Platform.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true
    }
  )

  res.send(exercise)
})

//Create new workout
app.post('/api/workouts', ({ body }, res) => {
  const exercise = body
  db.Workout.create(exercise, (error, saved) => {
    if (error) {
      console.log(error)
    } else {
      res.send(saved)
    }
  })
})

//Get workouts in range
app.get('/api/workouts', (req, res) => {
  db.Workout.find({})
    .then(dbWorkout => {
      res.json(dbWorkout)
    })
    .catch(err => {
      res.json(err)
    })
})

