import { SOURCENODESTATE } from "./SourceNodes/sourcenode";
import { VIDEOTYPE } from "./SourceNodes/videonode";
import { TRANSITIONTYPE } from "./ProcessingNodes/transitionnode";

export function exportToJSON(vc) {
    console.warn(
        "VideoContext.exportToJSON has been deprecated. Please use VideoContext.snapshot instead."
    );
    return JSON.stringify(snapshotNodes(vc));
}

export function snapshot(vc) {
    return {
        nodes: snapshotNodes(vc),
        videoContext: snapshotVideoContext(vc)
    };
}

function snapshotVideoContext(vc) {
    return {
        currentTime: vc.currentTime,
        duration: vc.duration,
        state: vc.state,
        playbackRate: vc.playbackRate
    };
}

let warningExportSourceLogged = false;

function snapshotNodes(vc) {
    function qualifyURL(url) {
        var a = document.createElement("a");
        a.href = url;
        return a.href;
    }

    function getInputIDs(node, vc) {
        let inputs = [];
        for (let input of node.inputs) {
            if (input === undefined) continue;
            let inputID;
            let inputIndex = node.inputs.indexOf(input);
            let index = vc._processingNodes.indexOf(input);
            if (index > -1) {
                inputID = "processor" + index;
            } else {
                let index = vc._sourceNodes.indexOf(input);
                if (index > -1) {
                    inputID = "source" + index;
                } else {
                    console.log("Warning, can't find input", input);
                }
            }
            inputs.push({ id: inputID, index: inputIndex });
        }
        return inputs;
    }

    let result = {};

    let sourceNodeStateMapping = [];
    for (let state in SOURCENODESTATE) {
        sourceNodeStateMapping[SOURCENODESTATE[state]] = state;
    }

    for (let index in vc._sourceNodes) {
        let source = vc._sourceNodes[index];
        let id = "source" + index;
        let node_url = "";

        if (!source._isResponsibleForElementLifeCycle) {
            if (!warningExportSourceLogged) {
                console.debug(
                    "Warning - Trying to export source created from an element not a URL. URL of export will be set to the elements src attribute and may be incorrect",
                    source
                );
                warningExportSourceLogged = true;
            }
            node_url = source.element.src;
        } else {
            node_url = qualifyURL(source._elementURL);
        }

        let node = {
            type: source.displayName,
            url: node_url,
            start: source.startTime,
            stop: source.stopTime,
            state: sourceNodeStateMapping[source.state]
        };
        if (node.type === VIDEOTYPE) {
            node.currentTime = null;
            if (source.element && source.element.currentTime) {
                node.currentTime = source.element.currentTime;
            }
        }

        if (source._sourceOffset) {
            node.sourceOffset = source._sourceOffset;
        }
        result[id] = node;
    }

    for (let index in vc._processingNodes) {
        let processor = vc._processingNodes[index];
        let id = "processor" + index;
        let node = {
            type: processor.displayName,
            definition: processor._definition,
            inputs: getInputIDs(processor, vc),
            properties: {}
        };

        for (let property in node.definition.properties) {
            node.properties[property] = processor[property];
        }

        if (node.type === TRANSITIONTYPE) {
            node.transitions = processor._transitions;
        }

        result[id] = node;
    }

    result["destination"] = {
        type: "Destination",
        inputs: getInputIDs(vc.destination, vc)
    };

    return result;
}
