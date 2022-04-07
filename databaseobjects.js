const Sequelize =require('sequelize');

const sequelize = new Sequelize('discordbot','username','password',{
host:'localhost',
dialect: 'sqlite',
logging: 'false',
storage: 'db.sqlite',
});

require('./models/tictactoe.js')(sequelize,Sequelize.DataTypes);

const TicTacToe = require('.\models/tictactoe.js')(sequelize,Sequelize.DataTypes);

module.exports={
    TicTacToe
};