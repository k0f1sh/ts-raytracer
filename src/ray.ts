import { Vec3 } from "./vec3";

export class Ray {
    origin: Vec3;
    direction: Vec3;

    constructor(origin: Vec3, direction: Vec3) {
        this.origin = origin;
        this.direction = direction;
    }

    point_at_parameter(t: number) {
        return this.origin.plus(this.direction.muln(t));
    }
}
