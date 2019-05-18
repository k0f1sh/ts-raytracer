import { AABB } from "./aabb";
import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { Hittable } from "./hittable";
import { HitRecord } from "./hit_record";
import { Material } from "./material";
import { surrounding_box } from "./util";

export class MovingSphere implements Hittable {
    center0: Vec3;
    center1: Vec3;
    t0: number;
    t1: number;

    radius: number;
    mat: Material;

    constructor(
        center0: Vec3,
        center1: Vec3,
        t0: number,
        t1: number,
        radius: number,
        mat: Material
    ) {
        this.center0 = center0;
        this.center1 = center1;
        this.t0 = t0;
        this.t1 = t1;
        this.radius = radius;
        this.mat = mat;
    }

    center(time: number): Vec3 {
        return this.center0.plus(this.center1.minus(this.center0).muln((time - this.t0) / (this.t1 - this.t0)))
    }

    hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
        const oc = r.origin.minus(this.center(r.time));
        const a = r.direction.dot(r.direction);
        const b = oc.dot(r.direction);
        const c = oc.dot(oc) - (this.radius * this.radius);
        const discriminant = b * b - a * c;
        if (discriminant > 0) {
            let temp = (-b - Math.sqrt(discriminant)) / a;
            if (temp < t_max && temp > t_min) {
                rec.t = temp;
                rec.p = r.point_at_parameter(rec.t);
                rec.normal = (rec.p.minus(this.center(r.time)).divn(this.radius));
                rec.mat = this.mat;
                return true;
            }
            temp = (-b + Math.sqrt(discriminant)) / a;
            if (temp < t_max && temp > t_min) {
                rec.t = temp;
                rec.p = r.point_at_parameter(rec.t);
                rec.normal = (rec.p.minus(this.center(r.time)).divn(this.radius));
                rec.mat = this.mat;
                return true;
            }
        }
        return false;
    }

    bounding_box(t0: number, t1: number, box: AABB): boolean {
        const v = new Vec3(this.radius, this.radius, this.radius);

        const box_t0 = new AABB(this.center0.minus(v), this.center0.plus(v));
        const box_t1 = new AABB(this.center1.minus(v), this.center1.plus(v));
        box.copy(surrounding_box(box_t0, box_t1));
        return true;
    }
}
