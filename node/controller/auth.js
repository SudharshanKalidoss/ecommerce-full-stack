const { signRefreshToken, signAccessToken } = require("../utils/jwt-helper");
const { STATUS, RESPONSE_MESSAGES } = require("../utils/status");
const { USER_ROLES } = require("../utils/user-roles");
const userService = require("../service/user");
const { STATUS_CODES } = require("../utils/status-codes");
const { formatResponse } = require("../utils/format-response");
const {tryCatch} = require("../middlewares/try-catch");
const { ERROR_MESSAGES } = require("../utils/error-messages");
const bcrypt = require("bcrypt");


// Login for all Users
exports.login = tryCatch(async (req, res, next) => {
    const deviceName = req.headers['user-agent']

    // Verify the email already exist
    const { email, password } = req.body;

    const userWhere = { email: email }
    const fieldsToBeIncluded = ["id", "password", "firstName", "lastName", "role"]
    const user = await userService.fetchSingleUserByWhere(userWhere, fieldsToBeIncluded);
    if (!user || user.role == USER_ROLES.USER) {
        console.log(user , "userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
        return res.status(STATUS_CODES.NOT_FOUND.code).send(formatResponse(STATUS.FAILED, ERROR_MESSAGES.AUTH.USER_NOT_FOUND))
    }

    //comparing password given and the hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = signAccessToken({
            id: user.id,
            role: user.role,
            email: user.email,
            deviceName: deviceName
        });
        const refreshToken = signRefreshToken({
            id: user.id,
            role: user.role,
            email: user.email,
            deviceName: deviceName
        });
        const now = Math.floor(Date.now() / 1000);
        const expiresAt = now + (7 * 24 * 60 * 60);
        const { password, createdAt, updatedAt, ...restOfUser } = user.toJSON();

        const response = {
            status: STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.AUTH.LOGGEDIN,
            data: { accessToken, refreshToken, user: restOfUser },
            meta: {

                timestamp: new Date().toISOString()
            }
        }

        return res
            .status(200)
            .send(response);
    } else {
        // throw ApiError.BadRequest(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
        return res.status(STATUS_CODES.BAD_REQUEST.code).send(formatResponse(STATUS.FAILED, ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS))
    }
});




exports.userLogin = tryCatch(async (req, res) => {

    const deviceName = req.headers['user-agent']
    

    // Verify the email already exist
    const { email, password } = req.body;

    const userWhere = { email: email }
    const fieldsToBeIncluded = ["id", "password", "firstName", "lastName", "role", "email"]

    const user = await userService.fetchSingleUserByWhere(userWhere, fieldsToBeIncluded);
    if (!user || user.role != USER_ROLES.USER) {
        return res.status(STATUS_CODES.NOT_FOUND.code).send(formatResponse(STATUS.FAILED, ERROR_MESSAGES.AUTH.USER_NOT_FOUND))
    }

    //comparing password given and the hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = signAccessToken({
            id: user.id,
            role: user.role,
            email: user.email,
            deviceName: deviceName
        });
        const refreshToken = signRefreshToken({
            id: user.id,
            role: user.role,
            email: user.email,
            deviceName: deviceName
        });
        const now = Math.floor(Date.now() / 1000);
        const expiresAt = now + (7 * 24 * 60 * 60);

        const { password, createdAt, updatedAt, role, ...restOfUser } = user.toJSON();

        const response = {
            status: STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.AUTH.LOGGEDIN,
            data: { accessToken, refreshToken, user: restOfUser },
            meta: {

                timestamp: new Date().toISOString()
            }
        }

        return res
            .status(200)
            .send(response);
    } else {
        // throw ApiError.BadRequest(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
        return res.status(STATUS_CODES.BAD_REQUEST.code).send(formatResponse(STATUS.FAILED, ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS))
    }


})




exports.userRegistration = tryCatch(async (req, res) => {

    const body = req.body;
    const { email, phoneNumber } = body;
    const deviceName = req.headers['user-agent']

        console.log(req.body , "bodyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")


    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + (7 * 24 * 60 * 60);

    let registeredUser;
    const where = { email: email };


    const user = await userService.fetchSingleUserByWhere(where);

    if (user) {
        return res.status(STATUS_CODES.CONFLICT.code).send(formatResponse(STATUS.FAILED, ERROR_MESSAGES.USER.EMAIL_EXISTS))
    }

    const phoneWhere = { phoneNumber: phoneNumber };


    const userWithSamePhone = await userService.fetchSingleUserByWhere(phoneWhere);

    if (userWithSamePhone) {
        return res.status(STATUS_CODES.CONFLICT.code).send(formatResponse(STATUS.FAILED, ERROR_MESSAGES.USER.PHONE_EXISTS))
    }



    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);


    const data = {
        email: email,
        phoneNumber: phoneNumber,
        firstName: body.firstName,
        lastName: body.lastName,
        role: USER_ROLES.USER,
        password: body.password,
    }


    registeredUser = await userService.createUsers(data)


    const accessToken = signAccessToken({
        id: registeredUser.id,
        role: registeredUser.role,
        email: registeredUser.email,
        deviceName: deviceName
    });
    const refreshToken = signRefreshToken({
        id: registeredUser.id,
        role: registeredUser.role,
        email: registeredUser.email,
        deviceName: deviceName
    });



    const { password, createdAt, updatedAt, thumbnail, profilePicture, isEmailVerified, isPhoneNumberVerified, status, ...restOfUser } = registeredUser.toJSON();

    const dataToResponse = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: {
            id: registeredUser.id,
            firstName: registeredUser.firstName,
            lastName: registeredUser.lastName,
            email: registeredUser.email,
            phoneNumber: registeredUser.phoneNumber,
        }
    };


    const response = {
        status: STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.AUTH.LOGGEDIN,
        data: dataToResponse,
        meta: {

            timestamp: new Date().toISOString()
        }
    }



    return res
        .status(200)
        .send(response);


})
