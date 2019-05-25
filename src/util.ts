import { AABB } from "./aabb";
import { Box } from "./box";
import { Vec3 } from "./vec3";
import { Hittable } from "./hittable";
import { Sphere } from "./sphere";
import { Lambertian } from "./lambertian";
import { Metal } from "./metal";
import { Dielectric } from "./dielectric";
import { HittableList } from "./hittable_list";
import { MovingSphere } from "./moving_sphere";
import { BvhNode } from "./bvh_node";
import { ConstantTexture } from "./constant_texture";
import { CheckerTexture } from "./checker_texture";
import { NoiseTexture } from "./noise_texture";
import { DiffuseLight } from "./diffuse_light";
import { XYRect } from "./xy_rect";
import { YZRect } from "./yz_rect";
import { XZRect } from "./xz_rect";
import { FlipNormals } from "./flip_normals";
import { Translate } from "./translate";
import { RotateY } from "./rotate_y";
import { ConstantMedium } from "./constant_medium";
import { Polygon } from "./polygon";

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

export const surrounding_box = (box0: AABB, box1: AABB): AABB => {
    const small = new Vec3(
        Math.min(box0.min.x, box1.min.x),
        Math.min(box0.min.y, box1.min.y),
        Math.min(box0.min.z, box1.min.z)
    );
    const big = new Vec3(
        Math.max(box0.max.x, box1.max.x),
        Math.max(box0.max.y, box1.max.y),
        Math.max(box0.max.z, box1.max.z)
    );
    return new AABB(small, big);
}



//------------------------------------------------------
export const random_scene = () => {
    let list = new Array<Hittable>();
    const ct = new CheckerTexture(new ConstantTexture(new Vec3(0.2, 0.3, 0.1)), new ConstantTexture(new Vec3(0.9, 0.9, 0.9)));
    list.push(new Sphere(new Vec3(0, -1000, 0), 1000, new Lambertian(ct)));

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
                            new Lambertian(new ConstantTexture(new Vec3(Math.random() * Math.random(), Math.random() * Math.random(), Math.random() * Math.random())))));
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
    list.push(new Sphere(new Vec3(-4, 1, 0), 1.0, new Lambertian(new ConstantTexture(new Vec3(0.4, 0.2, 0.1)))));
    list.push(new Sphere(new Vec3(4, 1, 0), 1.0, new Metal(new Vec3(0.7, 0.6, 0.5), 0.0)));

    //return new HittableList(list);
    return new BvhNode(list, 0, 1.0);
};


export const two_perlin_spheres = () => {
    const perlintext = new NoiseTexture(10);
    let list = new Array<Hittable>();

    list.push(new Sphere(new Vec3(0, -1000, 0), 1000, new Lambertian(perlintext)));
    list.push(new Sphere(new Vec3(0, 2, 0), 2, new Lambertian(perlintext)));

    //return new HittableList(list);
    return new BvhNode(list, 0, 1.0);
};


export const simple_light = () => {
    const perlintext = new NoiseTexture(4);
    let list = new Array<Hittable>();

    list.push(new Sphere(new Vec3(0, -1000, 0), 1000, new Lambertian(perlintext)));
    list.push(new Sphere(new Vec3(0, 2, 0), 2, new Lambertian(perlintext)));
    list.push(new Sphere(new Vec3(0, 7, 0), 2, new DiffuseLight(new ConstantTexture(new Vec3(4, 4, 4)))));
    list.push(new XYRect(3, 5, 1, 3, -2, new DiffuseLight(new ConstantTexture(new Vec3(4, 4, 4)))));

    return new BvhNode(list, 0, 1);
};

export const cornell_box = () => {
    let list = new Array<Hittable>();

    const red = new Lambertian(new ConstantTexture(new Vec3(0.65, 0.05, 0.05)));
    const white = new Lambertian(new ConstantTexture(new Vec3(0.73, 0.73, 0.73)));
    const green = new Lambertian(new ConstantTexture(new Vec3(0.12, 0.45, 0.15)));
    const light = new DiffuseLight(new ConstantTexture(new Vec3(15, 15, 15)));
    list.push(new FlipNormals(new YZRect(0, 555, 0, 555, 555, green)));
    list.push(new YZRect(0, 555, 0, 555, 0, red));
    list.push(new XZRect(213, 343, 227, 332, 554, light));
    list.push(new FlipNormals(new XZRect(0, 555, 0, 555, 555, white)));
    list.push(new XZRect(0, 555, 0, 555, 0, white));
    list.push(new FlipNormals(new XYRect(0, 555, 0, 555, 555, white)));

    list.push(new Translate(
        new RotateY(
            new Box(new Vec3(0, 0, 0), new Vec3(165, 165, 165), white),
            -18
        ),
        new Vec3(130, 0, 65)
    ));

    list.push(new Translate(
        new RotateY(
            new Box(new Vec3(0, 0, 0), new Vec3(165, 330, 165), white),
            15
        ),
        new Vec3(265, 0, 295)
    ));


    return new BvhNode(list, 0, 1);
}

export const cornell_smoke = () => {
    let list = new Array<Hittable>();

    const red = new Lambertian(new ConstantTexture(new Vec3(0.65, 0.05, 0.05)));
    const white = new Lambertian(new ConstantTexture(new Vec3(0.73, 0.73, 0.73)));
    const green = new Lambertian(new ConstantTexture(new Vec3(0.12, 0.45, 0.15)));
    const light = new DiffuseLight(new ConstantTexture(new Vec3(15, 15, 15)));
    list.push(new FlipNormals(new YZRect(0, 555, 0, 555, 555, green)));
    list.push(new YZRect(0, 555, 0, 555, 0, red));
    list.push(new XZRect(213, 343, 227, 332, 554, light));
    list.push(new FlipNormals(new XZRect(0, 555, 0, 555, 555, white)));
    list.push(new XZRect(0, 555, 0, 555, 0, white));
    list.push(new FlipNormals(new XYRect(0, 555, 0, 555, 555, white)));

    const b1 = new Translate(
        new RotateY(
            new Box(new Vec3(0, 0, 0), new Vec3(165, 165, 165), white),
            -18
        ),
        new Vec3(130, 0, 65)
    );
    list.push(new ConstantMedium(b1, 0.01, new ConstantTexture(new Vec3(1.0, 1.0, 1.0))));

    const b2 = new Translate(
        new RotateY(
            new Box(new Vec3(0, 0, 0), new Vec3(165, 330, 165), white),
            15
        ),
        new Vec3(265, 0, 295)
    );
    list.push(new ConstantMedium(b2, 0.01, new ConstantTexture(new Vec3(0.0, 0.0, 0.0))));

    return new BvhNode(list, 0, 1);
}

export const final = () => {
    let nb = 20;
    const list = new Array<Hittable>();
    const boxlist = new Array<Hittable>();
    const boxlist2 = new Array<Hittable>();

    const white = new Lambertian(new ConstantTexture(new Vec3(0.73, 0.73, 0.73)));
    const ground = new Lambertian(new ConstantTexture(new Vec3(0.48, 0.83, 0.53)));

    for (let i = 0; i < nb; i++) {
        for (let j = 0; j < nb; j++) {
            const w = 100;
            const x0 = -1000 + i * w;
            const z0 = -1000 + j * w;
            const y0 = 0;
            const x1 = x0 + w;
            const y1 = 100 * (Math.random() + 0.01);
            const z1 = z0 + w;
            boxlist.push(new Box(new Vec3(x0, y0, z0), new Vec3(x1, y1, z1), ground));
        }
    }
    list.push(new BvhNode(boxlist, 0, 1));

    const center = new Vec3(400, 400, 200);
    list.push(new MovingSphere(center, center.plus(new Vec3(30, 0, 0)), 0, 1, 50, new Lambertian(new ConstantTexture(new Vec3(0.7, 0.3, 0.1)))));

    const light = new DiffuseLight(new ConstantTexture(new Vec3(7, 7, 7)));
    list.push(new XZRect(123, 423, 147, 412, 554, light));


    list.push(new Sphere(new Vec3(260, 150, 45), 50, new Dielectric(1.5)));
    list.push(new Sphere(new Vec3(0, 150, 145), 70, new Metal(new Vec3(0.8, 0.8, 0.9), 10.0)));


    const boundary = new Sphere(new Vec3(360, 150, 145), 70, new Dielectric(1.5));
    list.push(boundary);
    list.push(new ConstantMedium(boundary, 0.2, new ConstantTexture(new Vec3(0.2, 0.4, 0.9))));
    const boundary2 = new Sphere(new Vec3(0, 0, 0), 5000, new Dielectric(1.5));
    list.push(new ConstantMedium(boundary2, 0.0001, new ConstantTexture(new Vec3(1.0, 1.0, 1.0))));

    for (let k = 0; k < 1000; k++) {
        boxlist2.push(new Sphere(new Vec3(165 * Math.random(), 165 * Math.random(), 165 * Math.random()), 10, white));
    }
    list.push(new Translate(new RotateY(new BvhNode(boxlist2, 0, 1), 15), new Vec3(-100, 270, 395)));

    return new BvhNode(list, 0, 1);
}

export const cornell_box_dragon = () => {
    let list = new Array<Hittable>();

    const red = new Lambertian(new ConstantTexture(new Vec3(0.65, 0.05, 0.05)));
    const white = new Lambertian(new ConstantTexture(new Vec3(0.73, 0.73, 0.73)));
    const green = new Lambertian(new ConstantTexture(new Vec3(0.12, 0.45, 0.15)));
    const light = new DiffuseLight(new ConstantTexture(new Vec3(15, 15, 15)));
    list.push(new FlipNormals(new YZRect(0, 555, 0, 555, 555, green)));
    list.push(new YZRect(0, 555, 0, 555, 0, red));
    list.push(new XZRect(213, 343, 227, 332, 554, light));
    list.push(new FlipNormals(new XZRect(0, 555, 0, 555, 555, white)));
    list.push(new XZRect(0, 555, 0, 555, 0, white));
    list.push(new FlipNormals(new XYRect(0, 555, 0, 555, 555, white)));

    list.push(new Translate(
        new Polygon(new Vec3(0, 0, 0), new Vec3(100, 200, 250), new Vec3(250, 100, 0), white),
        new Vec3(250, 0, 250)
    ));

    return new BvhNode(list, 0, 1);
}
