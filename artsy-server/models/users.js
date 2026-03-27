// this is where we handle all raw data relating to users from db

const mysql2 = require("mysql2");
const dbconfig = require("../utils/dbconfig");
const pool = mysql2.createPool(dbconfig).promise();

class usersModel {
  async createUser(
    userName,
    avatarUrl,
    email,
    firebaseUid,
    birthday,
    location,
    bio,
    gender,
  ) {
    try {
      const createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");
      const QUERY = `INSERT INTO users (userName, avatarUrl, email, firebaseUid, birthday, location, bio, gender, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      //passwordHash → firebaseUid ↑

      const [result] = await pool.query(QUERY, [
        userName,
        avatarUrl || null,
        email,
        firebaseUid,
        birthday || null,
        location || null,
        bio || null,
        gender || null,
        createdAt,
      ]);
      return result.insertId;
    } catch (err) {
      console.error("Register Insert Error: ", err);
      throw err;
    }
  }
}

module.exports = new usersModel();
