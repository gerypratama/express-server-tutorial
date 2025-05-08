const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data },
};

const fsPromises = require('fs').promises;
const bcrypt = require('bcrypt');
const path = require('path');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    const duplicate = usersDB.users.find(person => person.username === user);
    if (duplicate) return res.sendStatus(409);

    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const newUser = {
            username: user,
            roles: { User: 2001 },
            password: hashedPwd,
        };
        usersDB.setUsers([...usersDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        res.status(201).json({ 'success': true, 'message': 'New user created' })
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }
};

module.exports = { handleNewUser };