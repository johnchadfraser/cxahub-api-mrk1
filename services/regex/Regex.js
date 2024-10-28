//Canonicalize string into URL friendly text.
function canonicalText(str) {

    return str == undefined ? '' : str.replace(/[^a-z0-9_]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();

}

module.exports = { canonicalText };