import { Vec3 } from "./vec3";
import { Ray } from "./ray";

export class AABB {
    min: Vec3;
    max: Vec3;

    constructor(min: Vec3, max: Vec3) {
        this.min = min;
        this.max = max;
    }

    ffmin(a: number, b: number): number {
        return a < b ? a : b;
    }

    ffmax(a: number, b: number): number {
        return a > b ? a : b;
    }

    hit(r: Ray, tmin: number, tmax: number): boolean {
        const xt0 = this.ffmin(
            (this.min.x - r.origin.x) / r.direction.x,
            (this.max.x - r.origin.x) / r.direction.x,
        );
        const xt1 = this.ffmax(
            (this.min.x - r.origin.x) / r.direction.x,
            (this.max.x - r.origin.x) / r.direction.x,
        );
        tmin = this.ffmax(xt0, tmin);
        tmax = this.ffmin(xt1, tmax);
        if (tmax <= tmin) {
            return false;
        }

        const yt0 = this.ffmin(
            (this.min.y - r.origin.y) / r.direction.y,
            (this.max.y - r.origin.y) / r.direction.y,
        );
        const yt1 = this.ffmax(
            (this.min.y - r.origin.y) / r.direction.y,
            (this.max.y - r.origin.y) / r.direction.y,
        );
        tmin = this.ffmax(yt0, tmin);
        tmax = this.ffmin(yt1, tmax);
        if (tmax <= tmin) {
            return false;
        }

        const zt0 = this.ffmin(
            (this.min.z - r.origin.z) / r.direction.z,
            (this.max.z - r.origin.z) / r.direction.z,
        );
        const zt1 = this.ffmax(
            (this.min.z - r.origin.z) / r.direction.z,
            (this.max.z - r.origin.z) / r.direction.z,
        );
        tmin = this.ffmax(zt0, tmin);
        tmax = this.ffmin(zt1, tmax);
        if (tmax <= tmin) {
            return false;
        }

        return true;
    }

    copy(box: AABB) {
        this.min = box.min;
        this.max = box.max;
    }
}
