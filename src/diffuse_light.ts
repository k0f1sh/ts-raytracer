import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { Material } from "./material";
import { HitRecord } from "./hit_record";
import { random_in_unit_sphere } from "./util";
import { Texture } from "./texture";

export class DiffuseLight implements Material {
    emit: Texture;

    constructor(emit: Texture) {
        this.emit = emit;
    }

    scatter(r_in: Ray, rec: HitRecord, attenuation: Vec3, scatterd: Ray): boolean {
        return false;
    }

    emitted(u: number, v: number, p: Vec3): Vec3 {
        return this.emit.value(u, v, p);
    }
}
