import { Vec3 } from "./vec3";

export class Ray {
    origin: Vec3;
    direction: Vec3;
    time: number;

    constructor(origin: Vec3, direction: Vec3, time: number = 0.0) {
        this.origin = origin;
        this.direction = direction;
        this.time = time;
    }

    point_at_parameter(t: number) {
        return this.origin.plus(this.direction.muln(t));
    }

    copy(r: Ray) {
        this.origin = r.origin;
        this.direction = r.direction;
        this.time = r.time;
    }

    static empty() {
        return new Ray(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), 0.0);
    }
}
