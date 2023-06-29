const APP_CONSTANTS = {
  pagination: {
    DEFAULT_PAGE_NO: 1,
    DEFAULT_PAGE_SIZE: 20,
  },
  guestUrls: [],
  guestAndNonGuestUrls: [],
  uploadUrls: [],
  userType: [],
  accessTokenExpiry: `${process.env.ACCESS_TOKEN_EXPIRY}d`,
  refreshTokenExpiry: `${process.env.REFRESH_TOKEN_EXPIRY}d`,
  refreshTokenExpiryInMs: Number(process.env.REFRESH_TOKEN_EXPIRY) * 24 * 60 * 60 * 1000,
  enableOtpBasedLogin: process.env.ENABLE_OTP_BASED_LOGIN,
  defaultOtpExpiry: process.env.DEFAULT_OTP_EXPIRY,
};

export default APP_CONSTANTS;
