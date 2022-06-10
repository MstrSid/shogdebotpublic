import {Scenes} from "telegraf";
import {
	cursBB, cursCardsBB,
	photoCats, whoAmI
} from "../utils/functions.js";

class SceneGenerator {
	getCursBBScene() {
		let timeout;
		const cityCursBBScene = new Scenes.BaseScene('cursBBScene');
		cityCursBBScene.enter(ctx => {
			ctx.reply(`@${ctx.from.username}, напиши беларусский город в сообщении и не забудь тегнуть меня, если ты в групповом чате.`);
			timeout = setTimeout(() => {
				ctx.reply(`@${ctx.from.username}, я не получил ответа и прошло 60 секунд. Я вернулся в главное меню.`);
				ctx.scene.leave();
			}, 60000);
		});
		cityCursBBScene.mention("ShoGdeBot", async ctx => {
			clearTimeout(timeout);
			await cursBB(ctx, ctx.message.text.substring(ctx.message.text.indexOf(" ")+1).trim());
			await ctx.scene.leave();
		});
		cityCursBBScene.on("text", async ctx => {
			if(ctx.message.chat.type === 'private'){
				clearTimeout(timeout);
				await cursBB(ctx, ctx.message.text.trim());
				await ctx.scene.leave();
			}
		});
		return cityCursBBScene;
	}

	getPhotoCatScene() {
		const photoCatScene = new Scenes.BaseScene('photoCatScene');
		photoCatScene.enter(async ctx => {
			await photoCats(ctx);
			await ctx.scene.leave();
		});
		return photoCatScene;
	}

	getWhoAmIScene() {
		const whoAmIScene = new Scenes.BaseScene('whoAmIScene');
		whoAmIScene.enter(async ctx => {
			await whoAmI(ctx);
			await ctx.scene.leave();
		});
		return whoAmIScene;
	}

	getCursCardsBBScene() {
		const cursCardsBBScene = new Scenes.BaseScene('cursCardsBBScene');
		cursCardsBBScene.enter(async ctx => {
			await cursCardsBB(ctx);
			await ctx.scene.leave();
		});
		return cursCardsBBScene;
	}
}

export default SceneGenerator;