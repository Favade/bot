
const { Client, Intents, MessageActionRow, User } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const {token} = require('./config.json');
const{tictactoe, TicTacToe}= require('./databaseobjects.js');


client.once('ready', () => {

    console.log('Ready!');
})

client.on('messageCreate', (message) => {
if (message.author.id===client.user.id) return;

if (message.content === "ping"){

    message.reply("pong");
}

})
/* game   */

let EMPTY= Symbol("empty");
let tictactoe_state 
let PLAYER = Symbol("player");
let BOT = Symbol("BOT");


function makeGrid() {
    components= []
    

    for (let row =0; row <3; row++) {
        switch(tictactoe_state[row][column]) {
            case EMPTY:
                messageButton
                 .setLabel(' ')
                    .setStyle('SECONDARY') 
                    break;
            case PLAYER:
            messageButton
             .setLabel('X ')
                .setStyle('PRIMARY')
             break;

            case BOT:
            messageButton
                .setLabel('O ')
                .setStyle('DANGER') 
                break;
        }
        actionRow= new MessageActionRow()
        for (let column =0; column <3; column++) {
             messageButton= new MessageButton()
                .setcustomId('tictactoe_'+ row+ '_'+column)
                .setLabel(' ')
                .setStyle('SECONDARY') 
            
                actionRow.addComponents(messageButton)


        }
        components.push(actionRow)

    }
 return components

}

function getRandomInt(max) {

    return Math.floor(Math.random()*max);
}

function isDraw() {
    for(let row =0; row <3; row++) {

        for(let column =0; column <3; column++) {

            if (tictactoe_state[row][column]=EMPTY) {

                return false;
            }

        }
    }

    return true;
}

function isGameOver() {
    for(let i=0; i <3; i++){

        if(tictactoe_state[i][0]==tictactoe_state[i][1]==tictactoe_state[i][2]&&tictactoe_state[i][2]!= EMPTY){
         return true;   
        }

        if(tictactoe_state[0][i]== tictactoe_state[1][i]&& tictactoe_state[1[i]==tictactoe_state[2][i]!=EMPTY]){
            return true;
        }


    }

    if(tictactoe_state[1][i]!=EMPTY){
        if((tictactoe_state[0][0]==tictactoe_state[1][1]&& tictactoe_state[1][1]==tictactoe_state[0][2] || (tictactoe_state[2][0]==tictactoe_state[1][1]&& tictactoe_state[1][1]==tictactoe_state[0][2]))){
    return true;
        }
    }
    
    return false;

}




client.on('interactionCreate', async interaction => {

    if(!interaction.isButton()) return;
    if(!interaction.customid.startsWith('tictactoe')) return;
   
    if (isGameOver()) {

        interaction.update({
           

            components: makeGrid()

        })
        return;

    }

    let parsedFields = interaction.customId.split("_")
    let row = parsedFields[1]
   let  column= parsedFields[2]

   if( tictactoe_state[row][column] !=EMPTY){
    interaction.update({
        content: "Tile cant be selected",

        components: makeGrid()

    })
    return;

}
   
    
    tictactoe_state[row][column]= PLAYER;
    
    if (isGameOver()) {
        let user=await TicTacToe.findOne({
            where:{
                user_id: interaction.user.id
            }
            
        });
        if(!user){
            user=await TicTacToe.create({user_id: interaction.user.id});
        }

       await user.increment('score');

        interaction.update({
            content: "game over! you won!"+user.get('score') +1 + "time(s).",

            components: []

        })
        return;

    }

    if (isDraw()) {

        interaction.update({
            content: "the game resulted in a draw!",

            components: []

        })
        return;

    }

 let botRow
 let botColumn


    do {

    
    let botRow =getRandomInt(3)
    let botColumn =getRandomInt(3)
    }while(tictactoe_state[botRow][botColumn]!=EMPTY);

    tictactoe_state[botRow][botColumn]=BOT;
    
    if (isGameOver()) {

        interaction.update({
            content: "game over! you lost!",

            components: makeGrid()

        })
        return;

    }

    if (isDraw()) {

        interaction.update({
            content: "the game resulted in a draw!",

            components: []

        })
        return;

    }

    interaction.update({

        components:makeGrid()
    })

})



client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;
    const {commandName} = interaction;
    

    
    if (commandName ==='tictactoe') {
        let tictactoe_state = [
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY]
        ]
        
        await interaction.reply({content: 'playing tictactoe!', components:makeGrid() });


    }

})
client.login(token);

