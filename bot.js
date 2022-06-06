import fetch from 'node-fetch';
import 'dotenv/config';
import {
	Telegraf,
	session,
	Scenes
} from "telegraf";
import SceneGenerator from "./scenes/scenes.js";
import {replyOnText} from "./utils/functions.js";

// Создать бота с полученным ключом
let bot = new Telegraf(process.env.TELEGRAM_TOKEN_EDU);

const currScene = new SceneGenerator();
const cursBBScene = currScene.getCursBBScene(bot);
const photoCatScene = currScene.getPhotoCatScene();
const whoAmIScene = currScene.getWhoAmIScene();
const cursCardsBBScene = currScene.getCursCardsBBScene();
const stage = new Scenes.Stage([cursBBScene, photoCatScene, whoAmIScene, cursCardsBBScene]);

bot.use(session());
bot.use(stage.middleware());


// Обработчик команды /help
bot.help((ctx) => ctx.reply(`На данный момент бот умеет выводить информацию о курсах валют Беларусбанка, отвечать на часть сообщений, выводить информацию о пользователе и показывать фотографии котиков ^^`));

bot.command("start", ctx => {
	switch (ctx.from.id) {
		case 486958263:
			ctx.reply(`Это же самая классная девушка, Яна!`);
			break;
		case 813214400:
			ctx.reply(`Здравствуй, создатель!`);
			break;
		default:
			ctx.reply(`Приветствую, ${ctx.from.first_name ? ctx.from.first_name : "хороший человек"}!`);
			break;
	}

});
bot.command("menu", (ctx) => {
	bot.telegram.sendMessage(ctx.chat.id, "Меню:", {
		reply_markup: {
			inline_keyboard: [[{
				text: "Курс наличными\n",
				callback_data: 'cursBB'
			},], [{
				text: "Инфо обо мне\n",
				callback_data: 'whoami'
			},], [{
				text: "Фото котиков\n",
				callback_data: 'photoCats'
			},], [{
				text: "Курс по картам",
				callback_data: 'cursCardsBB'
			}]]
		}
	})
});

bot.action("cursCardsBB", async ctx => {
	await ctx.scene.enter('cursCardsBBScene');
	await ctx.scene.leave();
	ctx.answerCbQuery();
});

bot.action('cursBB', async ctx => {
	await ctx.scene.enter('cursBBScene');
	ctx.answerCbQuery();
});

bot.action("whoami", async ctx => {
	await ctx.scene.enter('whoAmIScene');
	await ctx.scene.leave();
	ctx.answerCbQuery();
});

bot.action("photoCats", async ctx => {
	await ctx.scene.enter('photoCatScene');
	await ctx.scene.leave();
	ctx.answerCbQuery();
});

bot.mention("ShoGdeBot", ctx => {
	replyOnText(ctx, ctx.message.text.substring(ctx.message.text.indexOf(" ")+1));
});

// Обработчик простого текста
bot.on("text", ctx => {
	if(ctx.message.chat.type === 'private'){
		replyOnText(ctx, ctx.message.text);
	}
});

bot.launch().catch(error => console.log(error));