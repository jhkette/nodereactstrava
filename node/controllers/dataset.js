const RunDataSet = require("../models/RunDataSets");
const RideDataSet = require("../models/RideDataSet");


exports.dataSet = async (req, res) => {
  const marathon = await RunDataSet.find({ name: "marathon" });
  const half = await RunDataSet.find({ name: "half marathon" });
  const alpe = await RideDataSet.find({ name: "Alpe du zwift" });
  const boxHill = await RideDataSet.find({ name: "Box Hill" });

  res.send({ marathon, half, alpe, boxHill });
};
