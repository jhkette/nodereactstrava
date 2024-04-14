const express = require("express");
const dataController = require("../controllers/dataset")




const router = express.Router();


router.get("/datasets", dataController.dataSet);


router.get("/postdatasets", dataController.addData);

module.exports = router;
