async function getUserData(id) {
    try {
      // Step 1: Query the central database to determine which database to use
      const centralResult = await central(id);
  
      // Step 2: Query the vault for sensitive information (name, email, address, phone)
      const vaultPromise = vault(id);
  
      // Step 3: Query the database for basic information based on the result from central
      const dbPromise = dbs[centralResult](id);
  
      // Step 4: Use Promise.all to run both the vault and the db request in parallel
      const [vaultData, dbData] = await Promise.all([vaultPromise, dbPromise]);
  
      // Step 5: Combine the results into the required object format
      const userData = {
        id,
        name: vaultData.name,
        username: dbData.username,
        email: vaultData.email,
        address: vaultData.address,
        phone: vaultData.phone,
        website: dbData.website,
        company: dbData.company,
      };
  
      return userData;
    } catch (error) {
      // Handle any errors, including errors from the central database, vault, or db queries
      return Promise.reject(`Error occurred: ${error.message}`);
    }
  }

  // Test valid ids
getUserData(1).then(data => console.log(data)).catch(err => console.error(err));
getUserData(5).then(data => console.log(data)).catch(err => console.error(err));

// Test invalid ids
getUserData(11).then(data => console.log(data)).catch(err => console.error(err));
getUserData(-1).then(data => console.log(data)).catch(err => console.error(err));

// Test invalid data types
getUserData("string").then(data => console.log(data)).catch(err => console.error(err));
getUserData(true).then(data => console.log(data)).catch(err => console.error(err));