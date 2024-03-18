// https://www.sitepoint.com/delay-sleep-pause-wait/

// (15 * 60 * 1000) + 3000) needed value

function sleep() {
    console.log("sleep running")
    return new Promise(resolve => setTimeout(resolve, (15 * 60 * 1000) + 3000));
}

module.exports = {sleep}