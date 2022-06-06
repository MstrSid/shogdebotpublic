import fetch from "node-fetch";


export const cursBB = (ctx, city) => {
	if (city === "" || city.length < 2) {
		city = "Минск";
	}
	let result = '';
	return fetch("https://belarusbank.by/api/kursExchange")
		.then(response => response.json())
		.then(data => {
			data = data.filter(item => {
				for (const value of Object.values(item)) {
					if (Object.values(item).includes(city)) {
						if (value === city) {
							return item;
						}
					} else {
						return;
					}
				}
			});
			let item = data[0];
			result = `<b>Беларусбанк, курс наличными:</b>
<b>Город:</b> ${item.name}
<b>USD:</b> банк покупает <b>${item.USD_in}</b> / банк продает <b>${item.USD_out}</b>
<b>EUR:</b> банк покупает <b>${item.EUR_in}</b> / банк продает <b>${item.EUR_out}</b>
<b>RUB:</b> банк покупает <b>${item.RUB_in}</b> / банк продает <b>${item.RUB_out}</b>`;
			return ctx.replyWithHTML(result);
		})
		.catch(error => ctx.reply(`Ошибка: ${error.message}.`));
};

export const cursCardsBB = (ctx) => {
	let result = '';
	return fetch("https://belarusbank.by/api/kurs_cards")
		.then(response => response.json())
		.then(data => {
			data = data.filter(elem => data.indexOf(elem) === 0);
			data.forEach(item => {
				result = `
<b>Беларусбанк, курс по картам:</b>
<b>USD:</b> банк покупает <b>${item.USDCARD_in}</b> / банк продает <b>${item.USDCARD_out}</b>
<b>EUR:</b> банк покупает <b>${item.EURCARD_in}</b> / банк продает <b>${item.EURCARD_out}</b>
<b>RUB:</b> банк покупает <b>${item.RUBCARD_in}</b> / банк продает <b>${item.RUBCARD_out}</b>
`;
			});
			return ctx.replyWithHTML(result);
		}).catch(error => ctx.reply(`Ошибка: ${error.message}.`));
};

export const photoCats = ctx => {
	const {username} = ctx.from;
	return fetch("https://api.thecatapi.com/v1/images/search")
		.then(response => response.json())
		.then(data => ctx.replyWithPhoto({url: data[0].url}, {caption: `@${username}, держи котика`}))
		.catch(error => ctx.reply(`Котик убежал с ошибкой: ${error.message}.`));
};

export const whoAmI = ctx => {
	const {
		id, username, first_name, last_name
	} = ctx.from;
	return ctx.replyWithHTML(`Кто ты в телеграмме:
id : ${id}
username : ${username}
Имя : ${first_name}
Фамилия : ${last_name}
chatId : ${ctx.chat.id}`);
};

export const replyOnText = (ctx, message) => {
	const {username, id} = ctx.from;
	let url = "";
	if (id === 486958263) {
		url = "https://kossite.ru/phrases_j.json"
	} else {
		url = "https://kossite.ru/phrases.json";
	}
	fetch(url)
		.then(response => response.json())
		.then(data => {
			for (const key of Object.keys(data)) {
				if (key === message.trim().toLowerCase()) {
					return ctx.reply(`@${username}, ${data[key]}`);
				}
			}
		});
};
