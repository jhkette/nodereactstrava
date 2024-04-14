const RunDataSet = require("../models/RunDataSets");
const RideDataSet = require("../models/RideDataSet");
const fs = require("fs");
const csvParser = require("csv-parser");

exports.addData = async (req, res) => {
  const result =[
    { 'time': '1746', wkg: '5.52' },
    { 'time': '1806', wkg: '4.64' },
    { 'time': '1810', wkg: '5.43' },
    { 'time': '1860', wkg: '4.145' },
    { 'time': '1964', wkg: '4.472' },
    { 'time': '2141', wkg: '5.5' },
    { 'time': '2192', wkg: '4.76' },
    { 'time': '2236', wkg: '4.03' },
    { 'time': '2387', wkg: '3.6' },
    { 'time': '2409', wkg: '3.4' },
    { 'time': '2454', wkg: '4.01' },
    { 'time': '2527', wkg: '4.1' },
    { 'time': '1471', wkg: '7.08' },
    { 'time': '1610', wkg: '5.68' },
    { 'time': '1629', wkg: '5.16' },
    { 'time': '1752', wkg: '5.52' },
    { 'time': '1779', wkg: '4.75' },
    { 'time': '1794', wkg: '5.42' },
    { 'time': '1822', wkg: '5.475' },
    { 'time': '1851', wkg: '5.01' },
    { 'time': '1890', wkg: '4.67' },
    { 'time': '1905', wkg: '4.65' },
    { 'time': '1910', wkg: '5.16' },
    { 'time': '1930', wkg: '4.62' },
    { 'time': '1935', wkg: '5.04' },
    { 'time': '1968', wkg: '4.67' },
    { 'time': '1968', wkg: '4.24' },
    { 'time': '1969', wkg: '4.75' },
    { 'time': '1980', wkg: '4.86' },
    { 'time': '2001', wkg: '4.62' },
    { 'time': '2017', wkg: '4.49' },
    { 'time': '2022', wkg: '4.6' },
    { 'time': '2045', wkg: '4.32' },
    { 'time': '2046', wkg: '4.4' },
    { 'time': '2056', wkg: '4.03' },
    { 'time': '2061', wkg: '4.72' },
    { 'time': '2062', wkg: '3.37' },
    { 'time': '2088', wkg: '4.31' },
    { 'time': '2089', wkg: '3.86' },
    { 'time': '2091', wkg: '4' },
    { 'time': '2096', wkg: '4.29' },
    { 'time': '1599', wkg: '5.45' },
    { 'time': '1739', wkg: '5.35' },
    { 'time': '1806', wkg: '5.08' },
    { 'time': '1848', wkg: '4.87' },
    { 'time': '1877', wkg: '4.9' },
    { 'time': '1897', wkg: '4.7' },
    { 'time': '1919', wkg: '4.35' },
    { 'time': '1943', wkg: '4.38' },
    { 'time': '1947', wkg: '4.35' },
    { 'time': '1950', wkg: '4.32' },
    { 'time': '1952', wkg: '4.53' },
    { 'time': '1963', wkg: '4.28' },
    { 'time': '2015', wkg: '4.22' },
    { 'time': '2019', wkg: '4.52' },
    { 'time': '2021', wkg: '4.09' },
    { 'time': '2028', wkg: '4.464' },
    { 'time': '2032', wkg: '4.11' },
    { 'time': '2041', wkg: '4.25' },
    { 'time': '2050', wkg: '4.15' },
    { 'time': '2081', wkg: '4.45' },
    { 'time': '2106', wkg: '3.92' },
    { 'time': '2135', wkg: '3.3' },
    { 'time': '2146', wkg: '3.65' },
    { 'time': '2150', wkg: '3.8' },
    { 'time': '2190', wkg: '3.35' },
    { 'time': '2192', wkg: '3.58' },
    { 'time': '2215', wkg: '3.71' },
    { 'time': '2233', wkg: '3.6' },
    { 'time': '2246', wkg: '3.37' },
    { 'time': '2252', wkg: '3.53' },
    { 'time': '2266', wkg: '3.58' },
    { 'time': '2289', wkg: '3.28' },
    { 'time': '2302', wkg: '3.5' },
    { 'time': '2381', wkg: '3.16' },
    { 'time': '2689', wkg: '3.15' },
    { 'time': '2736', wkg: '2.81' },
    { 'time': '2759', wkg: '2.81' },
    { 'time': '2353', wkg: '3.23' },
    { 'time': '2467', wkg: '3.25' },
    { 'time': '2495', wkg: '3.15' },
    { 'time': '2503', wkg: '3.13' },
    { 'time': '2504', wkg: '3.11' },
    { 'time': '2512', wkg: '2.88' },
    { 'time': '2514', wkg: '3.13' },
    { 'time': '2520', wkg: '2.82' },
    { 'time': '2525', wkg: '2.91' }
   
  ]

  const final = result.map((data) => {
    return { x: parseFloat(data['wkg']), y: parseInt(data['time']) };
  })
  // fs.createReadStream("/Users/joseph/Desktop/stravaapp/nodenext/node/csv/scotland.csv")
  // .pipe(csvParser())
  // .on("data", (data) => {
  //   result.push(data);
  // })
  // .on("end", () => {
  //   console.log(result);
  // });

  
  // const dataCycling2 = boxdata.filter((item) => item[1] >= 290);
  // const dataCycling3 = dataCycling2.filter((item) => item[0] < 8.5);
  // const final = dataCycling3.map((item) => {
  //   return { x: item[0], y: item[1] };
  // });

  const ride = await RideDataSet.create({
    name: "scotland",
    dataset: final,
  });

  res.send({ ride });
};
exports.dataSet = async (req, res) => {
  const marathon = await RunDataSet.find({ name: "marathon" });
  const half = await RunDataSet.find({ name: "half marathon" });
  const alpe = await RideDataSet.find({ name: "Alpe du zwift" });
  const boxHill = await RideDataSet.find({ name: "Box Hill" });
  const hardknott= await RideDataSet.find({ name: "Hardknott pass" });
  const scotland= await RideDataSet.find({ name: "Bealach-na-ba" });

  res.send({ marathon, half, alpe, boxHill, hardknott, scotland });
};
