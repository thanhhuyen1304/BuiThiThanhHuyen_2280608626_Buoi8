let userModel = require('../schemas/users')
let roleModel = require('../schemas/roles')
let bcrypt = require('bcrypt')
const ExcelJS = require('exceljs');
const { generateRandomPassword } = require('../utils/passwordGenerator');
const { sendMail } = require('../utils/sendMailHandler');
module.exports = {
    CreateAnUser: async function (username, password, email, role, session,
        avatarUrl, fullName, status, loginCount
    ) {
        let newUser = new userModel({
            username: username,
            password: password,
            email: email,
            role: role,
            avatarUrl: avatarUrl,
            fullName: fullName,
            status: status,
            loginCount: loginCount
        })
        await newUser.save({session});
        return newUser;
    },
    QueryByUserNameAndPassword: async function (username, password) {
        let getUser = await userModel.findOne({ username: username });
        if (!getUser) {
            return false;
        }
        if (bcrypt.compareSync(password, getUser.password)) {
            return getUser;
        }
        return false;

    },
    FindUserById: async function (id) {
        return await userModel.findOne({
            _id: id,
            isDeleted: false
        }).populate('role')
    }, FindUserById: async function (id) {
        return await userModel.findOne({
            _id: id,
            isDeleted: false
        }).populate('role')
    },
    FindUserByEmail: async function (email) {
        return await userModel.findOne({
            email: email,
            isDeleted: false
        })
    },
    FindUserByToken: async function (token) {
        let user = await userModel.findOne({
            forgotpasswordToken: token,
            isDeleted: false
        })
        if (!user || user.forgotpasswordTokenExp < Date.now()) {
            return false
        }
        return user
    },
    ImportUsersFromExcel: async function (filePath) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);
        const users = [];

        // Find the "user" role
        let userRole = await roleModel.findOne({ name: { $regex: /user/i } });
        if (!userRole) {
            // If not found, create it or handle error
            throw new Error("Role 'user' not found");
        }

        const rows = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Skip header
                rows.push({
                    username: row.getCell(1).value,
                    email: typeof row.getCell(2).value === 'object' ? row.getCell(2).value.result : row.getCell(2).value
                });
            }
        });

        for (const userData of rows) {
            const password = generateRandomPassword(16);
            const newUser = new userModel({
                username: userData.username,
                password: password, // This will be hashed by the pre-save hook
                email: userData.email,
                role: userRole._id,
                status: true // Assume active
            });

            await newUser.save();
            await sendMail(userData.email, password);
            users.push({ username: userData.username, email: userData.email, password });
        }

        return users;
    }
}