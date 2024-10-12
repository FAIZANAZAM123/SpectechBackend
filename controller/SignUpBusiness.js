const strftime = require("strftime");
const crypto = require("crypto");
const { connection } = require("../utils/database");
const { serialize } = require("cookie");


async function SignUpBusiness(req, response) {
  // Define the input data with fallback default values
  const company = req.body.company || req.body.name || 'NA';
  const founder = req.body.founder || 'NA';
  const email = req.body.email;
  const password = crypto.createHash("sha256").update(req.body.password || "NA").digest("hex");
  const personalnote = req.body.personalnote || 'NA';
  const companydetails = req.body.companydetails || 'NA';
  const websiteurl = req.body.websiteurl || req.body.websiteLink;
  const founded = req.body.founded ? req.body.founded : null; // Pass NULL if 'founded' is not provided
  const businessLocation = req.body.businessLocation || 'NA';
  const businessDescription = req.body.businessDescription || 'NA';
  const businessSpecialization = req.body.businessSpecialization || 'NA';
  
  const now = new Date();
  const dateCreated = strftime("%Y-%m-%d %H:%M:%S", now);

  // Data object for inserting into database
  const data = {
    company: company,
    founder: founder,
    email: email,
    password: password,
    personalnote: personalnote,
    companydetails: companydetails,
    websiteurl: websiteurl,
    founded: founded,
    businessLocation: businessLocation,
    businessDescription: businessDescription,
    businessSpecialization: businessSpecialization,
    createdAt: dateCreated,
    updatedAt: dateCreated,
    active: true,
  };

  // Function to check if a column exists and add it if not
  const checkAndCreateColumn = (columnName, dataType) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SHOW COLUMNS FROM companies LIKE '${columnName}'`,
        (err, res) => {
          if (err) return reject(err);
          if (res.length === 0) {
            // Column doesn't exist, create it
            connection.query(
              `ALTER TABLE companies ADD ${columnName} ${dataType}`,
              (err) => {
                if (err) return reject(err);
                resolve();
              }
            );
          } else {
            resolve();
          }
        }
      );
    });
  };

  try {
    // Check and create necessary columns dynamically
    await checkAndCreateColumn("company", "VARCHAR(255)");
    await checkAndCreateColumn("founder", "VARCHAR(255)");
    await checkAndCreateColumn("email", "VARCHAR(255)");
    await checkAndCreateColumn("password", "VARCHAR(255)");
    await checkAndCreateColumn("personalnote", "TEXT");
    await checkAndCreateColumn("companydetails", "TEXT");
    await checkAndCreateColumn("websiteurl", "VARCHAR(255)");
    await checkAndCreateColumn("founded", "DATE");
    await checkAndCreateColumn("businessLocation", "VARCHAR(255)");
    await checkAndCreateColumn("businessDescription", "TEXT");
    await checkAndCreateColumn("businessSpecialization", "VARCHAR(255)");
    await checkAndCreateColumn("createdAt", "DATETIME");
    await checkAndCreateColumn("updatedAt", "DATETIME");
    await checkAndCreateColumn("active", "BOOLEAN");

    // Check if the company or email already exists
    connection.query(
      `SELECT * FROM companies WHERE email='${email}' OR company='${company}'`,
      (err, res) => {
        if (err) throw err;
    
        if (res.length === 0) {
          // Insert the data if company or email does not exist
          connection.query("INSERT INTO companies SET ?", data, (err, insertResult) => {
            if (err) throw err;
    
            // Query the newly inserted company data
            connection.query(
              `SELECT * FROM companies WHERE id = ?`,
              [insertResult.insertId], // Use the insert ID to fetch the newly inserted row
              (err, newRes) => {
                if (err) throw err;
                response.status(200).json({ message: newRes[0] }); // Send the complete data back
              }
            );
          });
        } else {
          // Respond with "already" if company or email exists
          response.status(200).json({ message: "already" });
        }
      }
    );
    
  } catch (error) {
    console.error("Error:", error);
    response.status(500).json({ message: "Error processing request" });
  }
}



async function SetBoxThings(req, response) {
  // Define the input data
  const CompanyId = req.body.CompanyId;
  const box1color = req.body.box1color;
  const box2color = req.body.box2color;
  const box1text = req.body.box1text;
  const box2text = req.body.box2text;

  // Data object for updating the database
  const data = {
    box1color,
    box2color,
    box1text,
    box2text,
  };



  console.log(  box1color,
    box2color,
    box1text,
    box2text,)
  // Function to check if a column exists and add it if not
  const checkAndCreateColumn = (columnName, dataType) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SHOW COLUMNS FROM companies LIKE '${columnName}'`,
        (err, res) => {
          if (err) return reject(err);
          if (res.length === 0) {
            // Column doesn't exist, create it
            connection.query(
              `ALTER TABLE companies ADD ${columnName} ${dataType}`,
              (err) => {
                if (err) return reject(err);
                resolve();
              }
            );
          } else {
            resolve();
          }
        }
      );
    });
  };
  

  try {
    // Check and create necessary columns dynamically
    await Promise.all([
      checkAndCreateColumn("box1color", "VARCHAR(255)"),
      checkAndCreateColumn("box2color", "VARCHAR(255)"),
      checkAndCreateColumn("box1text", "VARCHAR(255)"),
      checkAndCreateColumn("box2text", "VARCHAR(255)"),
    ]);

    // Check if the company exists
    connection.query(
      `SELECT * FROM companies WHERE id = ?`,
      [CompanyId], // Use parameterized query
      (err, res) => {
        if (err) throw err;

        if (res.length > 0) {
          // Update the existing company's data
          connection.query(
            `UPDATE companies SET ? WHERE id = ?`,
            [data, CompanyId], // Use parameterized query
            (err, updateResult) => {
              if (err) throw err;

              // Query the updated company data
              connection.query(
                `SELECT * FROM companies WHERE id = ?`,
                [CompanyId], // Fetch the updated row
                (err, newRes) => {
                  if (err) throw err;
                  response.status(200).json({ message: newRes[0] }); // Send the complete data back
                }
              );
            }
          );
        } else {
          // Respond with "not found" if the company does not exist
          response.status(404).json({ message: "Company not found" });
        }
      }
    );

  } catch (error) {
    console.error("Error:", error);
    response.status(500).json({ message: "Error processing request" });
  }
}




async function getBoxThings(req, res) {

  const CompanyId = req.body.CompanyId;

  try {
    // Query the database for the company with the given CompanyId
    connection.query(
      `SELECT * FROM companies WHERE id = ?`,
      [CompanyId], // Use parameterized query
      (err, result) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({ message: "Error fetching company data" });
        }

        // Check if any company was found
        if (result.length > 0) {
          // Send the found company data
          res.status(200).json({ message: result[0] });
        } else {
          // Respond with "not found" if no company was found
          res.status(404).json({ message: "Company not found" });
        }
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error processing request" });
  }
}



module.exports = {
  SignUpBusiness,
  SetBoxThings,
  getBoxThings

};
