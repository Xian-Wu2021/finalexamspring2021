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
    console.log("book");
    console.log(params);

    let sql_1 = `INSERT INTO book (`;
    let sql_2 = `VALUES (`;
    let i = 1;
    let newParams = [];
    // for (let i = 1; i < params.length + 1; i++) {
    // }
    if (params[0] !== undefined && params[0] !== "" && params[0] !== "Null" ) {
        sql_1 += `book_id,`;
        sql_2 += `$${i},`;
        newParams.push(params[i - 1]);
        i++;
    }
    if (params[1] !== undefined && params[1] !== "" && params[1] !== "Null" ) {
        sql_1 += `title,`;
        sql_2 += `$${i},`;
        newParams.push(params[i - 1]);
        i++;
    }
    if (params[2] !== undefined && params[2] !== "" && params[2] !== "Null" ) {
        sql_1 += `total_pages,`;
        sql_2 += `$${i},`;
        newParams.push(params[i - 1]);
        i++;
    }
    if (params[3] !== undefined && params[3] !== "" && params[3] !== "Null" ) {
        sql_1 += `rating,`;
        sql_2 += `$${i},`;
        newParams.push(params[i - 1]);
        i++;
    }
    if (params[4] !== undefined && params[4] !== "" && params[4] !== "Null" ) {
        sql_1 += `isbn,`;
        sql_2 += `$${i},`;
        newParams.push(params[i - 1]);
        i++;
    }
    if (params[5] !== undefined && params[5] !== "" && params[5] !== "Null" ) {
        sql_1 += `published_date,`;
        sql_2 += `$${i},`;
        newParams.push(params[i - 1]);
        i++;
    }

    let sql = sql_1.substr(0, sql_1.length - 1) + `) ` + sql_2.substr(0, sql_2.length - 1) + `) `;
    console.log("sql", sql);
    console.log("newParams", newParams);
    // `INSERT INTO book (book_id, title, total_pages, rating, isbn, published_date)
    // VALUES ($1, $2, $3, $4, $5, $6)`;

    return pool.query(sql, newParams)
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