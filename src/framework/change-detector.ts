import set from "lodash/set";
import get from "lodash/get";

export class ChangeDetector {
    bindings: { element: HTMLElement; attrName: string; value: any }[] = [];

    addBinding(element: HTMLElement, attrName: string, value: any) {
        this.bindings = this.bindings.filter(
            (b) => !(b.element === element && b.attrName === attrName)
        );

        this.bindings.push({
            element,
            attrName,
            value,
        });
    }

    digest() {
        console.group("Digest !");

        while (this.bindings.length > 0) {
            const binding = this.bindings.pop();

            const actualValue = get(binding.element, binding.attrName);

            if (actualValue === binding.value) {
                console.log(
                    "Mise en place de " +
                        binding.value +
                        " dans l'attribut " +
                        binding.attrName +
                        " de l'élément " +
                        binding.element
                );
                continue;
            }

            console.log(
                "Mise en place de " +
                    binding.value +
                    " dans l'attribut " +
                    binding.attrName +
                    " de l'élément " +
                    binding.element
            );

            set(binding.element, binding.attrName, binding.value);
        }

        console.groupEnd();
    }
}

export const Detector = new ChangeDetector();
