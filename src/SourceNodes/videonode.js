//Matthew Shotton, R&D User Experience,© BBC 2015
import { MediaNode } from "./medianode";

export const VIDEOTYPE = "VideoNode";

export class VideoNode extends MediaNode {
    /**
     * Initialise an instance of a VideoNode.
     * This should not be called directly, but created through a call to videoContext.createVideoNode();
     */
    constructor() {
        super(...arguments);
        this._displayName = VIDEOTYPE;
        this._elementType = "video";
    }
}
