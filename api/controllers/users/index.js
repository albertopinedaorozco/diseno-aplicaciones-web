const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

const User = require('./../../models/users');
const Tweet = require('./../../models/tweets');
const crypto = require('./../../functions/crypto');
const config = require('./../../../config');

const getUsers = (req, res) => {
    res.sendStatus(200);
};
const getUser = (req, res) => {
    const id = req.params.id;
    User.findOne({_id : id}, ["name", "username", "birthdate"])
    .then((response)=>{
        const user = {
            name: response.name,
            username: response.username,
            birthdate: crypto.decrypt(response.birthdate)
        }
        res.status(200).send(user);
    })
    .catch((err)=>{
        console.log(err);
        res.sendStatus(500);
    })
};
const newUser = (req, res) => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const password = bcrypt.hashSync(req.body.password, salt);

    const birthdate = req.body.birthdate;//crypto.encrypt();    
    

    const user = {
        name: req.body.name,
        age: req.body.age,
        username: req.body.username,
        password: password,
        email: req.body.email,
        telephone: req.body.telephone,
        birthdate: birthdate
    };
    if(user.name  && user.username && user.password ){
        
        console.log('antes de save')
        console.log('despues de save')
        
        const object = new User(user);
        object.save()
        .then((response)=>{
            console.log('en la respuesta')
            res.status(201).send(response._id);
        })
        .catch((err)=>{
            res.sendStatus(500);
            console.log('en el catch')

        })
    }else{
        res.sendStatus(500);
    }
};
const updateUser = (req, res) => {
    res.send("Actualizar usuario");
};
const deleteUser = (req, res) => {
    res.send("Borrar usuario");
};
const loginUser = (req, res) => {
    console.log('El username enviado es: ' + req.body.username)
    console.log('Contraseña enviada es: ' + req.body.password)
    const user = {
        username: req.body.username,
        password: req.body.password
    };
    User.findOne({username: user.username}, ["username", "name", "password"])
    .then(response=>{
        const password = response.password;
        console.log('La contraseña rara es ' + password)
        if(bcrypt.compareSync(user.password, password)){
            console.log('todo firme ')  
            console.log('El id de respuesta es: ' + response._id) 
            const token = jwt.sign({id: response._id}, config.tokenKey);
            res.status(200).json({token: token, username: response.username, name: response.name, id: response._id});            
        }else{
            console.log('Las contraseñas no coinciden')
            res.sendStatus(400)    
        }
           
    })
    .catch(err=>{
        console.log('en el catch de la pteicion del backend')
        res.sendStatus(400);
    });
};

const listUserTweets = (req, res) => {  
    Tweet.find({user: req.params.id})
        .populate('user', ['username','name'])
        .populate('comments.user',['username','name'])
        .then((response) => res.send(response))
        .catch((err) => res.status(404).send(err));
  };

module.exports = {getUser, newUser, updateUser, deleteUser, loginUser, getUsers, listUserTweets};