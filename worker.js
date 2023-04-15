// x_dots, y_dots, standardDeviation, divStack, obstacles

onmessage = (e) => {
    const x_dots = e.data[0];
    const y_dots = e.data[1];
    const standardDeviation = e.data[2];
    const divStack = e.data[3];
    const obstacles = e.data[4];


    const gaussianRandom = (mean=0, stdev=1) => {
        let u = 1 - Math.random();
        let v = Math.random();
        let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        return z * stdev + mean;
    }

    const probabilitiesArray = [];


    for (let i = 0; i < x_dots.length; i++) {
        const probabilitiesLocalArray = [];
        let hit = 0;
        let j = -1;

        while (true) {
            j += 1;
            let miss = false;

            const x_dot = gaussianRandom(x_dots[i], standardDeviation);
            const y_dot = gaussianRandom(y_dots[i], standardDeviation);

            if (obstacles !== [] || obstacles !== undefined) {
                for (let obstacle of obstacles) {
                    if (x_dot > obstacle.left
                        && x_dot < (obstacle.left + obstacle.width)
                        && y_dot > obstacle.top
                        && y_dot < (obstacle.top + obstacle.height)
                    ) {
                        miss = true;
                        break
                    }
                }
            }

            if (miss !== true) {
                for (let armor of divStack) {
                    if (x_dot > armor.left
                        && x_dot < (armor.left + armor.width)
                        && y_dot > armor.top
                        && y_dot < (armor.top + armor.height)
                    ) {
                        if (armor.hit === 1) {
                            hit += 1;
                            break
                        }
                    }
                }
            }


            probabilitiesLocalArray.push(hit / (j + 1));
            if (probabilitiesLocalArray.length > 500) {
                if (Math.abs(probabilitiesLocalArray[probabilitiesLocalArray.length - 1] - probabilitiesLocalArray[probabilitiesLocalArray.length - 2]) < 0.0001) {
                    break
                }
            }
            // if (j >= 500) {
            //     break
            // }
        }
        probabilitiesArray.push(hit / probabilitiesLocalArray.length);
    }

    postMessage(probabilitiesArray)
}
