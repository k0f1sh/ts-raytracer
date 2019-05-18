import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { Material } from "./material";
import { HitRecord } from "./hit_record";
import { reflect, refract, schlick } from "./util";

export class Dielectric implements Material {
    ref_idx: number;

    constructor(ref_idx: number) {
        this.ref_idx = ref_idx;
    }

    scatter(r_in: Ray, rec: HitRecord, attenuation: Vec3, scatterd: Ray): boolean {
        const reflected = reflect(r_in.direction.to_unit(), rec.normal);
        let ni_over_nt = 0.0;
        attenuation.copy(new Vec3(1.0, 1.0, 1.0));
        let refracted = new Vec3(0.0, 0.0, 0.0);
        let outward_normal = new Vec3(0.0, 0.0, 0.0);
        let reflect_prob = 0.0;
        let cosine = 0.0;

        if (r_in.direction.dot(rec.normal) > 0) {
            outward_normal.copy(rec.normal.muln(-1.0));
            ni_over_nt = this.ref_idx;
            cosine = this.ref_idx * r_in.direction.dot(rec.normal) / r_in.direction.length();
        } else {
            outward_normal.copy(rec.normal);
            ni_over_nt = 1.0 / this.ref_idx;
            cosine = -1 * r_in.direction.dot(rec.normal) / r_in.direction.length();
        }
        if (refract(r_in.direction, outward_normal, ni_over_nt, refracted)) {
            reflect_prob = schlick(cosine, this.ref_idx);
        } else {
            reflect_prob = 1.0;
        }
        if (Math.random() < reflect_prob) {
            scatterd.copy(new Ray(rec.p, reflected, r_in.time));
        } else {
            scatterd.copy(new Ray(rec.p, refracted, r_in.time));
        }
        return true;
    }
}
