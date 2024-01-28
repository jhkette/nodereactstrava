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

  cyclingMaxHr: {
    type: Number,
  },
  runningMaxHr: {
    type: Number,
  },
  cyclingFTP: {
    type: Number,
  },
  bikeHrZones: {
    zone1: {
      type: [Number],
    },
    zone2: {
      type: [Number],
    },
    zone3: {
      type: [Number],
    },
    zone4: {
      type: [Number],
    },
    zone5: {
      type: [Number],
    },
  },

  runHrZones: {
    zone1: {
      type: [Number],
    },
    zone2: {
      type: [Number],
    },
    zone3: {
      type: [Number],
    },
    zone4: {
      type: [Number],
    },
    zone5: {
      type: [Number],
    },
  },

  cyclingpbs: {
    15: {
      type: Number,
    },
    30: {
      type: Number,
    },
    60: {
      type: Number,
    },
    90: {
      type: Number,
    },
    120: {
      type: Number,
    },
    150: {
      type: Number,
    },
    180: {
      type: Number,
    },
    210: {
      type: Number,
    },
    240: {
      type: Number,
    },
    270: {
      type: Number,
    },
    300: {
      type: Number,
    },
    330: {
      type: Number,
    },
    360: {
      type: Number,
    },
    390: {
      type: Number,
    },
    410: {
      type: Number,
    },
    440: {
      type: Number,
    },
    480: {
      type: Number,
    },
    600: {
      type: Number,
    },
    720: {
      type: Number,
    },
    900: {
      type: Number,
    },
    1200: {
      type: Number,
    },
  },

  runningpbs: {
    400: {
      type: Number,
    },
    800: {
      type: Number,
    },
    1000: {
      type: Number,
    },
    3000: {
      type: Number,
    },
    5000: {
      type: Number,
    },
    10000: {
      type: Number,
    },
  },
});

module.exports = mongoose.model("UserActivities", userActivitiesSchema);
