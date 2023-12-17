const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userActivitiesSchema = mongoose.Schema({
    athlete_id:{
        required: true,
        type: Number
    },
    
    activities:{
        type: [Object]
    }
})

module.exports = mongoose.model('userActivities', userActivitiesSchema)