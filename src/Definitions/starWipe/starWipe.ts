import vertexShader from "./starWipe.vert";
import fragmentShader from "./starWipe.frag";

export const STAR_WIPE = {
    title: "Star Wipe Fade",
    description: "A classic star wipe transistion. Typically used as a transistion.",
    vertexShader,
    fragmentShader,
    properties: {
        mix: { type: "uniform", value: 1.0 }
    },
    inputs: ["u_image_a", "u_image_b"]
};
