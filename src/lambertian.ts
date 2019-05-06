import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { Material } from "./material";
import { HitRecord } from "./hit_record";
import { random_in_unit_sphere } from "./util";

export class Lambertian implements Material {
    albedo: Vec3;

    constructor(albedo: Vec3) {
        this.albedo = albedo;
    }

    scatter(r_in: Ray, rec: HitRecord, attenuation: Vec3, scatterd: Ray): boolean {
        const target = rec.p.plus(rec.normal.plus(random_in_unit_sphere()));
        scatterd.copy(new Ray(rec.p, target.minus(rec.p)));
        attenuation.copy(this.albedo);
        return true;
    }
}
