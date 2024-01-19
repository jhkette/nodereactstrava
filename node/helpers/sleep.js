// https://www.sitepoint.com/delay-sleep-pause-wait/


// async function Tutor() {
//     document.write('Hello Toturix');
//     for (let i = 1; i <20 ; i++) {        
//        await sleep(3000);
//        document.write( i +" "+"Welcome to tutorix" + " " + "</br>");
//     }
//  }

function sleep() {
    return new Promise(resolve => setTimeout(resolve, (15 * 60 * 1000) + 3000));
}

module.exports = {sleep}