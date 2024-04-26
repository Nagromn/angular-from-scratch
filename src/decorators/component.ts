import { ComponentMetadata } from "../framework/types";

export function Component(metadata: ComponentMetadata) {
    return function (decoratedClass) {
        decoratedClass["selector"] = metadata.selector;
        decoratedClass["providers"] = metadata.providers || [];

        decoratedClass.prototype.render = function () {
            let renderedTemplate = metadata.template;

            metadata.template.match(/{{.*?}}/g).forEach((interpolation) => {
                const propName = interpolation.replace(/{{|}}/g, "").trim();
                renderedTemplate = renderedTemplate.replace(
                    interpolation,
                    this[propName]
                );
            });

            const eventsToBind: {
                elementId: string;
                eventName: string;
                methodName: string;
            }[] = [];

            metadata.template
                .match(/<.*? \(.*?\)=\".*?\".*?>/g)
                .forEach((baliseOuvrante) => {
                    const randomId =
                        "event-listener-" + Math.ceil(Math.random() * 1000);

                    baliseOuvrante
                        .match(/\(.*?\)=\".*?\"/g)
                        .forEach((event) => {
                            const eventName = event
                                .match(/\(.*?\)/)[0]
                                .replace(/\(|\)/g, "");

                            const methodName = event
                                .match(/\".*?\"/g)[0]
                                .replace(/\"/g, "");

                            eventsToBind.push({
                                elementId: randomId,
                                eventName,
                                methodName,
                            });

                            const finalBaliseOuvrante = baliseOuvrante
                                .replace(/\(.*?\)=\".*?\"/g, "")
                                .replace(/>/g, `id="${randomId}">`);

                            renderedTemplate = renderedTemplate.replace(
                                baliseOuvrante,
                                finalBaliseOuvrante
                            );
                        });
                });

            this.element.innerHTML = renderedTemplate;

            eventsToBind.forEach((eventToBind) => {
                this.element
                    .querySelector("#" + eventToBind.elementId)
                    .addEventListener(eventToBind.eventName, () => {
                        this[eventToBind.methodName]();
                        this.render();
                    });
            });
        };

        const originalInitFunction: Function =
            decoratedClass.prototype.init || function () {};

        decoratedClass.prototype.init = function () {
            originalInitFunction.call(this);
            this.render();
        };

        return decoratedClass;
    };
}
