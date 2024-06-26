import { DirectiveMetaData } from "../framework/types";

export function Directive(metadata: DirectiveMetaData) {
    return function (decoratedClass) {
        decoratedClass["selector"] = metadata.selector;
        decoratedClass["providers"] = metadata.providers || [];

        return decoratedClass;
    };
}
