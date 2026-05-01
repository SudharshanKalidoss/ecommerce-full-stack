const { models } = require("../config/db");

const ContactDetail = models.contactDetail;

exports.fetchContactDetails = async (fieldsToBeIncluded = ["id", "primaryContact", "primaryEmail", "socialProfiles", "logoFile", "logo" , "address"]) => {
    return await ContactDetail.findOne({
        attributes: fieldsToBeIncluded,
    });
}

exports.createOrUpdateContactDetails = async (data, options = {}) => {
    const existing = await ContactDetail.findOne();
    if (existing) {
        return await existing.update(data, options);
    } else {
        return await ContactDetail.create(data, options);
    }
}