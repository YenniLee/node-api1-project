// implement your API here

const express = require("express");
const db = require("./data/db.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
    res.send({ api: "api is running" })
});

const port = 4000;
server.listen(port, () => console.log(`\n ** API running on port ${port} **\n`));

server.post("/api/users", (req, res) => {
    const userData = req.body;
    if( !userData.name || !userData.bio) {
        return res.status(400).json({ errorMessage: "Please provide name and bio for the user" })
    } else {
        db.insert(userData)
            .then(user => {
                res.status(201).json(user)
            })
            .catch(err => {
                res.status(500).json({ error: "There was an error while saving the user to the database" })
            })
    }
});

server.get("/api/users", (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(error => {
            res.status(500).json({ error: "The users information could not be retrieved." })
        })
});

server.get("/api/users/:id", (req, res) => {
    const id = req.params.id; 
    db.findById(id)
        .then(user => {
            if (user) {
                res.status(200).json(user)
            } else {
                rers.status(404).json({ message: "The user with the specified ID does nont exist." })
            }
        })
        .catch(err => {
            res.status(400).json({ error: "The user information could not be retrieved." })
        })
});

server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;
    db.remove(id)
        .then(deletedUser => {
            if (deletedUser) {
                res.status(204).end()
            } else {
                res.status(404).json({ message: "the user with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The user could not be removed" })
        })
});

server.put("/api/users/:id", (req, res) => {
    const id = req.params.id;
    
    if(!req.body.name || !req.body.bio) {
        res.status(500).json({ message: "Please provide a name and bio for the user." })
    } else {
        db.update(id, req.body)
            .then(res => {
                if (res === 0) {
                    res.status(404).json({ message: "The user with the specified ID does not exist." })
                } else {
                    db.findById(id)
                        .then(user => {
                            res.status(200).json(user)
                        })
                        .catch(err => {
                            res.status(500).json({ error: "The user information could not be modified", errs })
                        })
                }
            })
            .catch(err => {
                res.status(500).json({ error: "The user information could not be modified.", err })
            })
    }
});