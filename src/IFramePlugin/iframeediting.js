import Plugin from "@ckeditor/ckeditor5-core/src/plugin";

export default class IFrameEditing extends Plugin {
	static get pluginName() {
		return "IFrameEditing";
	}

	init() {
		console.log("IFrameEditing.");

		this._defineSchema();
		this._defineConverters();
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		// Allow <iframe> elements in the model.
		schema.register("iframe", {
			allowWhere: "$text",
			allowContentOf: "$block",
		});
		// Allow <iframe> elements in the model to have all attributes.
		schema.addAttributeCheck((context) => {
			if (context.endsWith("iframe")) {
				return true;
			}
		});
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		// View-to-model converter converting a view <iframe> with all its attributes to the model.
		conversion.for("upcast").elementToElement({
			view: "iframe",
			model: (viewElement, modelWriter) => {
				console.log("UPCAST");
				return modelWriter.createElement(
					"iframe",
					viewElement.getAttributes()
				);
			},
		});

		// Model-to-view converter for the <iframe> element (attributes are converted separately).
		conversion.for("downcast").elementToElement({
			model: "iframe",
			view: "iframe",
		});

		// Model-to-view converter for <iframe> attributes.
		// Note that a lower-level, event-based API is used here.
		conversion.for("downcast").add((dispatcher) => {
			dispatcher.on("attribute", (evt, data, conversionApi) => {
				// Convert <iframe> attributes only.
				if (data.item.name != "iframe") {
					return;
				}

				const viewWriter = conversionApi.writer;
				const viewIframe = conversionApi.mapper.toViewElement(
					data.item
				);

				// In the model-to-view conversion we convert changes.
				// An attribute can be added or removed or changed.
				// The below code handles all 3 cases.
				if (data.attributeNewValue) {
					viewWriter.setAttribute(
						data.attributeKey,
						data.attributeNewValue,
						viewIframe
					);
				} else {
					viewWriter.removeAttribute(data.attributeKey, viewIframe);
				}
			});
		});
	}
}
