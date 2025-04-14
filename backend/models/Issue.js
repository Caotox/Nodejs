const db = require("./db");

const Issue = {
  create: async (data) => {
    const [result] = await db.query(
      `INSERT INTO issues (title, description, photo, thumbnail, latitude, longitude, status, user_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'open', ?, NOW())`,
      [
        data.title,
        data.description,
        data.photo,
        data.thumbnail,
        data.latitude,
        data.longitude,
        data.user_id,
      ]
    );
    return result.insertId;
  },

  getAll: async (filters) => {
    let query = "SELECT * FROM issues WHERE 1=1";
    const params = [];

    if (filters.status) {
      query += " AND status = ?";
      params.push(filters.status);
    }

    if (filters.city) {
      query += " AND city = ?";
      params.push(filters.city);
    }

    const [rows] = await db.query(query, params);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM issues WHERE id = ?", [id]);
    return rows[0];
  },
};

module.exports = Issue;