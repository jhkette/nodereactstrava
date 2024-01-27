// https://www.sitepoint.com/delay-sleep-pause-wait/


function sleep() {
    return new Promise(resolve => setTimeout(resolve, (15 * 60 * 1000) + 3000));
}

module.exports = {sleep}