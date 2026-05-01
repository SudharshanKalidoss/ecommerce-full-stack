const { tryCatch } = require("../middlewares/try-catch");
const { formatResponse } = require("../utils/format-response");
const { STATUS, RESPONSE_MESSAGES } = require("../utils/status");
const { STATUS_CODES } = require("../utils/status-codes");
const contactService = require("../service/contact");

const path = require('path');
const fs = require('fs/promises');
const { generateProductImages } = require("../utils/image-processor");
const { sequelize } = require("../config/db");

exports.getContactDetails = tryCatch(async (req, res) => {
    const contactDetails = await contactService.fetchContactDetails();
    return res.status(STATUS_CODES.OK.code).send(formatResponse(STATUS.SUCCESS, "Contact details fetched successfully", contactDetails));
});

exports.createOrUpdateContactDetails = tryCatch(async (req, res) => {
    const body = req.body;
    const logo = req.file;
    

    const updateData = {};
    if (body.primaryContact !== undefined) updateData.primaryContact = body.primaryContact;
    if (body.primaryEmail !== undefined) updateData.primaryEmail = body.primaryEmail;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.socialProfiles !== undefined) {
        try {
            updateData.socialProfiles = typeof body.socialProfiles === 'string' ? JSON.parse(body.socialProfiles) : body.socialProfiles;
        } catch (err) {
            return res.status(STATUS_CODES.BAD_REQUEST.code).send(formatResponse(STATUS.FAILED, "Invalid social profiles JSON"));
        }
    }

    const transaction = await sequelize.transaction();

    try {
        if (logo) {
            const contactDirectory = path.join('uploads', 'contact');
            await fs.mkdir(contactDirectory, { recursive: true });
            await fs.mkdir(`${contactDirectory}/thumbnail`, { recursive: true });

            const imagePath = `${logo.destination}/${logo.filename}`;
            const fileNameWithoutExtension = path.basename(logo.filename, path.extname(logo.filename));
            const fileName = `${fileNameWithoutExtension}-logo`;
            const file = `${fileNameWithoutExtension}-logo.webp`;

            await generateProductImages(imagePath, contactDirectory, fileName);

            updateData.logoFile = file;
        }

        const updatedContact = await contactService.createOrUpdateContactDetails(updateData, { transaction });

        await transaction.commit();

        const contactDetails = await contactService.fetchContactDetails();
        return res.status(STATUS_CODES.OK.code).send(formatResponse(STATUS.SUCCESS, "Contact details saved successfully", contactDetails));
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
});