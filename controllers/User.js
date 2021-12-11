const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function signup (req, res, next)  {
  console.log('hooolaaaaaaaaaaa ca fonctionne jusqu a ici fahd');
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
        roles : ['userRole']
      });
      user.save().then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    }).catch(error => res.status(500).json({ error }));
};

function login (req, res, next) {
  console.log('hiiqiqiqi');
  console.log({ user: req.body });
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        //console.log(User.find().then( (things) => { console.log(things); }))
        //.catch(  (error) => {console.log({ error: error}); });
        return res.status(403).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            ),
            userName:user.firstName + ' ' + user.lastName,
            userRoles: user.roles
          });
        })
        .catch(error => res.status(500).json({ error }+{msg:'FAHD123456789'}));
    })
    .catch(error => res.status(500).json({ error }));
};


module.exports = {login, signup}