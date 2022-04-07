const Sequelize =require('sequelize');

const sequelize = new Sequelize('discordbot','username','password',{
host:'localhost',
dialect: 'sqlite',
logging: 'false',
storage: 'db.sqlite',
});

require('./models/tictactoe.js')(sequelize,Sequelize.DataTypes);
sequelize.sync().then(async ()=> {
    console.log('Database Synced');
    sequelize.close();
    


}) .catch(console.error);