import { Vec3 } from "./vec3";

export class HitRecord {
    t: number;
    p: Vec3;
    normal: Vec3;

    constructor(t: number, p: Vec3, normal: Vec3) {
        this.t = t;
        this.p = p;
        this.normal = normal;
    }

    static empty(): HitRecord {
        return new HitRecord(0, new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0));
    }

    copy(h: HitRecord) {
        this.t = h.t;
        this.p = h.p;
        this.normal = h.normal;
    }
}
