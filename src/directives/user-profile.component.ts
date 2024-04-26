import { Input } from "../decorators/input";
import { Component } from "../decorators/component";

@Component({
    selector: "user-profile",
    template: `
        <h3 (click)="onClickH3">{{ firstname }} {{ lastname }}</h3>
        <strong> Poste : {{ job }}</strong>
        <button (click)="onClickButton" (dblclick)="onDblClickButton">
            Changer le prénom
        </button>
    `,
})
export class UserProfileComponent {
    @Input("firstname")
    firstname: string;
    @Input("lastname")
    lastname: string;
    @Input("job")
    job: string;

    constructor(public element: HTMLElement) {}

    onClickH3() {
        console.log("Clique sur le h3");
    }

    onDblClickButton() {
        this.firstname = "Magali";
    }

    onClickButton() {
        this.firstname = "Roger";
    }
}
