import {config} from 'dotenv';

//use either the NODE_ENV.local or development.local file as the base
config({path: `.env.${process.env.NODE_ENV || 'development'}.local`}); 

//export the PORT and NODE_ENV environment variables to be imported in file that use them
export const {PORT, NODE_ENV} = process.env;