const fs = require("fs");

const main = async () => {
    const nx: number = 200;
    const ny: number = 100;

    console.log(`P3\n${nx} ${ny}\n255`);

    for (let j = ny - 1; j >= 0; j--) {
        for (let i = 0; i < nx; i++) {
            const r = i / nx;
            const g = j / ny;
            const b = 0.2;
            const ir = Math.floor(255.99 * r);
            const ig = Math.floor(255.99 * g);
            const ib = Math.floor(255.99 * b);
            console.log(`${ir} ${ig} ${ib}`);
        }
    }
}

main().catch(err => console.log(err));
