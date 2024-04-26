import "zone.js";
import { Detector } from "./change-detector";

export const NgZone = Zone.current.fork({
    onInvokeTask(parent, current, target, task, applyThis, applyArgs) {
        parent.invokeTask(target, task, applyThis, applyArgs);
        Detector.digest();
    },
    name: "NgZone",
});
