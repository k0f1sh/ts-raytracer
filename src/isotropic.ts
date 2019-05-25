import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { Material } from "./material";
import { HitRecord } from "./hit_record";
import { reflect, refract, schlick, random_in_unit_disk, random_in_unit_sphere } from "./util";
import { Texture } from "./texture";

export class Isotropic implements Material {
    albedo: Texture;

    constructor(albedo: Texture) {
        this.albedo = albedo;
    }

    scatter(r_in: Ray, rec: HitRecord, attenuation: Vec3, scatterd: Ray): boolean {
        scatterd.copy(new Ray(rec.p, random_in_unit_sphere()));
        attenuation.copy(this.albedo.value(rec.u, rec.v, rec.p));
        return true;
    }

    emitted(u: number, v: number, p: Vec3): Vec3 {
        return new Vec3(0, 0, 0);
    }
}
