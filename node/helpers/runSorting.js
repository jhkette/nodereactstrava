

// https://www.geeksforgeeks.org/smallest-subarray-from-a-given-array-with-sum-greater-than-or-equal-to-k/

// JavaScript code to implement the above idea
 
// Function to find the Smallest Subarray with
// Sum K from an Array
function getShortestSubarray(A, X) {
    let ans = Number.MAX_VALUE; // 
    const n = A.length;
    // Array to store prefix sums
    const prefSum = new Array(n).fill(0);
    // Deque storing index of increasing order prefix sums
    const dq = [];
 
    for (let i = 0; i < n; i++) {
        prefSum[i] = A[i] + (i === 0 ? 0 : prefSum[i - 1]);
        if (prefSum[i] >= X) {
            ans = Math.min(ans, i + 1);
        }
    }
    for (let i = 0; i < n; i++) {
        // Check if the subarray ending at i has sum at least X
        while (dq.length > 0 && prefSum[i] - prefSum[dq[0]] >= X) {
            ans = Math.min(ans, i - dq[0]);
            dq.shift();
        }
 
        // Make the deque store prefix sums in increasing order
        while (dq.length > 0 && prefSum[dq[dq.length - 1]] >= prefSum[i]) {
            dq.pop();
        }
        dq.push(i);
    }
    return ans === Number.MAX_VALUE ? null : ans;
}

// let arr = [2, 1, 1, -4, 3, 1, -1, 2];
 
// let k = 5;
 
// let n = arr.length;
 
// console.log(findSubarray(arr, n, k));

function runDistance(numbers){
    // https://stackoverflow.com/questions/56857346/in-javascript-how-do-i-create-a-list-of-differences-of-array-elements-elegantly
    // slice(1) gets all but the first element. 
    // map returns a new value for each of those, and the value 
    //returned is the difference between the element and the corresponding 
    // element in A

    const distances = numbers.slice(1).map((v, i) => (v - numbers[i]).toFixed(1)).map(Number);
    console.log(distances)
    return distances
  }


module.exports = {runDistance, getShortestSubarray}