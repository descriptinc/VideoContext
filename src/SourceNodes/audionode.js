//Matthew Shotton, R&D User Experience,© BBC 2015
import { MediaNode } from "./medianode";

export const AUDIOTYPE = "AudioNode";
export class AudioNode extends MediaNode {
    /**
     * Initialise an instance of an AudioNode.
     * This should not be called directly, but created through a call to videoContext.audio();
     */
    constructor() {
        super(...arguments);
        this._displayName = AUDIOTYPE;
        this._elementType = "audio";
    }

    _update(currentTime) {
        super._update(currentTime, false);
    }
}
