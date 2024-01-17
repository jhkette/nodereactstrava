const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// https://stackoverflow.com/questions/42019679/object-type-in-mongoose  - best performances aobject

// https://stackoverflow.com/questions/19695058/how-to-define-object-in-array-in-mongoose-schema-correctly-with-2d-geo-index
const userActivitiesSchema = mongoose.Schema({
  athlete_id: {
    type: Number,
    required: true,
  },

  activities: {
    type: [mongoose.Mixed],
  },
 
});

module.exports = mongoose.model("UserActivities", userActivitiesSchema);
