import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import IFrameEditing from "./iframeediting";

export default class IFramePlugin extends Plugin {
	static get pluginName() {
		return "IFramePlugin";
	}

	static get requires() {
		return [IFrameEditing];
	}
}
