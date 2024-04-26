import { Directive } from "../decorators/directive";
import { HostBinding } from "../decorators/host-binding";
import { HostListener } from "../decorators/host-listener";
import { Input } from "../decorators/input";
import { Detector } from "../framework/change-detector";
import { Formatter } from "../services/formatter";

@Directive({
    selector: "[phone-number]",
    providers: [
        {
            provide: "formatter",
            construct: () => new Formatter("spécifique"),
        },
    ],
})
export class PhoneNumberDirective {
    @Input("with-spaces")
    willHaveSpaces = true;

    @HostBinding("value")
    value = "";

    @Input("border-color")
    @HostBinding("style.borderColor")
    borderColor = "red";

    @HostBinding("placeholder")
    placeholderText = "Hello World";

    @HostListener("click")
    onClick() {
        this.placeholderText = "Hello Lior !";
        Detector.digest();
    }

    constructor(public element: HTMLElement, private formatter: Formatter) {}

    @HostListener("input", ["event.target.value"])
    formatPhoneNumber(value: string) {
        this.value = this.formatter.formatNumber(
            value,
            10,
            2,
            this.willHaveSpaces
        );

        Detector.digest();
    }
}
