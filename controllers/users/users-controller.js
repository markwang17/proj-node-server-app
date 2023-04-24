import * as usersDao from '../users/users-dao.js'
import { ObjectId } from 'mongodb';

let currentUser = null;

const createUser = async (req, res) => {
    const newUser = req.body;
    newUser.role = "user"
    const insertedUser = await usersDao
        .createUser(newUser);
    res.json(insertedUser);
}

const findUsers = async (req, res) => {
    const users = await usersDao.findAllUsers()
    res.json(users);
}

const findUserById = async (req, res) => {
    if(!ObjectId.isValid(req.params.uid)){
        res.sendStatus(404);
        return;
    }
    const user = await usersDao.findUserById(req.params.uid);
    if (user) {
        res.json(user);
        return;
    }
    res.sendStatus(404);
}

const updateUser = async (req, res) => {
    const userIdToUpdate = req.params.uid;
    const updates = req.body;
    const status = await usersDao
        .updateUser(userIdToUpdate,
            updates);
    res.json(status);
}

const deleteUser = async (req, res) => {
    const userIdToDelete = req.params.uid;
    const status = await usersDao
        .deleteUser(userIdToDelete);
    res.json(status);
}

const login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = await usersDao.findUserByCredentials(username, password);
    if (user && !user.blocked) {
        req.session["currentUser"] = user;
        res.json(user);
    } else {
        if (user && user.blocked) {
            res.sendStatus(403)
        } else {
            res.sendStatus(404);
        }
    }
}

const register = async (req, res) => {
    const username = req.body.username;
    const user = await usersDao.findUserByUsername(username);
    if (user) {
        res.sendStatus(409);
        return;
    }
    const insertedUser = await usersDao
        .createUser(req.body);
    req.session["currentUser"] = insertedUser;
    res.json(insertedUser);
};

const profile = async (req, res) => {
    if (!req.session["currentUser"]) {
        res.sendStatus(404);
        return;
    }
    res.json(req.session["currentUser"]);
}

const logout = async (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
}

const follow = async (req, res) => {
    if (req.params.uid1 === req.params.uid2) {
        res.sendStatus(405);
    }
    const user1 = await usersDao.findUserById(req.params.uid1);
    const user2 = await usersDao.findUserById(req.params.uid2);
    if (user1 && user2) {
        user1.following.push({user: user2._id, username: user2.username})
        user2.followers.push({user: user1._id, username: user1.username})
        await usersDao.updateUser(user1._id, user1);
        await usersDao.updateUser(user2._id, user2);
        res.sendStatus(200)
        return;
    }
    res.sendStatus(404);
}

const unfollow = async (req, res) => {
    if (req.params.uid1 === req.params.uid2) {
        res.sendStatus(405);
    }
    const user1 = await usersDao.findUserById(req.params.uid1);
    const user2 = await usersDao.findUserById(req.params.uid2);
    if (user1 && user2) {
        user1.following = user1.following.filter((followingData) => followingData.user.toString() !== user2._id.toString())
        user2.followers = user2.followers.filter((followingData) => followingData.user.toString() !== user1._id.toString())
        await usersDao.updateUser(user1._id, user1);
        await usersDao.updateUser(user2._id, user2);
        res.sendStatus(200)
        return;
    }
    res.sendStatus(404);
}

const isFollow = async (req, res) => {
    if (req.params.uid1 === req.params.uid2) {
        res.sendStatus(405);
    }
    const user1 = await usersDao.findUserById(req.params.uid1);
    const user2 = await usersDao.findUserById(req.params.uid2);
    if (user1 && user2) {
        const followingData = user1.following.find((followingData) => followingData.user.toString() === user2._id.toString())
        if (followingData) {
            res.send(true)
        } else {
            res.send(false)
        }
        return;
    }
    res.sendStatus(404);
}

const createBookmark = async (req, res) => {
    if (!req.session["currentUser"]) {
        res.send(req.session["currentUser"]);
        return;
    }
    const mid = req.body.movieId;
    const user = req.session["currentUser"]
    if (user.bookmarks.find((followingData) => followingData.movieId.toString() === mid.toString())) {
        res.send("added before")
    } else {
        user.bookmarks.push({movieId: mid, movieCover: req.body.movieCover})
        await usersDao.updateUser(user._id, user)
        res.sendStatus(200)
    }
}

const deleteBookmark = async (req, res) => {
    if (!req.session["currentUser"]) {
        res.sendStatus(404);
        return;
    }
    const mid = req.params.mid;
    const user = req.session["currentUser"]
    user.bookmarks = user.bookmarks.filter((followingData) => followingData.movieId.toString() !== mid.toString())
    await usersDao.updateUser(user._id, user)
    res.sendStatus(200);
}

export default (app) => {
    app.post('/api/users/register', register);
    app.post('/api/users/login', login);
    app.post('/api/users/profile', profile);
    app.post('/api/users/logout', logout);
    app.post('/api/users', createUser);
    app.get('/api/users', findUsers);
    app.get('/api/users/:uid', findUserById);
    app.put('/api/users/:uid', updateUser);
    app.delete('/api/users/:uid', deleteUser);
    app.post('/api/users/follow/:uid1/:uid2', follow);
    app.delete('/api/users/follow/:uid1/:uid2', unfollow);
    app.get('/api/users/follow/:uid1/:uid2', isFollow);
    app.post('/api/users/bookmark', createBookmark);
    app.delete('/api/users/bookmark/:mid', deleteBookmark);
}