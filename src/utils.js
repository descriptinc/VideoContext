//Matthew Shotton, R&D User Experience,© BBC 2015
import { COMBINE } from "./Definitions/combine/combine";

/*
 * Utility function to compile a WebGL Vertex or Fragment shader.
 *
 * @param {WebGLRenderingContext} gl - the webgl context fo which to build the shader.
 * @param {String} shaderSource - A string of shader code to compile.
 * @param {number} shaderType - Shader type, either WebGLRenderingContext.VERTEX_SHADER or WebGLRenderingContext.FRAGMENT_SHADER.
 *
 * @return {WebGLShader} A compiled shader.
 *
 */
export function compileShader(gl, shaderSource, shaderType) {
    let shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        throw "could not compile shader:" + gl.getShaderInfoLog(shader);
    }
    return shader;
}

/*
 * Create a shader program from a passed vertex and fragment shader source string.
 *
 * @param {WebGLRenderingContext} gl - the webgl context fo which to build the shader.
 * @param {WebGLShader} vertexShader - A compiled vertex shader.
 * @param {WebGLShader} fragmentShader - A compiled fragment shader.
 *
 * @return {WebGLProgram} A compiled & linkde shader program.
 */
export function createShaderProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw {
            error: 4,
            msg: "Can't link shader program for track",
            toString: function() {
                return this.msg;
            }
        };
    }
    return program;
}

export function createElementTexture(gl) {
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    //Initialise the texture untit to clear.
    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, type);

    return texture;
}

export function updateTexture(gl, texture, element) {
    if (element.readyState !== undefined && element.readyState === 0) return;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, element);

    texture._isTextureCleared = false;
}

export function clearTexture(gl, texture) {
    // A quick check to ensure we don't call 'texImage2D' when the texture has already been 'cleared' #performance
    if (!texture._isTextureCleared) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            1,
            1,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 0, 0])
        );

        texture._isTextureCleared = true;
    }
}

export function generateRandomId() {
    const appearanceAdjective = [
        "adorable",
        "alert",
        "average",
        "beautiful",
        "blonde",
        "bloody",
        "blushing",
        "bright",
        "clean",
        "clear",
        "cloudy",
        "colourful",
        "concerned",
        "crowded",
        "curious",
        "cute",
        "dark",
        "dirty",
        "drab",
        "distinct",
        "dull",
        "elegant",
        "fancy",
        "filthy",
        "glamorous",
        "gleaming",
        "graceful",
        "grotesque",
        "homely",
        "light",
        "misty",
        "motionless",
        "muddy",
        "plain",
        "poised",
        "quaint",
        "scary",
        "shiny",
        "smoggy",
        "sparkling",
        "spotless",
        "stormy",
        "strange",
        "ugly",
        "unsightly",
        "unusual"
    ];
    const conditionAdjective = [
        "alive",
        "brainy",
        "broken",
        "busy",
        "careful",
        "cautious",
        "clever",
        "crazy",
        "damaged",
        "dead",
        "difficult",
        "easy",
        "fake",
        "false",
        "famous",
        "forward",
        "fragile",
        "guilty",
        "helpful",
        "helpless",
        "important",
        "impossible",
        "infamous",
        "innocent",
        "inquisitive",
        "mad",
        "modern",
        "open",
        "outgoing",
        "outstanding",
        "poor",
        "powerful",
        "puzzled",
        "real",
        "rich",
        "right",
        "robust",
        "sane",
        "scary",
        "shy",
        "sleepy",
        "stupid",
        "super",
        "tame",
        "thick",
        "tired",
        "wild",
        "wrong"
    ];
    const nounAnimal = [
        "manatee",
        "gila monster",
        "nematode",
        "seahorse",
        "slug",
        "koala bear",
        "giant tortoise",
        "garden snail",
        "starfish",
        "sloth",
        "american woodcock",
        "coral",
        "swallowtail butterfly",
        "house sparrow",
        "sea anemone"
    ];

    function randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function capitalize(word) {
        word = word.replace(/\b\w/g, l => l.toUpperCase());
        return word;
    }

    let name =
        randomChoice(appearanceAdjective) +
        " " +
        randomChoice(conditionAdjective) +
        " " +
        randomChoice(nounAnimal);
    name = capitalize(name);
    name = name.replace(/ /g, "-");
    return name;
}

export function importSimpleEDL(ctx, playlist) {
    // Create a "track" node to connect all the clips to.
    let trackNode = ctx.compositor(COMBINE);

    // Create a source node for each of the clips.
    for (let clip of playlist) {
        let node;
        if (clip.type === "video") {
            node = ctx.video(clip.src, clip.sourceStart);
        } else if (clip.type === "image") {
            node = ctx.image(clip.src, clip.sourceStart);
        } else {
            console.debug(`Clip type ${clip.type} not recognised, skipping.`);
            continue;
        }
        node.startAt(clip.start);
        node.stopAt(clip.start + clip.duration);
        node.connect(trackNode);
    }
    return trackNode;
}

export class UpdateablesManager {
    constructor() {
        this._updateables = [];
        this._useWebworker = false;
        this._active = false;
        this._previousRAFTime = undefined;
        this._previousWorkerTime = undefined;
        this._running = false;

        this._webWorkerString =
            "\
            var running = false;\
            function tick(){\
                postMessage(Date.now());\
                if (running){\
                    setTimeout(tick, 1000/20);\
                }\
            }\
            self.addEventListener('message',function(msg){\
                var data = msg.data;\
                if (data === 'start'){\
                    running = true;\
                    tick();\
                }\
                if (data === 'stop') running = false;\
            });";
        this._webWorker = undefined;
    }

    _initWebWorker() {
        window.URL = window.URL || window.webkitURL;
        let blob = new Blob([this._webWorkerString], {
            type: "application/javascript"
        });
        this._webWorker = new Worker(URL.createObjectURL(blob));
        this._webWorker.onmessage = msg => {
            let time = msg.data;
            this._updateWorkerTime(time);
        };
    }

    _lostVisibility() {
        this._previousWorkerTime = Date.now();
        this._useWebworker = true;
        if (!this._webWorker) {
            this._initWebWorker();
        }
        this._webWorker.postMessage("start");
    }

    _gainedVisibility() {
        this._useWebworker = false;
        this._previousRAFTime = undefined;
        if (this._webWorker) this._webWorker.postMessage("stop");
        requestAnimationFrame(this._updateRAFTime.bind(this));
    }

    _init() {
        if (!window.Worker) return;

        //If page visibility API not present fallback to using "focus" and "blur" event listeners.
        if (typeof document.hidden === "undefined") {
            window.addEventListener("focus", this._gainedVisibility.bind(this));
            window.addEventListener("blur", this._lostVisibility.bind(this));
            return;
        }
        //Otherwise we can use the visibility API to do the loose/gain focus properly
        document.addEventListener(
            "visibilitychange",
            () => {
                if (document.hidden === true) {
                    this._lostVisibility();
                } else {
                    this._gainedVisibility();
                }
            },
            false
        );

        requestAnimationFrame(this._updateRAFTime.bind(this));
    }

    _updateWorkerTime(time) {
        let dt = (time - this._previousWorkerTime) / 1000;
        if (dt !== 0) this._update(dt);
        this._previousWorkerTime = time;
    }

    _updateRAFTime(time) {
        if (this._previousRAFTime === undefined) this._previousRAFTime = time;
        let dt = (time - this._previousRAFTime) / 1000;
        if (dt !== 0) this._update(dt);
        this._previousRAFTime = time;
        if (!this._useWebworker) requestAnimationFrame(this._updateRAFTime.bind(this));
    }

    _update(dt) {
        if (this._running) {
            for (let i = 0; i < this._updateables.length; i++) {
                this._updateables[i]._update(parseFloat(dt));
            }
        }
    }

    resumeUpdate() {
        this._running = true;
    }

    suspendUpdate() {
        this._running = false;
    }

    register(updateable) {
        this._updateables.push(updateable);
        if (this._active === false) {
            this._active = true;
            this._init();
        }
    }
}

export function mediaElementHasSource({ src, srcObject }) {
    return !((src === "" || src === undefined) && srcObject == null);
}
