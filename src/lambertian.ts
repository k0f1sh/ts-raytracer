import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { Material } from "./material";
import { HitRecord } from "./hit_record";
import { random_in_unit_sphere } from "./util";
import { Texture } from "./texture";

export class Lambertian implements Material {
    albedo: Texture;

    constructor(albedo: Texture) {
        this.albedo = albedo;
    }

    scatter(r_in: Ray, rec: HitRecord, attenuation: Vec3, scatterd: Ray): boolean {
        const target = rec.p.plus(rec.normal.plus(random_in_unit_sphere()));
        scatterd.copy(new Ray(rec.p, target.minus(rec.p), r_in.time));
        attenuation.copy(this.albedo.value(0, 0, rec.p));
        return true;
    }
}
