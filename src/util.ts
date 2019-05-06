import { Vec3 } from "./vec3";

export const random_in_unit_sphere = (): Vec3 => {
    let p = new Vec3(0.0, 0.0, 0.0);
    do {
        p = new Vec3(Math.random(), Math.random(), Math.random()).muln(2.0).minus(new Vec3(1.0, 1.0, 1.0))
    } while (p.squared_length() >= 1.0);
    return p;
};

