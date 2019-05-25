import { AABB } from "./aabb";
import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { Hittable } from "./hittable";
import { HitRecord } from "./hit_record";
import { Material } from "./material";

export class XZRect implements Hittable {
    x0: number;
    x1: number;
    z0: number;
    z1: number;
    k: number;
    mat: Material;

    constructor(x0: number, x1: number, z0: number, z1: number, k: number, mat: Material) {
        this.x0 = x0;
        this.x1 = x1;
        this.z0 = z0;
        this.z1 = z1;
        this.k = k;
        this.mat = mat;
    }

    hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
        const t = (this.k - r.origin.y) / r.direction.y;
        if (t < t_min || t > t_max) {
            return false;
        }

        const x = r.origin.x + t * r.direction.x;
        const z = r.origin.z + t * r.direction.z;
        if (x < this.x0 || x > this.x1 || z < this.z0 || z > this.z1) {
            return false;
        }
        const re = new HitRecord(
            t,
            r.point_at_parameter(t),
            new Vec3(0, 1, 0),
            this.mat,
            (x - this.x0) / (this.x1 - this.x0),
            (z - this.z0) / (this.z1 - this.z0)
        );
        rec.copy(re);
        return true;
    }

    bounding_box(t0: number, t1: number, box: AABB): boolean {
        const b = new AABB(new Vec3(this.x0, this.k - 0.0001, this.z0), new Vec3(this.x1, this.k + 0.0001, this.z1));
        box.copy(b);
        return true;
    }
}
