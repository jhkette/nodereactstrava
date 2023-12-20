// https://sunjetliu.medium.com/algorithm-practice-find-averages-of-subarrays-db9108c0d55e

function find_averages_of_subarrays(K, arr) {
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
// https://reintech.io/blog/mastering-heap-sort-javascript
  function heapify(arr, n, i) {
    var largest = i;
    var left = 2 * i + 1;
    var right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    
    if (largest != i) {
        var swap = arr[i];
        arr[i] = arr[largest];
        arr[largest] = swap;
    
        heapify(arr, n, largest);
    }
}

// https://reintech.io/blog/mastering-heap-sort-javascript

function heapSort(arr) {
    var n = arr.length;
    
    for (var i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i);
    for (var i = n - 1; i > 0; i--) {
        var temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
    
        heapify(arr, i, 0);
    }
}



  modules.exports = {find_averages_of_subarrays, heapify, heapSort}