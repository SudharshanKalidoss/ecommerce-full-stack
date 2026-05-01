const ERROR_MESSAGES = {
    AUTH: {
        UNAUTHORIZED: "Please login",
        INVALID_CREDENTIALS: "Invalid username or password.",
        ACCESS_DENIED: "Access denied",
        USER_NOT_FOUND: "User not found"
    },
    USER: {
        NOT_FOUND: "User not found",
        EMAIL_EXISTS: "Email already exists",
        PROFILE_PICTURE_REQUIRED: "Profile picture required",
        PHONE_EXISTS : "Phone number already exists"
    },
   
    PRODUCTS: {
        SKU_EXISTS: "sku already exists",
        HSN_NOT_FOUND: "Please provide a valid hsn",
        SAME_DRAFT_STATUS: "Attributes already have same draft status",
        BRAND_NOT_FOUND: "Please provide a valid brand",
        ADD_BRAND_TO_CHANGE_STATUS: "Please add a valid brand to change its status",
        NOT_FOUND: "Product not found",
        SEND_PROPER_IMPORT_DATA: "Send proper data to import products"
    },
  
  



}

module.exports = { ERROR_MESSAGES }