import vertexShader from "./colorThreshold.vert";
import fragmentShader from "./colorThreshold.frag";

export const COLOR_THRESHOLD = {
    title: "Color Threshold",
    description: "Turns all pixels with a greater value than the specified threshold transparent.",
    vertexShader,
    fragmentShader,
    properties: {
        a: { type: "uniform", value: 0.0 },
        colorAlphaThreshold: { type: "uniform", value: [0.0, 0.55, 0.0] }
    },
    inputs: ["u_image"]
};
