const _ = require("lodash");

// https://sunjetliu.medium.com/algorithm-practice-find-averages-of-subarrays-db9108c0d55e
function findAverage(K, arr) {
  // if K is bigger than array length return null
  if (K > arr.length) {
    return null;
  }
  // store result in array
  const result = [];
  let windowSum = 0.0,
    windowStart = 0;
  for (let windowEnd = 0; windowEnd < arr.length; windowEnd++) {
    windowSum += arr[windowEnd]; // add the next element
    if (windowEnd >= K - 1) { // if windowend = k-1 ie the length we are looking for
      result.push(windowSum / K);
      windowSum -= arr[windowStart];
      windowStart += 1;
    }
  }
  return result;
}

/**
 * quicksort function  sorts a list using
 * quick sort algorithm
 * @param items[]
 * @returns []
 */

function quickSort(items) {
  // terminate execution and return array if empty
  // or containing one elemrnt
  if (items.length <= 1) return items;

  // set the pivot to the last item on the list
  const pivot = items[items.length - 1];

  // create temporary contaners
  const leftItems = [];
  const rightItems = [];

  // loop through the array to put the pivot in its sorted position
  for (const item of items.slice(0, items.length - 1)) {
    if (item > pivot) {
      rightItems.push(item);
    } else {
      leftItems.push(item);
    }
  }

  // repeat same processes above on both partition
  // until every item is at its sorted position
  return [...quickSort(leftItems), pivot, ...quickSort(rightItems)];
}

module.exports = { findAverage, quickSort };
