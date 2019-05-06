import { Vec3 } from "./vec3";

export const random_in_unit_sphere = (): Vec3 => {
    let p = new Vec3(0.0, 0.0, 0.0);
    do {
        p = new Vec3(Math.random(), Math.random(), Math.random()).muln(2.0).minus(new Vec3(1.0, 1.0, 1.0))
    } while (p.squared_length() >= 1.0);
    return p;
};

export const reflect = (v: Vec3, n: Vec3): Vec3 => {
    return v.minus(n.muln(v.dot(n) * 2));
}

export const refract = (v: Vec3, n: Vec3, ni_over_nt: number, refracted: Vec3): boolean => {
    const uv = v.to_unit();
    const dt = uv.dot(n);
    const discriminant = 1.0 - ni_over_nt * ni_over_nt * (1 - dt * dt);
    if (discriminant > 0) {
        refracted.copy(uv.minus(n.muln(dt)).muln(ni_over_nt).minus(n.muln(Math.sqrt(discriminant))));
        return true;
    } else {
        return false;
    }
}


export const schlick = (cosine: number, ref_idx: number): number => {
    let r0 = (1 - ref_idx) / (1 + ref_idx);
    r0 = r0 * r0;
    return r0 + (1 - r0) * Math.pow((1 - cosine), 5);
}
