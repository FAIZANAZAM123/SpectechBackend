const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connection } = require("../utils/database");

function GenerateToken(user) {
  const payload = {
    role: user.role,
    id: user.id,
  };
  const token = jwt.sign(payload, "123456asdfghjkljasjdhgasdyt6rt2376tuasgd");
  return token;
}

async function Login(req, response) {
  console.log(req.body.email,req.body.password)
  const email = req.body.email;
  const password = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("hex");

  connection.query(
    `
    SELECT 'customer' AS role,id,email FROM customer 
    WHERE email='${email}' AND password='${password}'
    UNION
    SELECT 'company' AS role,id,email FROM companies 
    WHERE email='${email}' AND password='${password}';
    `,
    (err, res) => {
      if (err) throw err;
      else {
        if (res.length == 0) {
          return response.status(200).json({ message: "invalid" });
        } else {
          var token = GenerateToken(res);
          return response.status(200).json({
            message: "success",
            email: res[0].email,
            role: res[0].role,
            token: token,
            id:res[0].id
          });
        }
      }
    }
  );
}

module.exports = {
  Login,
};
