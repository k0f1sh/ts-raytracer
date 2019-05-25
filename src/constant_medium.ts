import { AABB } from "./aabb";
import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { Hittable } from "./hittable";
import { HitRecord } from "./hit_record";
import { Material } from "./material";
import { Isotropic } from "./isotropic";
import { Texture } from "./texture";

export class ConstantMedium implements Hittable {
    h: Hittable;
    density: number;
    phase_function: Material

    constructor(h: Hittable, density: number, texture: Texture) {
        this.h = h;
        this.density = density;
        this.phase_function = new Isotropic(texture);
    }

    hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
        //let db = Math.random() < 0.00001;
        //db = false;
        const rec1 = HitRecord.empty();
        const rec2 = HitRecord.empty();

        if (this.h.hit(r, -Number.MAX_VALUE, Number.MAX_VALUE, rec1)) {
            if (this.h.hit(r, rec1.t + 0.0001, Number.MAX_VALUE, rec2)) {
                if (rec1.t < t_min) {
                    rec1.t = t_min;
                }
                if (rec2.t > t_max) {
                    rec2.t = t_max;
                }
                if (rec1.t >= rec2.t) {
                    return false;
                }
                if (rec1.t < 0) {
                    rec1.t = 0;
                }
                const distance_inside_boundary = (rec2.t - rec1.t) * r.direction.length();
                const hit_distance = -(1 / this.density) * Math.log(Math.random());
                if (hit_distance < distance_inside_boundary) {
                    rec.t = rec1.t + hit_distance / r.direction.length();
                    rec.p = r.point_at_parameter(rec.t);
                    rec.normal = new Vec3(1, 0, 0);
                    rec.mat = this.phase_function;
                    return true;
                }
            }
        }
        return false;
    }

    bounding_box(t0: number, t1: number, box: AABB): boolean {
        return this.h.bounding_box(t0, t1, box);
    }
}
