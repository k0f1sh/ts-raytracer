import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { Texture } from "./texture";

export class CheckerTexture implements Texture {
    odd: Texture;
    even: Texture;

    constructor(t0: Texture, t1: Texture) {
        this.odd = t0;
        this.even = t1;
    }

    value(u: number, v: number, p: Vec3): Vec3 {
        const sines = Math.sin(10 * p.x) * Math.sin(10 * p.y) * Math.sin(10 * p.z);
        if (sines < 0) {
            return this.odd.value(u, v, p);
        } else {
            return this.even.value(u, v, p);
        }
    }
}
