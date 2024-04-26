import { Directive } from "../decorators/directive";
import { HostBinding } from "../decorators/host-binding";
import { HostListener } from "../decorators/host-listener";
import { CreditCardVerifier } from "../services/credit-card-verifier";
import { Formatter } from "../services/formatter";

@Directive({
    selector: "[credit-card]",
})
export class CreditCardDirective {
    @HostBinding("style.borderColor")
    borderColor = "blue";

    constructor(
        public element: HTMLElement,
        private formatter: Formatter,
        private verifier: CreditCardVerifier
    ) {}

    @HostListener("input", ["event.target"])
    formatNumber(element: HTMLInputElement) {
        element.value = this.formatter.formatNumber(element.value, 16, 4, true);
    }
}
