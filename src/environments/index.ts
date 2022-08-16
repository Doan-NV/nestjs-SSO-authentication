import * as dotenv from 'dotenv';
dotenv.config();

const NEED_TO_CONFIGURED = 'NEED TO CONFIGURED';

// environment
const NODE_ENV: string = process.env.NODE_ENV || 'dev';

// application
const SERVER_PORT: number = +process.env.SERVER_PORT || 3000;

// mongo
const MONGO_URL: string = process.env.MONGO_URL || NEED_TO_CONFIGURED;

// redis
const REDIS_PORT: number = +process.env.REDIS_PORT;
const REDIS_HOST: string = process.env.REDIS_HOST || NEED_TO_CONFIGURED;


// email
const SMTP_USER: string = process.env.SMTP_USER || NEED_TO_CONFIGURED;
const SMTP_PASSWORD: string = process.env.SMTP_PASSWORD || NEED_TO_CONFIGURED;
const SMTP_PORT: number = +process.env.SMTP_PORT;
const SMTP_SERVER: string = process.env.SMTP_SERVER || NEED_TO_CONFIGURED;

//twilio
const TWILIO_ACCOUNT_SID: string = process.env.TWILIO_ACCOUNT_SID || NEED_TO_CONFIGURED;
const TWILIO_AUTH_TOKEN: string = process.env.TWILIO_AUTH_TOKEN || NEED_TO_CONFIGURED;
const TWILIO_PHONE_NUMBER: string = process.env.TWILIO_PHONE_NUMBER || NEED_TO_CONFIGURED;

//facebook
const FACEBOOK_ID: string = process.env.FACEBOOK_ID || NEED_TO_CONFIGURED;



export {
  NODE_ENV,
  SERVER_PORT,
  MONGO_URL,
  SMTP_USER,
  SMTP_PASSWORD,
  SMTP_PORT,
  SMTP_SERVER,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  FACEBOOK_ID,
  REDIS_PORT, 
  REDIS_HOST
};
