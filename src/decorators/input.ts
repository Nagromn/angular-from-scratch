/**
 * Permet de récupérer une information dans un attribut de l'élément auquel est rattaché ma directive
 *
 * @param attrName L'attribut dans lequel on veut récupérer une information
 * @returns
 */
export function Input(attrName: string) {
    return function (decoratedClass, propName: string) {
        const originalInitFunction: Function =
            decoratedClass["init"] || function () {};
        // console.log(decoratedClass);

        decoratedClass["init"] = function () {
            if (this.element.hasAttribute(`[${attrName}]`)) {
                this[propName] =
                    this.element.getAttribute(`[${attrName}]`) === "true";
            }

            if (this.element.hasAttribute(attrName)) {
                this[propName] = this.element.getAttribute(attrName)!;
                // "!" permet de dire à TS de ne pas retenir cette erreur
            }

            originalInitFunction.call(this);
        };
    };
}
