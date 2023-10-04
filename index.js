require('dotenv').config();
const { getAudioUrl } = require('google-tts-api');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { Client, IntentsBitField } = require('discord.js');
const client = new Client({
   intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.MessageContent,
      IntentsBitField.Flags.GuildVoiceStates,
   ]
});

client.on('ready', (c) => {
   console.log(`${c.user.username} is ready!`);
   client.user.setPresence({ activities: [{ name: 'League of Legends' }], status: 'online' });
});

async function playAudio(channel, audioURL) {
   try {
      const connection = joinVoiceChannel({
         channelId: channel.id,
         guildId: channel.guild.id,
         adapterCreator: channel.guild.voiceAdapterCreator
      });

      const audioPlayer = createAudioPlayer();
      const resource = createAudioResource(audioURL);

      audioPlayer.play(resource);
      connection.subscribe(audioPlayer);

      // audioPlayer.on(AudioPlayerStatus.Idle, () => {
      //    setTimeout( () => connection.destroy(), 10000 );
      // });
   } catch (error) {
      console.error(error);
   }
}

client.on('messageCreate', async (message) => {

   if (message.author.bot) return;
   const prefix = '!';
   if (!message.content.startsWith(prefix)) return;
   const args = message.content.slice(prefix.length).trim().split(' ');
   const command = args.shift().toLowerCase();

   if (command === 'ping') {
      message.reply(`Pong! `);
   } else if (command === 'delete') {
      await message.channel.bulkDelete(100, true).then((_message) => {
         message.channel.send(`BOT of JaySerein: Tao đã xoá \`${_message.size}\` tin nhắn   ✅`).then((sent) => {
            setTimeout(function () {
               sent.delete();
            }, 5000);
         });
      });
   } else if (command === 'say') {
      if (!args[0]){
         message.delete();
         return message.channel.send(`Nói gì đi ${message.author.username}  😡`).then((sent) => {
            setTimeout(function () {
               sent.delete();
            }, 5000);
         });
      }
      const string = args.join(' ');
      if(string.length > 200){
         message.delete();
         return message.channel.send(`Nói ít thôi ${message.author.username}  😡`).then((sent) => {
            setTimeout(function () {
               sent.delete();
            }, 5000);
         });
      } 
      const voiceChannel = message.member.voice.channel;
      if(!voiceChannel){
         message.delete();
         return message.channel.send(`Join Voice Room đi ${message.author.username}  😡`).then((sent) => {
            setTimeout(function () {
               sent.delete();
            }, 5000);
         });
      }
      const audioURL = await getAudioUrl(string, {
         lang: 'vi',
         slow: false,
         host: 'https://translate.google.com',
         timeout: 10000,
      });
      await playAudio(voiceChannel, audioURL);
      message.channel.send(`BOT of JaySerein    :loud_sound:      \`${string}\`     :sos:`);
      message.delete();
   }
});


client.login(process.env.TOKEN);