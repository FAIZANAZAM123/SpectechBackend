const strftime = require("strftime");
const crypto = require("crypto");
const { connection } = require("../utils/database");
const { serialize } = require("cookie");

async function SignUp(req, response) {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const password = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("hex");
  const now = new Date();
  const dateCreated = strftime("%Y-%m-%d %H:%M:%S", now);

  const data = {
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: password,
    createdAt: dateCreated,
    updatedAt: dateCreated,
    active: true,
  };

  connection.query(
    `SELECT * FROM customer WHERE email='${email}'`,
    (err, res) => {
      if (err) throw err;
      else {
        if (res.length == 0) {
          connection.query("INSERT INTO customer SET ?", data, (err, res) => {
            if (err) throw err;
            else {
              response.status(200).json({ message: [email] });
            }
          });
        } else {
          response.status(200).json({ message: "already" });
        }
      }
    }
  );
}

module.exports = {
  SignUp,
};
