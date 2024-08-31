const { normalcdf } = require('../../utils/math')
// x_dots, y_dots, standardDeviation


onmessage = (e) => {
    const x_dots = e.data[0];
    const y_dots = e.data[1];
    const standardDeviation = e.data[2];
    const divStack = e.data[3];

    let probabilities = []
    for (let i = 0; i < x_dots.length; i++) {
        const dotProbabilities = [];
        for (let armor of divStack) {
            const hitProbabilityX = normalcdf((armor.right - x_dots[i]) / standardDeviation) - normalcdf((armor.left - x_dots[i]) / standardDeviation)
            const hitProbabilityY = normalcdf((armor.bottom - y_dots[i]) / standardDeviation) - normalcdf((armor.top - y_dots[i]) / standardDeviation)
            const hitProbability = hitProbabilityX * hitProbabilityY;
            const penetrationProbability = hitProbability * Number(armor['hit']);
            dotProbabilities.push(penetrationProbability);
        }
        const sum = dotProbabilities.reduce((partialSum, a) => partialSum + a, 0)
        probabilities.push(sum)
    }

    postMessage(probabilities)
}

