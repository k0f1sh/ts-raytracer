import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { Hittable } from "./hittable";
import { HitRecord } from "./hit_record";

export class Sphere implements Hittable {
    center: Vec3;
    radius: number;

    constructor(center: Vec3, radius: number) {
        this.center = center;
        this.radius = radius;
    }

    hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
        const oc = r.origin.minus(this.center);
        const a = r.direction.dot(r.direction);
        const b = oc.dot(r.direction);
        const c = oc.dot(oc) - (this.radius * this.radius);
        const discriminant = b * b - a * c;
        if (discriminant > 0) {
            let temp = (-b - Math.sqrt(discriminant)) / a;
            if (temp < t_max && temp > t_min) {
                rec.t = temp;
                rec.p = r.point_at_parameter(rec.t);
                rec.normal = (rec.p.minus(this.center).divn(this.radius));
                return true;
            }
            temp = (-b + Math.sqrt(discriminant)) / a;
            if (temp < t_max && temp > t_min) {
                rec.t = temp;
                rec.p = r.point_at_parameter(rec.t);
                rec.normal = (rec.p.minus(this.center).divn(this.radius));
                return true;
            }
        }
        return false;
    }
}
