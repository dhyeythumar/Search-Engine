const db = require('../util/database.js');
const bcrypt = require('bcrypt');

const current_datetime = new Date()

module.exports = class User {
    constructor(firstname, lastname, email, password = 'pass@123') {
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = firstname.toLowerCase().concat(lastname.toLowerCase());
        this.email = email;
        this.password = bcrypt.hashSync(password, 8);
    }

    // TODO: before adding the data into the data base first check the length.
    save() {
        return db.execute('INSERT INTO user (first_name, last_name, username, password, email_id, created, updated) VALUES (?, ?, ?, ?, ? ,?, ?)', [this.firstname, this.lastname, this.username, this.password, this.email, current_datetime, current_datetime]);
        // return db.execute('mysql_insert_id()');
    }

    updateById(id) {
        return db.execute('UPDATE user \
        SET first_name = ?, last_name = ?, username = ?, email_id = ?, updated = ? \
        WHERE user.user_id = ?', [this.firstname, this.lastname, this.username, this.email, current_datetime, id]);
    }

    static findByCred(email, password) {

        return new Promise((resolve, reject) => {

            db.execute('SELECT user_id, first_name, last_name, email_id, password FROM user WHERE user.email_id = ?', [email])
                .then(([rows, fieldData]) => {
                    if (bcrypt.compareSync(password, rows[0].password)) {
                        const user_details = {
                            id: rows[0].user_id,
                            firstname: rows[0].first_name,
                            lastname: rows[0].last_name,
                            email: rows[0].email_id
                        }
                        resolve([1, user_details]);
                    }
                    else
                        resolve([0, null]);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static insertSquery(user_id, searched_query) {
        return new Promise((resolve, reject) => {
            db.execute('SELECT frequency FROM history WHERE user_id = ? AND searched_query = ?', [user_id, searched_query])
                .then(([rows, fieldData]) => {

                    if (rows[0] != null) {
                        // data already exits in the database so only update it.
                        return db.execute('UPDATE history SET frequency = ? \
                        WHERE user_id = ? AND searched_query = ?', [rows[0].frequency + 1, user_id, searched_query]);
                        // .then(([rows, fieldData]) => {
                        //     resolve('History table updated!!');
                        // })
                        // .catch(err => {
                        //     resolve('ERR', err);
                        // });
                    }
                    else {
                        // check the link for the type [link or query] and insert into the data base accordingly.
                        if (searched_query.toLowerCase().includes('https://') || searched_query.toLowerCase().includes('http://')) {
                            return db.execute('INSERT INTO history VALUES (?, ?, ?, ?)', [user_id, searched_query, 1, 1]);
                            // .then(() => {
                            //     resolve('Link added to the history table!!');
                            // })
                            // .catch(err => {
                            //     reject(err);
                            // });
                        }
                        else {
                            return db.execute('INSERT INTO history VALUES (?, ?, ?, ?)', [user_id, searched_query, 1, 0]);
                            // .then(() => {
                            //     resolve('Query added to the history table!!');
                            // })
                            // .catch(err => {
                            //     reject(err);
                            // });
                        }
                    }
                })
                .then(([rows, fieldData]) => {
                    // console.log(rows);
                    resolve('Query/Link added/updated in the history table');
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static getlinksnquery(user_id) {
        return new Promise((resolve, reject) => {
            db.execute('SELECT searched_query FROM history WHERE user_id = ? AND is_link = 0 \
            ORDER BY frequency DESC LIMIT 8', [user_id])
                .then(([rows1, fieldData1]) => {
                    db.execute('SELECT searched_query FROM history WHERE user_id = ? AND is_link = 1 \
                    ORDER BY frequency DESC LIMIT 3', [user_id])
                        .then(([rows2, fieldData2]) => {
                            resolve([rows1, rows2]);
                        })
                        .catch(err => {
                            reject(err);
                        });
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
};