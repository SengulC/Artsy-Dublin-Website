//This is the configure file for setting up database connection
require('dotenv').config();

module.exports = {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,    
    authPlugins: {
        mysql_native_password: () => () => Buffer.from(process.env.DB_PASSWORD + '\0')
    }
    //***the naming now is different in events and users model, need to make them consistent
}
