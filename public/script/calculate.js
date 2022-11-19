var taxes = {
    "AB": 0.05,
    "BC": 0.05,
    "MB": 0.05,
    "NB": 0.15,
    "NL": 0.15,
    "NS": 0.15,
    "ON": 0.13,
    "PE": 0.15,
    "QC": 0.05,
    "SK": 0.05

}
function findTax(province) {
    console.log(taxes.province)
    return taxes.province
}

module.exports = { findTax }