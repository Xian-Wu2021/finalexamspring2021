// Add packages
require("dotenv").config();
// Add database package and connection string
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const getTotalRecords = () => {
    sql = "SELECT COUNT(*) FROM book";
    return pool.query(sql)
        .then(result => {
            return {
                msg: "success",
                totRecords: result.rows[0].count
            }
        })
        .catch(err => {
            return {
                msg: `Error: ${err.message}`
            }
        });
};

const insertBook = (book) => {
    // Will accept either a product array or product object
    if (book instanceof Array) {
        params = book;
    } else {
        params = Object.values(book);
    };
    console.log(params);
// ?? dynamic sql ?
    const sql = `INSERT INTO book (book_id, title, total_pages, rating, isbn, published_date)
                 VALUES ($1, $2, $3, $4, $5, $6)`;

    return pool.query(sql, params)
        .then(res => {
            return {
                trans: "success", 
                msg: `Book id ${params[0]} successfully inserted`
            };
        })
        .catch(err => {
            return {
                trans: "fail", 
                msg: `Book ID: ${params[0]} - Error: ${err.message}`
                // Error on insert of customer id ${params[0]}.  ${err.message}`
            };
        });
};

module.exports.getTotalRecords = getTotalRecords;
module.exports.insertBook = insertBook;