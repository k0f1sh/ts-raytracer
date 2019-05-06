import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { Material } from "./material";

class EmptyMaterial implements Material {
    scatter(r_in: Ray, hit_record: HitRecord, attenuation: Vec3, scatterd: Ray) {
        return false;
    }
}

export class HitRecord {
    t: number;
    p: Vec3;
    normal: Vec3;
    mat: Material;

    constructor(t: number, p: Vec3, normal: Vec3, mat: Material) {
        this.t = t;
        this.p = p;
        this.normal = normal;
        this.mat = mat;
    }

    static empty(): HitRecord {
        return new HitRecord(0, new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new EmptyMaterial());
    }

    copy(h: HitRecord) {
        this.t = h.t;
        this.p = h.p;
        this.normal = h.normal;
        this.mat = h.mat;
    }
}
