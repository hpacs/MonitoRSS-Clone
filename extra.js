const Discord = require('discord.js');
const TOKEN = process.env.EXTRA_TOKEN;
const bot = new Discord.Client();
const fetch = require("node-fetch");
const url = "http://gamepatch.elswordonline.com/PatchPath.dat";
const sgame = "https://api.koggames.com/Server/CheckGameStat.ashx";
const getData = async url => {
  try {
    const response = await fetch(url);
    const content = await response.text();
    return content;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getWiki = async wikiurl => {
  try {
    const response = await fetch(wikiurl);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getServer = async sgame =>{
  try {
    const reply = await fetch(sgame);
    const rjson = await reply.json;
    return rjson;
  } catch (error) {
    console.log(error);
    return error;
    
  }


};

async function replyWithInvite(msg) {
  let invite = await msg.channel.createInvite(
  {
    maxAge: 86400, // maximum time for the invite, in milliseconds
    maxUses: 1, // maximum times it can be used
    unique: true
  },
)
.catch(console.log);
   msg.reply(invite ? `Here's your invite: ${invite}` : "There has been an error during the creation of the invite.");
}


bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);

});



bot.on('message', message => {


  if (message.author.bot) return;
  else if (message.content.startsWith("/inv")) {
  if(!(message.member.roles.cache.some(r => r.name === "Moderator") || message.member.roles.cache.some(r => r.name === "Asst Mod"))) return;
    replyWithInvite(message);
  }
  else if (message.content.startsWith("/kom")) {
      var prom1 = getData(url);
      prom1.then(function(msg){
      var nmsg = msg.slice(1,-1);
      var fmsg = nmsg + "data/data001.kom";
      const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('LINK TO DOWNLOAD INDIVIDUAL .KOM FILES')
        .setDescription(fmsg)
        .setFooter('Replace data001.kom with the file you need')
      message.channel.send(exampleEmbed);
      }
                 );
         if(message.guild){
     message.delete();
     }
  }
  else if (message.content.startsWith("/wiki ")){
    //  if(message.guild){
    //  if(!(message.member.roles.find(r => r.name === "Moderator") || message.member.roles.find(r => rname === "Asst Mod"))) return;
    // message.delete();
    // }
    const term = message.content.slice(6);
    console.log(term);
    var splitStr = term.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
   }
   // Directly return the joined string
    var nterm = splitStr.join(' '); 
    const bwikiurl = "http://twitterbridge.herokuapp.com/?action=display&bridge=GoogleSearch&q=elwiki+" + nterm + "&format=Json";
    const wikiurl = encodeURI(bwikiurl);
    var prom2 = getWiki(wikiurl);
    var i=0;
    var put=0;
    var sterm = "Elwiki Results for " + term;
    var sresult;
    var nresult = "No results found";

    prom2.then(function(res){
       const wikiEmbed = new Discord.MessageEmbed()
      .setColor('#fffc2e')
      .setTitle(sterm)
      .setDescription("")
      .setFooter('Using Google API');
      if(res.items.length === 0) {
          wikiEmbed.description += nresult;
          }
      try{
          for(i=0;i<res.items.length && put<3 && i<10; i++){
            var x = res.items[i].url;
            if (x.startsWith("https://elwiki")){
            put++;    
            wikiEmbed.description += x + "\n";
                }
          }
      }
      catch(error){
          console.log(error);
      }
      if(put === 0){
      wikiEmbed.description += nresult;
      }
     message.channel.send(wikiEmbed);
    }
               );
  }


});
