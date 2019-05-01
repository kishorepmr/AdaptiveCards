import * as markdownit from "markdown-it";
import * as $ from "jquery";
import * as Handlebars from "handlebars";
import { debug } from "util";
import { Api } from "./api";
import * as AdaptiveCards from "adaptivecards";

export class FormPage {
	
	constructor(private appElement: JQuery<HTMLElement>) {

	}

	private isLoaded = false;
	private html: string;

	public async render(): Promise<void> {
		if (this.html) {
			return;
		}

		let items = await Api.getForms();

		const formEditorTemplate = Handlebars.compile($('#form-template').html());

		this.html = formEditorTemplate({ items: items });
		this.isLoaded = true;
	}

	public show() {
		this.appElement.html(this.html);

	}

	public async loadForm(id: any) {
		var json = await Api.loadForm(id);

		var card = new AdaptiveCards.AdaptiveCard();
		card.parse(JSON.parse(json));

		card.onExecuteAction = async (action) => {
			var submitAction = <AdaptiveCards.SubmitAction>action;
			//console.log(JSON.stringify(submitAction.data));
			await Api.submitForm(id, submitAction.data)
		};
	
		var html = card.render();
		this.appElement.append(html);

	}

}
