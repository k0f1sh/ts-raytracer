import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { Material } from "./material";
import { HitRecord } from "./hit_record";
import { random_in_unit_sphere, reflect } from "./util";

export class Metal implements Material {
    albedo: Vec3;
    fuzz: number;

    constructor(albedo: Vec3, fuzz: number) {
        this.albedo = albedo;
        this.fuzz = fuzz;
    }

    scatter(r_in: Ray, rec: HitRecord, attenuation: Vec3, scatterd: Ray): boolean {
        const reflected = reflect(r_in.direction.to_unit(), rec.normal);
        scatterd.copy(new Ray(rec.p, reflected.plus(random_in_unit_sphere().muln(this.fuzz)), r_in.time));
        attenuation.copy(this.albedo);
        return (scatterd.direction.dot(rec.normal) > 0);
    }

    emitted(u: number, v: number, p: Vec3): Vec3 {
        return new Vec3(0, 0, 0);
    }
}
