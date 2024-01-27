function calcFtp (obj) {

  return Math.max( (Number(obj["720"]) * .92), (Number(obj["1200"]) * .9))
  
}

module.exports = {calcFtp}