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
        PROFILE_PICTURE_REQUIRED: "Profile picture required"
    },
    BRAND: {
        ALREADY_EXISTS: "Brand already exists",
        NOT_FOUND: "Brand not found",
        SLUG_ALREADY_EXISTS: "Brand slug already exists"
    },
    CATEGORY: {
        ALREADY_EXISTS: "Category already exists",
        NOT_FOUND: "Category not found",
        SLUG_ALREADY_EXISTS: "Category slug already exists"
    },
    HSN: {
        ALREADY_EXISTS: "Hsn already exists",
        NOT_FOUND: "Hsn not found",
    },
    ATTRIBUTES: {
        ALREADY_EXISTS: "Attributes already exists",
        NOT_FOUND: "Attributes not found",
        SAME_DRAFT_STATUS: "Attributes already have same draft status"
    },
    ATTRIBUTE_VALUES: {
        ALREADY_EXISTS: "Attribute values already exists",
        NOT_FOUND: "Attributes not found",
        SAME_DRAFT_STATUS: "Attributes already have same draft status"
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
    VARIANTS: {
        SKU_EXISTS: "sku already exists",
        HSN_NOT_FOUND: "Please provide a valid hsn",
        SAME_DRAFT_STATUS: "Attributes already have same draft status",
        BRAND_NOT_FOUND: "Please provide a valid brand",
        ADD_BRAND_TO_CHANGE_STATUS: "Please add a valid brand to change its status",
        NOT_FOUND: "Variant not found",
        ALREADY_EXISTS: "Variant already exists"
    },
    DISCOUNTS: {
        NOT_FOUND: "Discount not found",
        CATEGORIES_CANNOT_BE_ADDED: "Categories cannot be added",
        PRODUCTS_CANNOT_BE_ADDED: "Products cannot be added",
        BRANDS_CANNOT_BE_ADDED: "Brands cannot be added",
        ALREADY_EXISTS: "Discount already exists",
        USERS_CANNOT_BE_ADDED: "Users cannot be added",
        ORDER_BASED_DISCOUNT_CANNOT_HAVE_FALT_RATE: "Order based discoutn canot have flat rate"
    },
    ADDRESS: {
        NOT_FOUND: "Address not found",
        ADDRESS_CANNOT_BE_ADDED: "Address cannot be added",
        PROVIDE_A_VALID_LOCATION: "Please povide a valud location"
    },
    ORDERS: {
        USER_NOT_FOUND: "User not found",
        NOT_FOUND: "Order not found",
        PAYMENT_METHODS_NOT_AVAILABLE: "Payment method  currently not available",
        ADDRESS_NOT_FOUND: "Please povide a valid address",
        CURRENCY_NOT_FOUND: "Please choose a valid currency",
        FEW_PRODUCTS_ARE_INVALID: "Few Products are invalid",
        FEW_PRODUCTS_STOCKS_ARE_INSUFFICIENT: "Few products stocks are insufficient",
        DISCOUNT_NOT_FOUND: "Discount not found",
        DISCOUNT_ALREADY_USED: "Discounts already used",
        VARIANT_NOT_FOUND: "Variatns not found",
        MIN_SPEND_NOT_REACHED: "Minimum spend not reached this order",
        CURRENTLY_NOT_SHIPPING_TO_THIS_COUNTRY: "Currently not shipping to this country",
        VALID_STATUS_CODE: "Please provide a valid status to update",
        PAYMENT_STATUS_CANNOT_BE_CHANGED: "Payment status cannot be changed for this order",
        TRACKING_OR_SHIPPING_VIA_NOT_ALLOWED: "Tracking number or shipping status can only be added after order dispatched",
        PAID_STATUS_CANNOT_BE_CHANGED: "Paid status cannot be changed",
        PAID_STATUS_CANNOT_BE_CHANGED_IF_NOT_CASH_ON_DELIVERY: "Payment status cannot be changed of it is not cash on delivery",
    },

    COUNTRIES: {
        NOT_FOUND: "Countries not found",
    },
    STATES: {
        NOT_FOUND: "States not found",
    },
    REVIEWS: {
        NOT_FOUND: "Reviews not found",
    },
    EMAIL_TEMPLATES: {
        NOT_FOUND: "Email template not found",
    },
    SHIPPING: {
        NOT_FOUND: "Shipping not found",
        PLEASE_ENTER_A_COUNTRY_ID: "Please provide a country id"
    },
    WISHLIST: {
        NOT_FOUND: "Wish list not found",
    },
    CART: {
        NOT_FOUND: "Cart not found",
    },
    CURRIENCY: {
        NOT_FOUND: "Curriency not found",
        ALREADY_EXISTS: "Curriency alreacy exists",
        DEFAULT_CURRENCY_CANNOT_BE_DRAFTED: "Default currency cannot be defaulted"
    },
    PAYMENT_METHODS: {
        NOT_FOUND: "Cart not found",
    },
    PAGES: {
        NOT_FOUND: "Cart not found",
        SLUG_ALREADY_EXISTS: "Page already exists"
    },
    STORE_ADDRESSES: {
        NOT_FOUND: "Store address not found",
        SLUG_ALREADY_EXISTS: "Page already exists",
        DEFAULT_CANNOT_BE_DELETED: "Default Address cannot be deleted"
    },
    BANNERS: {
        NOT_FOUND: "Banners not found",

    },
    SLIDERS: {
        NOT_FOUND: "Banners not found",

    },
    ZONE: {
        NOT_FOUND: "Zone not found",

    },
    PRODUCT_IMAGES: {
        NOT_FOUND: "Image not found",

    },
    CARRIER: {
        NOT_FOUND: "Carrier not found",
        ALREADY_EXISTS: "Carrier already found",

    },
    CARRIER_RANGE: {
        NOT_FOUND: "Carrier range not found",
        ALREADY_EXISTS: "Carrier range already found",
        VALID_TYPE: "Please enter a valid type",

    },
    CARRIER_RANGE_PRICE: {
        NOT_FOUND: "Carrier range price not found",
        ALREADY_EXISTS: "Carrier range price already found",

    },

    TOP_BRANDS: {
        NOT_FOUND: "Top Brands not found",
        ALREADY_EXISTS: "Top Brand already found",

    },
    TOP_CATEGORIES: {
        NOT_FOUND: "Top categories not found",
        ALREADY_EXISTS: "Top categories already found",

    },
    SITE_SETTINGS: {
        NOT_FOUND: "Site settings not found",

    },
    SITE_SETTINGS: {
        NOT_FOUND: "Site settings not found",

    },
    EMAIL_SETTINGS: {
        VALID_TYPE: "Please choose a valid type (SMTP , TLS , SSL)"
    },
    MENUS: {
        ALREADY_EXISTS: "Menu already exists",
        NOT_FOUND: "Menu not found"
    }


}

module.exports = { ERROR_MESSAGES }