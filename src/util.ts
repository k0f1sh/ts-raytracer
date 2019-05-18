import { Vec3 } from "./vec3";
import { Hittable } from "./hittable";
import { Sphere } from "./sphere";
import { Lambertian } from "./lambertian";
import { Metal } from "./metal";
import { Dielectric } from "./dielectric";
import { HittableList } from "./hittable_list";
import { MovingSphere } from "./moving_sphere";

export const random_in_unit_sphere = (): Vec3 => {
    let p = new Vec3(0.0, 0.0, 0.0);
    do {
        p = new Vec3(Math.random(), Math.random(), Math.random()).muln(2.0).minus(new Vec3(1.0, 1.0, 1.0));
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

export const random_in_unit_disk = (): Vec3 => {
    let p = new Vec3(0.0, 0.0, 0.0);
    do {
        p = new Vec3(Math.random(), Math.random(), 0).muln(2.0).minus(new Vec3(1.0, 1.0, 0.0));
    } while (p.dot(p) >= 1.0);
    return p;
}

//------------------------------------------------------
export const random_scene = () => {
    let list = new Array<Hittable>();
    list.push(new Sphere(new Vec3(0, -1000, 0), 1000, new Lambertian(new Vec3(0.5, 0.5, 0.5))));

    for (let a = -11; a < 11; a++) {
        for (let b = -11; b < 11; b++) {
            let choose_mat = Math.random();
            let center = new Vec3(a + 0.9 * Math.random(), 0.2, b + 0.9 * Math.random());
            if ((center.minus(new Vec3(4, 0.2, 0)).length() > 0.9)) {
                if (choose_mat < 0.8) {
                    list.push(
                        new MovingSphere(
                            center,
                            center.plus(new Vec3(0, 0.5 * Math.random(), 0)),
                            0.0,
                            1.0,
                            0.2,
                            new Lambertian(new Vec3(Math.random() * Math.random(), Math.random() * Math.random(), Math.random() * Math.random()))));
                } else if (choose_mat < 0.95) {
                    list.push(new Sphere(
                        center,
                        0.2,
                        new Metal(
                            new Vec3(
                                0.5 * (1 + Math.random()),
                                0.5 * (1 + Math.random()),
                                0.5 * (1 + Math.random())
                            ),
                            0.5 * Math.random())
                    ));
                } else {
                    list.push(new Sphere(center, 0.2, new Dielectric(1.5)));
                }
            }
        }
    }

    list.push(new Sphere(new Vec3(0, 1, 0), 1.0, new Dielectric(1.5)));
    list.push(new Sphere(new Vec3(-4, 1, 0), 1.0, new Lambertian(new Vec3(0.4, 0.2, 0.1))));
    list.push(new Sphere(new Vec3(4, 1, 0), 1.0, new Metal(new Vec3(0.7, 0.6, 0.5), 0.0)));

    return new HittableList(list);
};
