const { connection } = require("../utils/database");

async function GetCompany(req, response) {
  try {
    connection.query(
      `SELECT realms.id,companies.company,companies.founder,companies.personalnote,companies.compantdetails,companies.websiteurl,companies.founded,companies.businessLocation,companies.businessDescription,companies.businessSpecialization,companies.box1color,companies.box2color,companies.box1text,companies.box2text from realms JOIN companies on realms.company_id=companies.id;`,

   
      (err, res) => {
        if (err) {
          console.error("Database query error:", err);
          return response.status(500).json({ message: "Error retrieving data" });
        } 
        
        // Logging the results for debugging
        console.log("Retrieved data:", res);
        
        // Sending the response with the retrieved data
        return response.status(200).json({ data: res });
      }
    );
  } catch (err) {
    console.error("Error in GetCompany:", err);
    return response.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  GetCompany,
};
