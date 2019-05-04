class Vec3 {
    x: number;
    y: number;
    z: number;
    
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    plus(v: Vec3): Vec3 {
        return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    minus(v: Vec3): Vec3 {
        return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    
    mul(v: Vec3): Vec3 {
        return new Vec3(this.x * v.x, this.y * v.y, this.z * v.z);
    }
    
    div(v: Vec3): Vec3 {
        return new Vec3(this.x / v.x, this.y / v.y, this.z / v.z);
    }
    
    muln(n: number): Vec3 {
        return new Vec3(this.x * n, this.y * n, this.z * n);
    }
    
    divn(n: number): Vec3 {
        return new Vec3(this.x / n, this.y / n, this.z / n);
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    squared_length(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    to_unit(): Vec3 {
        return this.divn(this.length())
    }

    dot(v: Vec3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v: Vec3): Vec3 {
        const x = this.y * v.z - this.z * v.y;
        const y = -1 * (this.x * v.z - this.z * v.x);
        const z = this.x * v.y - this.y * v.x;
        return new Vec3(x, y, z);
    }
}


