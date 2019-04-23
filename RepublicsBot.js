const Discord = require('discord.js');
const client = new Discord.Client();

var prefix = '&';

var russianPrisonWallHealthLevel = 100;
var americanPrisonWallHealthLevel = 100;

var russianPresidentWillAlive = false;

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);
});

function repairWall(who) {
	if(who == 'prezydent') {
		americanPrisonWallHealthLevel = 100;
	}
	else if(who == 'imperator') {
		russianPrisonWallHealthLevel = 100;
	}
}

client.on('message', msg => {
	if(msg.guild.id == '569854313044901889') {
		switch(msg.content) {
			case prefix + 'hitWall':
					if(msg.member.roles.find(r => r.name == 'Obywatel autorytaryzmu') && !msg.member.roles.find(r => r.name == 'Skazany obywatel autorytaryzmu')) {
						russianPrisonWallHealthLevel = russianPrisonWallHealthLevel - 10;
						msg.reply('Odebrano murowi 10 pkt wytrzymałości...');
						if(russianPrisonWallHealthLevel <= 0) {
							prisons = msg.guild.members.filter(member => member.roles.find(r => r.name == 'Skazany obywatel autorytaryzmu'));
							prisons.forEach((member, key) => member.removeRole('569882651197046785'));
							prisons.forEach((member, key) => member.addRole('569865289785933824'));
							msg.reply('Mur został zniszczony...');
						}
					}
					else if(msg.member.roles.find(r => r.name == 'Obywatel demokratyzmu') && !msg.member.roles.find(r => r.name == 'Skazany obywatel demokratyzmu')) {
						americanPrisonWallHealthLevel = americanPrisonWallHealthLevel - 10;
						msg.reply('Odebrano murowi 10 pkt wytrzymałości...');
						if(americanPrisonWallHealthLevel <= 0) {
							prisons = msg.guild.members.filter(member => member.roles.find(r => r.name == 'Skazany obywatel demokratyzmu'));
							prisons.forEach((member, key) => member.removeRole('569882900699283508'));
							prisons.forEach((member, key) => member.addRole('569864782149189652'));
							msg.reply('Mur został zniszczony...');
						}
					}
				break;
			case prefix + 'repairWall':
					if(msg.member.roles.find(r => r.name == 'Imperator') || msg.member.roles.find(r => r.name == 'Pomocnik imperatora')) {
						msg.reply('Mur zostanie naprawiony w ciągu 10 sekund...');
						setTimeout(function() {
							repairWall("imperator");
							msg.reply('Mur został naprawiony...');
						}, 10000);
					}
					else if(msg.member.roles.find(r => r.name == 'Prezydent')) {
						msg.reply('Mur zostanie naprawiony w ciągu 10 sekund...');
						setTimeout(function() {
							repairWall("prezydent");
							msg.reply('Mur został naprawiony...');
						}, 10000);
					}
				break;
			case prefix + 'prison ' + msg.content.substring(8):
					if(msg.member.roles.find(r => r.name == 'Imperator') && msg.mentions.members.first().roles.find(r => r.name == 'Obywatel autorytaryzmu') && !msg.mentions.members.first().roles.find(r => r.name == 'Skazany obywatel autorytaryzmu')) {
						msg.mentions.members.first().addRole('569882651197046785');
						msg.mentions.members.first().removeRole('569865289785933824');
						msg.reply('Obywatel został skazany na dożywotni pobyt w więzieniu...');
					}
				break;
			case prefix + 'help':
				client.channels.get(msg.channel.id).send('```\nWitaj w spisie komend do naszego bota... Oto one:\n' + prefix + 'hitWall - odbiera 10 punktów życie od ściany więzienia\n' + prefix + 'repairWall - naprawia ścianę więzienia, ale trwa to 10 sekund (zarezerwowane dla prezydenta, imperatora oraz pomocników imperatora)\n' + prefix + 'prison [wzmianka o osobie] - zamyka wymienioną osobę w więzieniu (zarezerwowane tylko dla imperatora)\n' + prefix + 'help - jesteś tutaj\n' + prefix + 'shot - strzela do imperatora (zarezerwowane tylko dla obywateli autorytaryzmu)\n' + prefix + 'dodge - unika strzału (zarezerwowane tylko dla imperatora)\n```');
				break;
			case prefix + 'shot':
					if(msg.member.roles.find(r => r.name == 'Obywatel autorytaryzmu')){
						msg.reply('Jeżeli imperator nie zrobi uniku, zabijesz go w ciągu 5 sekund...');
						setTimeout(function() {
							if(russianPresidentWillAlive == false) {
								imperators = msg.guild.members.filter(member => member.roles.find(r => r.name == 'Imperator'));
								imperators.forEach((member, key) => member.removeRole('569864652369035284'));
								msg.reply('Imperator został zabity...');
							}
						}, 5000);
					}
				break;
			case prefix + 'dodge':
				if(msg.member.roles.find(r => r.name == 'Imperator')){
					russianPresidentWillAlive = true;
					msg.reply('Pomyślnie ominołeś śmierć...');
					setTimeout(function() {
						russianPresidentWillAlive = false;
					}, 10000);
				}
				break;
		}
	}
});

client.login('process.env.BOT_TOKEN');
