import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === "production"; // it'll will be set false in production

//connection conf
const connectionString = `postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_DATABASE}`;

const pool = new Pool({
  connectionString: connectionString,
});

//DEPLOYEMENT VARIABLES
//const connectionString = `postgresql://${process.env.DATABASE_USER_DEPLOY}:${process.env.DATABASE_PASSWORD_DEPLOY}@${process.env.DATABASE_HOST_DEPLOY}:${process.env.DATABASE_PORT_DEPLOY}/${process.env.DATABASE_DATABASE_DEPLOY}`;

export default pool;
