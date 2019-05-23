import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { Texture } from "./texture";
import { Perlin } from "./perlin";

export class NoiseTexture implements Texture {
    scale: number;

    constructor(scale: number) {
        this.scale = scale;
    }

    value(u: number, v: number, p: Vec3): Vec3 {
        const vec = new Vec3(1.0, 1.0, 1.0).muln((Perlin.noise(p.muln(this.scale)) + 1) / 2);
        return vec;
    }
}



