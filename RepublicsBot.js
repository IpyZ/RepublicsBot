const Discord = require('discord.js');
const client = new Discord.Client();

var prefix = '&';

var russianPrisonWallHealthLevel = 100;
var americanPrisonWallHealthLevel = 100;

var russianPresidentWillAlive = false;

var russiansSoldiersCount = 0;
var americansSoldiersCount = 0;

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
					if(msg.member.roles.find(r => r.name == 'Obywatel autorytaryzmu') && !msg.member.roles.find(r => r.name == 'Skazany obywatel autorytaryzmu') && !msg.member.roles.find(r => r.name == 'Imperator')) {
						russianPrisonWallHealthLevel = russianPrisonWallHealthLevel - 10;
						msg.reply('Odebrano murowi 10 pkt wytrzymałości...');
						if(russianPrisonWallHealthLevel <= 0) {
							var prisons = msg.guild.members.filter(member => member.roles.find(r => r.name == 'Skazany obywatel autorytaryzmu'));
							prisons.forEach((member, key) => member.removeRole('569882651197046785'));
							prisons.forEach((member, key) => member.addRole('569865289785933824'));
							msg.reply('Mur został zniszczony...');
						}
					}
					else if(msg.member.roles.find(r => r.name == 'Obywatel demokratyzmu') && !msg.member.roles.find(r => r.name == 'Skazany obywatel demokratyzmu') && !msg.member.roles.find(r => r.name == 'Prezydent')) {
						americanPrisonWallHealthLevel = americanPrisonWallHealthLevel - 10;
						msg.reply('Odebrano murowi 10 pkt wytrzymałości...');
						if(americanPrisonWallHealthLevel <= 0) {
							var prisons = msg.guild.members.filter(member => member.roles.find(r => r.name == 'Skazany obywatel demokratyzmu'));
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
					else if(msg.member.roles.find(r => r.name == 'Prezydent') && msg.mentions.members.first().roles.find(r => r.name == 'Obywatel demokratyzmu') && !msg.mentions.members.first().roles.find(r => r.name == 'Skazany obywatel demokratyzmu')) {
						msg.mentions.members.first().addRole('569882900699283508');
						msg.mentions.members.first().removeRole('569864782149189652');
						msg.reply('Obywatel został skazany na dożywotni pobyt w więzieniu...');
					}
				break;
			case prefix + 'help':
				client.channels.get(msg.channel.id).send('```\nWitaj w spisie komend do naszego bota... Oto one:\n' + prefix + 'hitWall - odbiera 10 punktów życie od ściany więzienia\n' + prefix + 'repairWall - naprawia ścianę więzienia, ale trwa to 10 sekund (zarezerwowane dla prezydenta, imperatora oraz pomocników imperatora)\n' + prefix + 'prison [wzmianka o osobie] - zamyka wymienioną osobę w więzieniu (zarezerwowane tylko dla imperatora)\n' + prefix + 'help - jesteś tutaj\n' + prefix + 'shot - strzela do imperatora (zarezerwowane tylko dla obywateli autorytaryzmu)\n' + prefix + 'dodge - unika strzału (zarezerwowane tylko dla imperatora)\n' + prefix + 'attack - atakuje drugą nację (zarezerwowane tylko dla przezydenta lub imperatora)\n' + prefix + 'soldiers - pokazuje liczbę aktywnych do działania jednostek w twojej armii (zarezerwowane tylko dla prezydenta lub imperatora)\n\nJeżeli jesteś imperatorem lub prezydentem pisząc cokolwiek, z każdą wiadomością nabijasz to swojej armii 5 jednostek wojennych\n```');
				break;
			case prefix + 'shot':
					if(msg.member.roles.find(r => r.name == 'Obywatel autorytaryzmu') && !msg.member.roles.find(r => r.name == 'Imperator')){
						msg.reply('Jeżeli imperator nie zrobi uniku, zabijesz go w ciągu 5 sekund...');
						setTimeout(function() {
							if(russianPresidentWillAlive == false) {
								var imperators = msg.guild.members.filter(member => member.roles.find(r => r.name == 'Imperator'));
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
			case prefix + 'attack':
				if(msg.member.roles.find(r => r.name == 'Imperator')) {
					while(russiansSoldiersCount > 0 && americansSoldiersCount > 0) {
						americansSoldiersCount = americansSoldiersCount - Math.floor(Math.random * ((russiansSoldiersCount + (russiansSoldiersCount / 2) - (russiansSoldiersCount % 2)) - (russiansSoldiersCount - ((russiansSoldiersCount / 2) - (russiansSoldiersCount % 2)) + 1))) + (russiansSoldiersCount - ((russiansSoldiersCount / 2) - (russiansSoldiersCount % 2)));
						
						russiansSoldiersCount = russiansSoldiersCount - Math.floor(Math.random * ((americansSoldiersCount + (americansSoldiersCount / 2) - (americansSoldiersCount % 2)) - (americansSoldiersCount - ((americansSoldiersCount / 2) - (americansSoldiersCount % 2)) + 1))) + (americansSoldiersCount - ((americansSoldiersCount / 2) - (americansSoldiersCount % 2)));
					}
				}
				else if(msg.member.roles.find(r => r.name == 'Prezydent')) {
					while(russiansSoldiersCount > 0 && americansSoldiersCount > 0) {
						russiansSoldiersCount = russiansSoldiersCount - Math.floor(Math.random() * ((americansSoldiersCount + (americansSoldiersCount / 2) - (americansSoldiersCount % 2)) - (americansSoldiersCount - ((americansSoldiersCount / 2) - (americansSoldiersCount % 2)) + 1)) + (americansSoldiersCount - ((americansSoldiersCount / 2) - (americansSoldiersCount % 2))));
						
						americansSoldiersCount = americansSoldiersCount - Math.floor(Math.random() * ((russiansSoldiersCount + (russiansSoldiersCount / 2) - (russiansSoldiersCount % 2)) - (russiansSoldiersCount - ((russiansSoldiersCount / 2) - (russiansSoldiersCount % 2)) + 1)) + (russiansSoldiersCount - ((russiansSoldiersCount / 2) - (russiansSoldiersCount % 2))));
					}
				}
				
				if(russiansSoldiersCount < 0) {
					russiansSoldiersCount = 0;
				}
				
				else if(americansSoldiersCount < 0) {
					americansSoldiersCount = 0;
				}
				
				if(msg.member.roles.find(r => r.name == 'Imperator') && americansSoldiersCount == 0 && russiansSoldiersCount > 0) {
					var prisons = msg.guild.members.filter(member => member.roles.find(r => r.name == 'Skazany obywatel demokratyzmu'));
					prisons.forEach((member, key) => member.removeRole('569882900699283508'));
					prisons.forEach((member, key) => member.addRole('569865289785933824'));
					msg.reply('Udało się - wygrana!');
				}
				else if(msg.member.roles.find(r => r.name == 'Imperator')) {
					msg.reply('Nie udało się - przegrana, lub remis!');
				}
				else if(msg.member.roles.find(r => r.name == 'Prezydent') && russiansSoldiersCount == 0 && americansSoldiersCount > 0) {
					var prisons = msg.guild.members.filter(member => member.roles.find(r => r.name == 'Skazany obywatel autorytaryzmu'));
					prisons.forEach((member, key) => member.removeRole('569882651197046785'));
					prisons.forEach((member, key) => member.addRole('569864782149189652'));
					msg.reply('Udało się - wygrana!');
				}
				else if(msg.member.roles.find(r => r.name == 'Prezydent')) {
					msg.reply('Nie udało się - przegrana, lub remis!');
				}
				break;
			case prefix + 'soldiers':
				if(msg.member.roles.find(r => r.name == 'Imperator')) {
					msg.reply('W twojej armii jest ' + russiansSoldiersCount + ' jednostek gotowych do działania!');
				}
				else if(msg.member.roles.find(r => r.name == 'Prezydent')) {
					msg.reply('W twojej armii jest ' + americansSoldiersCount + ' jednostek gotowych do działania!');
				}
				break;
			default:
				if(msg.member.roles.find(r => r.name == 'Imperator')) {
					russiansSoldiersCount = russiansSoldiersCount + 5;
				}
				else if(msg.member.roles.find(r => r.name == 'Prezydent')) {
					americansSoldiersCount = americansSoldiersCount + 5;
				}
				break;
		}
	}
});

client.login(process.env.BOT_TOKEN);
