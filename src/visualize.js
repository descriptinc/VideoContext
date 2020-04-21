import { COMPOSITINGTYPE } from "./ProcessingNodes/compositingnode";
import { DESTINATIONTYPE } from "./DestinationNode/destinationnode";
import { VIDEOTYPE } from "./SourceNodes/videonode";
import { CANVASTYPE } from "./SourceNodes/canvasnode";
import { IMAGETYPE } from "./SourceNodes/imagenode";
import { TRANSITIONTYPE } from "./ProcessingNodes/transitionnode";

export function createControlFormForNode(node, nodeName) {
    let rootDiv = document.createElement("div");

    if (nodeName !== undefined) {
        var title = document.createElement("h2");
        title.innerHTML = nodeName;
        rootDiv.appendChild(title);
    }

    for (let propertyName in node._properties) {
        let propertyParagraph = document.createElement("p");
        let propertyTitleHeader = document.createElement("h3");
        propertyTitleHeader.innerHTML = propertyName;
        propertyParagraph.appendChild(propertyTitleHeader);

        let propertyValue = node._properties[propertyName].value;
        if (typeof propertyValue === "number") {
            let range = document.createElement("input");
            range.setAttribute("type", "range");
            range.setAttribute("min", "0");
            range.setAttribute("max", "1");
            range.setAttribute("step", "0.01");
            range.setAttribute("value", propertyValue, toString());

            let number = document.createElement("input");
            number.setAttribute("type", "number");
            number.setAttribute("min", "0");
            number.setAttribute("max", "1");
            number.setAttribute("step", "0.01");
            number.setAttribute("value", propertyValue, toString());

            let mouseDown = false;
            range.onmousedown = function() {
                mouseDown = true;
            };
            range.onmouseup = function() {
                mouseDown = false;
            };
            range.onmousemove = function() {
                if (mouseDown) {
                    node[propertyName] = parseFloat(range.value);
                    number.value = range.value;
                }
            };
            range.onchange = function() {
                node[propertyName] = parseFloat(range.value);
                number.value = range.value;
            };
            number.onchange = function() {
                node[propertyName] = parseFloat(number.value);
                range.value = number.value;
            };
            propertyParagraph.appendChild(range);
            propertyParagraph.appendChild(number);
        } else if (Object.prototype.toString.call(propertyValue) === "[object Array]") {
            for (var i = 0; i < propertyValue.length; i++) {
                let range = document.createElement("input");
                range.setAttribute("type", "range");
                range.setAttribute("min", "0");
                range.setAttribute("max", "1");
                range.setAttribute("step", "0.01");
                range.setAttribute("value", propertyValue[i], toString());

                let number = document.createElement("input");
                number.setAttribute("type", "number");
                number.setAttribute("min", "0");
                number.setAttribute("max", "1");
                number.setAttribute("step", "0.01");
                number.setAttribute("value", propertyValue, toString());

                let index = i;
                let mouseDown = false;
                range.onmousedown = function() {
                    mouseDown = true;
                };
                range.onmouseup = function() {
                    mouseDown = false;
                };
                range.onmousemove = function() {
                    if (mouseDown) {
                        node[propertyName][index] = parseFloat(range.value);
                        number.value = range.value;
                    }
                };
                range.onchange = function() {
                    node[propertyName][index] = parseFloat(range.value);
                    number.value = range.value;
                };

                number.onchange = function() {
                    node[propertyName][index] = parseFloat(number.value);
                    range.value = number.value;
                };
                propertyParagraph.appendChild(range);
                propertyParagraph.appendChild(number);
            }
        }

        rootDiv.appendChild(propertyParagraph);
    }
    return rootDiv;
}

function calculateNodeDepthFromDestination(videoContext) {
    let destination = videoContext.destination;
    let depthMap = new Map();
    depthMap.set(destination, 0);

    function itterateBackwards(node, depth = 0) {
        for (let n of node.inputs) {
            let d = depth + 1;
            if (depthMap.has(n)) {
                if (d > depthMap.get(n)) {
                    depthMap.set(n, d);
                }
            } else {
                depthMap.set(n, d);
            }
            itterateBackwards(n, depthMap.get(n));
        }
    }

    itterateBackwards(destination);
    return depthMap;
}

export function visualiseVideoContextGraph(videoContext, canvas) {
    let ctx = canvas.getContext("2d");
    let w = canvas.width;
    let h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    let nodeDepths = calculateNodeDepthFromDestination(videoContext);
    let depths = nodeDepths.values();
    depths = Array.from(depths).sort(function(a, b) {
        return b - a;
    });
    let maxDepth = depths[0];

    let xStep = w / (maxDepth + 1);

    let nodeHeight = h / videoContext._sourceNodes.length / 3;
    let nodeWidth = nodeHeight * 1.618;

    function calculateNodePos(node, nodeDepths, xStep, nodeHeight) {
        let depth = nodeDepths.get(node);
        nodeDepths.values();

        let count = 0;
        for (let nodeDepth of nodeDepths) {
            if (nodeDepth[0] === node) break;
            if (nodeDepth[1] === depth) count += 1;
        }
        return {
            x: xStep * nodeDepths.get(node),
            y: nodeHeight * 1.5 * count + 50
        };
    }

    // "video":["#572A72", "#3C1255"],
    // "image":["#7D9F35", "#577714"],
    // "canvas":["#AA9639", "#806D15"]

    for (let i = 0; i < videoContext._renderGraph.connections.length; i++) {
        let conn = videoContext._renderGraph.connections[i];
        let source = calculateNodePos(conn.source, nodeDepths, xStep, nodeHeight);
        let destination = calculateNodePos(conn.destination, nodeDepths, xStep, nodeHeight);
        if (source !== undefined && destination !== undefined) {
            ctx.beginPath();
            //ctx.moveTo(source.x + nodeWidth/2, source.y + nodeHeight/2);
            let x1 = source.x + nodeWidth / 2;
            let y1 = source.y + nodeHeight / 2;
            let x2 = destination.x + nodeWidth / 2;
            let y2 = destination.y + nodeHeight / 2;
            let dx = x2 - x1;
            let dy = y2 - y1;

            let angle = Math.PI / 2 - Math.atan2(dx, dy);

            let distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

            let midX = Math.min(x1, x2) + (Math.max(x1, x2) - Math.min(x1, x2)) / 2;
            let midY = Math.min(y1, y2) + (Math.max(y1, y2) - Math.min(y1, y2)) / 2;

            let testX = (Math.cos(angle + Math.PI / 2) * distance) / 1.5 + midX;
            let testY = (Math.sin(angle + Math.PI / 2) * distance) / 1.5 + midY;
            // console.log(testX, testY);

            ctx.arc(testX, testY, distance / 1.2, angle - Math.PI + 0.95, angle - 0.95);

            //ctx.arcTo(source.x + nodeWidth/2 ,source.y + nodeHeight/2,destination.x + nodeWidth/2,destination.y + nodeHeight/2,100);
            //ctx.lineTo(midX, midY);
            ctx.stroke();
            //ctx.endPath();
        }
    }

    for (let node of nodeDepths.keys()) {
        let pos = calculateNodePos(node, nodeDepths, xStep, nodeHeight);
        let color = "#AA9639";
        let text = "";
        if (node.displayName === COMPOSITINGTYPE) {
            color = "#000000";
        }
        if (node.displayName === DESTINATIONTYPE) {
            color = "#7D9F35";
            text = "Output";
        }
        if (node.displayName === VIDEOTYPE) {
            color = "#572A72";
            text = "Video";
        }
        if (node.displayName === CANVASTYPE) {
            color = "#572A72";
            text = "Canvas";
        }
        if (node.displayName === IMAGETYPE) {
            color = "#572A72";
            text = "Image";
        }
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.fillRect(pos.x, pos.y, nodeWidth, nodeHeight);
        ctx.fill();

        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.font = "10px Arial";
        ctx.fillText(text, pos.x + nodeWidth / 2, pos.y + nodeHeight / 2 + 2.5);
        ctx.fill();
    }

    return;
}

export function createSigmaGraphDataFromRenderGraph(videoContext) {
    function idForNode(node) {
        if (videoContext._sourceNodes.indexOf(node) !== -1) {
            let id = "source " + node.displayName + " " + videoContext._sourceNodes.indexOf(node);
            return id;
        }
        let id =
            "processor " + node.displayName + " " + videoContext._processingNodes.indexOf(node);
        return id;
    }

    let graph = {
        nodes: [
            {
                id: idForNode(videoContext.destination),
                label: "Destination Node",
                x: 2.5,
                y: 0.5,
                size: 2,
                node: videoContext.destination
            }
        ],
        edges: []
    };

    for (let i = 0; i < videoContext._sourceNodes.length; i++) {
        let sourceNode = videoContext._sourceNodes[i];
        let y = i * (1.0 / videoContext._sourceNodes.length);
        graph.nodes.push({
            id: idForNode(sourceNode),
            label: "Source " + i.toString(),
            x: 0,
            y: y,
            size: 2,
            color: "#572A72",
            node: sourceNode
        });
    }
    for (let i = 0; i < videoContext._processingNodes.length; i++) {
        let processingNode = videoContext._processingNodes[i];
        graph.nodes.push({
            id: idForNode(processingNode),
            x: Math.random() * 2.5,
            y: Math.random(),
            size: 2,
            node: processingNode
        });
    }

    for (let i = 0; i < videoContext._renderGraph.connections.length; i++) {
        let conn = videoContext._renderGraph.connections[i];
        graph.edges.push({
            id: "e" + i.toString(),
            source: idForNode(conn.source),
            target: idForNode(conn.destination)
        });
    }

    return graph;
}

export function visualiseVideoContextTimeline(videoContext, canvas, currentTime) {
    let ctx = canvas.getContext("2d");
    let w = canvas.width;
    let h = canvas.height;
    let trackHeight = h / videoContext._sourceNodes.length;
    let playlistDuration = videoContext.duration;

    if (currentTime > playlistDuration && !videoContext.endOnLastSourceEnd)
        playlistDuration = currentTime;

    if (videoContext.duration === Infinity) {
        let total = 0;
        for (let i = 0; i < videoContext._sourceNodes.length; i++) {
            let sourceNode = videoContext._sourceNodes[i];
            if (sourceNode._stopTime !== Infinity) total += sourceNode._stopTime;
        }

        if (total > videoContext.currentTime) {
            playlistDuration = total + 5;
        } else {
            playlistDuration = videoContext.currentTime + 5;
        }
    }
    let pixelsPerSecond = w / playlistDuration;
    let mediaSourceStyle = {
        video: ["#572A72", "#3C1255"],
        image: ["#7D9F35", "#577714"],
        canvas: ["#AA9639", "#806D15"]
    };

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#999";

    for (let node of videoContext._processingNodes) {
        if (node.displayName !== TRANSITIONTYPE) continue;
        for (let propertyName in node._transitions) {
            for (let transition of node._transitions[propertyName]) {
                let tW = (transition.end - transition.start) * pixelsPerSecond;
                let tH = h;
                let tX = transition.start * pixelsPerSecond;
                let tY = 0;
                ctx.fillStyle = "rgba(0,0,0, 0.3)";
                ctx.fillRect(tX, tY, tW, tH);
                ctx.fill();
            }
        }
    }

    for (let i = 0; i < videoContext._sourceNodes.length; i++) {
        let sourceNode = videoContext._sourceNodes[i];
        let duration = sourceNode._stopTime - sourceNode._startTime;
        if (duration === Infinity) duration = videoContext.currentTime;
        let start = sourceNode._startTime;

        let msW = duration * pixelsPerSecond;
        let msH = trackHeight;
        let msX = start * pixelsPerSecond;
        let msY = trackHeight * i;
        ctx.fillStyle = mediaSourceStyle.video[i % mediaSourceStyle.video.length];

        ctx.fillRect(msX, msY, msW, msH);
        ctx.fill();
    }

    if (currentTime !== undefined) {
        ctx.fillStyle = "#000";
        ctx.fillRect(currentTime * pixelsPerSecond, 0, 1, h);
    }
}
