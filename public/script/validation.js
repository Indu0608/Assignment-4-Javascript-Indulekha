var phoneRegex = /^[0-9]{3}\-?[0-9]{3}\-?[0-9]{4}$/;
var emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

function validate1item(items) {
    var total = 0;
    for (i of items) {
        if (!((parseInt(i)) || parseInt(i) == 0)) {
            throw new Error('Enter a valid quantity');
        } else {
            total += parseInt(i);
        }
    }
    if (total == 0) {
        throw new Error("Add minimum 1 item for purchase");
    }
    return true;
}
function validatePhone(phone) {
    if (!phoneRegex.test(phone)) {
        throw new Error("Enter a valid phone number XXX-XXX-XXXX format");
    }
    return true;
}
function validateEmail(email) {
    if (!emailRegex.test(email)) {
        throw new Error("Enter a valid email id.");
    }
    return true;
}
module.exports = { validate1item, validateEmail, validatePhone }
