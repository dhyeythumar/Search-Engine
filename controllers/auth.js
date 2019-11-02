const User = require('../models/user.js');

exports.postSignup = (req, res, next) => {
    const firstname = req.body.firstname.trim();
    const lastname = req.body.lastname.trim();
    const email = req.body.email.trim();
    const password = req.body.password.trim();
    const page_loc = req.body.page_loc.trim();

    const user_inst = new User(firstname, lastname, email, password);
    user_inst.save()
        .then(([rows, fieldData]) => {
            const user_details = {
                id: rows.insertId,
                firstname: firstname,
                lastname: lastname,
                email: email
            }
            req.session.isLoggedIn = true;
            req.session.user = user_details;
            // res.writeHead(302, {
            //     'Location': page_loc,
            // });
            // res.status(302).redirect(page_loc);
            // res.json() 
            res.redirect(req.get('referer'));
            // res.redirect(req.get('referer'));
            // res.redirect(page_loc);
            // req.session.reload((err) => {
            //     
            // });
        })
        .catch(err => {
            req.session.isLoggedIn = false;
            req.session.user = {};
            console.log(err);
            // res.end('Error message here');
        });
};

exports.postSignin = (req, res, next) => {
    const email = req.body.email.trim();
    const password = req.body.password.trim();
    const page_loc = req.body.page_loc.trim();

    User.findByCred(email, password)
        .then(([status, user_details]) => {
            if (status == 1) {
                req.session.isLoggedIn = true;
                req.session.user = user_details;
                // res.writeHead(302, {
                //     'Location': page_loc,
                // });
                res.redirect('/');
                // res.location('/foo/bar')
                // res.end();
            }
            else {
                // give the error message for invalid login.
                req.session.isLoggedIn = false;
                req.session.user = {};
                res.redirect('/');
            }
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postEditUser = (req, res, next) => {

    const action = req.body.form_after_action.trim();
    const page_loc = req.body.page_loc.trim();
    if (action === 'Update') {
        const id = req.body.user_id;
        const firstname = req.body.firstname.trim();
        const lastname = req.body.lastname.trim();
        const email = req.body.email.trim();

        const user_inst = new User(firstname, lastname, email);
        user_inst.updateById(id)
            .then(([rows, fieldData]) => {
                const user_details = {
                    id: id,
                    firstname: firstname,
                    lastname: lastname,
                    email: email
                }
                req.session.user = user_details;
                req.session.save((err) => {
                    res.redirect(page_loc);
                });
            })
            .catch(err => {
                console.log(err);
            });
    }
    else {
        req.session.destroy((err) => {
            res.redirect(page_loc);
        });
    }
};
