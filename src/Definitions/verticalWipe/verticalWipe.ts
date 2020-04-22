import vertexShader from "./verticalWipe.vert";
import fragmentShader from "./verticalWipe.frag";

export const VERTICAL_WIPE = {
    title: "vertical Wipe",
    description: "A vertical wipe effect. Typically used as a transistion.",
    vertexShader,
    fragmentShader,
    properties: {
        mix: { type: "uniform", value: 0.0 }
    },
    inputs: ["u_image_a", "u_image_b"]
};
