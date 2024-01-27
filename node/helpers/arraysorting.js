const _ = require("lodash");
const {durations, distances } = require ("./values")
// https://sunjetliu.medium.com/algorithm-practice-find-averages-of-subarrays-db9108c0d55e
function findAverage(K, arr) {
  if (K > arr.length){
    return null
  }
  const result = [];
  let windowSum = 0.0,
      windowStart = 0;
  for (let windowEnd = 0; windowEnd < arr.length; windowEnd++) {
    windowSum += arr[windowEnd]; // add the next element
    if (windowEnd >= K - 1) {
      result.push(windowSum / K); 
      windowSum -= arr[windowStart]; 
      windowStart += 1; 
    }
  }
  return result;
}

function largest(arr) {
  return _.max( arr );
}

// function quickSort(items) {
//   // terminate execution and return array if empty
//   // or containing one elemrnt
//   if (items.length <= 1) return items;

//   // set the pivot to the last item on the list
//   const pivot = items[items.length - 1];

//   // create temporary contaners
//   const leftItems = [];
//   const rightItems = [];

//   // loop through the array to put the pivot in its sorted position
//   for (const item of items.slice(0, items.length - 1)) {
//     if (item > pivot) {
//       rightItems.push(item);
//     } else {
//       leftItems.push(item);
//     }
//   }

//   // repeat same processes above on both partition
//   // until every item is at its sorted position
//   return [...quickSort(leftItems), pivot, ...quickSort(rightItems)];
// }

function listPerformances(performances) {
  const bestNums = [15, 60, 300, 600, 1200]
  const topFivePerformances = bestNums.reduce((acc,curr)=> (acc[curr]=null,acc),{});
  for(num of bestNums){
  let sortedPerformances = _.orderBy(
    performances,
    ["pbs"][num],
    ["desc"]
  );

  topFivePerformances[num]=sortedPerformances.slice(0,5)
  }
  return topFivePerformances
}


function calcMaxHr(performances, activityType){
  let hrlist = performances
  // if(activityType=="ride"){
  //   hrList = performances.filter(performance => performance["VirtualRide"] || performance["Ride"]  );
  // }else{

  //   hrList = performances.filter(performance => performance["Run"]);
  // }

  const hrNumbers =  hrlist.map((activity) => activity["max_heartrate"])
  const {mean, standardDeviation} = getStandardDeviation(hrNumbers)
  console.log(mean, standardDeviation)
  console.log(hrNumbers)
  let finalHr;
  for(hr of hrNumbers){
    if(hr < (mean + (3 * standardDeviation )) && (hr >(mean -(3 * standardDeviation)) )){
      finalHr = hr
    }
  }
  return finalHr;
}

// https://medium.com/analytics-vidhya/removing-outliers-understanding-how-and-what-behind-the-magic-18a78ab480ff
// https://stackoverflow.com/questions/20811131/javascript-remove-outlier-from-an-array
function getStandardDeviation (array) {
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  const standardDeviation = Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
  return {mean, standardDeviation}
}


// function determine_outlier_thresholds_std(dataframe, col_name):
//     upper_boundary = dataframe[col_name].mean() + 3 * dataframe[col_name].std()
//     lower_boundary = dataframe[col_name].mean() - 3 * dataframe[col_name].std()
//     return lower_boundary, upper_boundary

module.exports = { findAverage, largest,  listPerformances,calcMaxHr };
