import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { Texture } from "./texture";

export class ConstantTexture implements Texture {
    color: Vec3;

    constructor(color: Vec3) {
        this.color = color;
    }

    value(u: number, v: number, p: Vec3): Vec3 {
        return this.color;
    }
}
