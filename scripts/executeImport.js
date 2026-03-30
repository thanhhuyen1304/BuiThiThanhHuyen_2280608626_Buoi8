const mongoose = require('mongoose');
const userController = require('../controllers/users');
const path = require('path');

async function runImport() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect('mongodb://localhost:27017/NNPTUD-C2');
        console.log("Connected to MongoDB.");

        const filePath = path.join(__dirname, '../user.xlsx');
        console.log(`Starting import from: ${filePath}`);

        // Ensure "user" role exists
        const roleModel = require('../schemas/roles');
        let userRole = await roleModel.findOne({ name: { $regex: /user/i } });
        if (!userRole) {
            console.log("Creating 'user' role...");
            userRole = new roleModel({ name: 'user', description: 'Standard user role' });
            await userRole.save();
            console.log("'user' role created.");
        }

        const result = await userController.ImportUsersFromExcel(filePath);
        
        console.log("Import successful!");
        console.log("Users imported:");
        result.forEach(u => {
            console.log(`- Username: ${u.username}, Email: ${u.email}, Password: ${u.password}`);
        });

    } catch (error) {
        console.error("Import failed:", error.message);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
}

runImport();
