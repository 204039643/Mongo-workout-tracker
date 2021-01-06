const mongoose = require('mongoose')
const Schema = mongoose.Schema

const WorkoutSchema = new Schema(
  {
    date: {
      type: Date,
      default: Date.now
    },
    exercises: [
      {
        type: {
          type: String,
          trim: false,
          required: 'Type is required'
        },
        name: {
          type: String,
          trim: false,
          required: 'Name is required'
        },
        duration: {
          type: String,
          required: false
        },
        weight: {
          type: String,
          required: false
        },
        reps: {
          type: String,
          required: false
        },
        sets: {
          type: String,
          required: false
        },
        distance: {
          type: String,
          required: false
        }
      }
    ]
  },
  { toJSON: { virtuals: true } }
)

WorkoutSchema.virtual('totalDuration').get(function () {
  return this.exercises.reduce((totalDuration, exercise) => {
    return totalDuration + exercise.duration
  }, 0)
})

const Workout = mongoose.model('workout', WorkoutSchema)
module.exports = Workout
