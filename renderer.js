const button = document.querySelector('.drop1');
const buttonDropHundred = document.querySelector('.drop100');
const buttonReset = document.querySelector('.reset');
const buttonShow = document.querySelector('.console');
const buttonGrid = document.querySelector('.grid');



const test = document.querySelector('.test');
const testWrapper = document.querySelector('.test-wrapper');
const targetDivWrapper = testWrapper.querySelector('.target-div-wrapper');
const testContainer = targetDivWrapper.querySelector('.test-container');
const list = testWrapper.querySelector('.list');
const plotlyDiv =  document.querySelector('#plotlyDiv');
const plotlyDiv2d =  document.querySelector('#plotlyDiv2d');


const inputDistance = document.querySelector('#distance');
const inputStandardDeviation = document.querySelector('#standard-deviation');
const inputArmor = document.querySelector('#armor');



inputStandardDeviation.value = 40;
inputArmor.value = 200;


let distance;
let standardDeviation;
let armorPenetration;

const windowWidth = 600;
const windowHeight = 491;

const target = targetDivWrapper.querySelector('.target');
const targetSigma1 = document.querySelector('#target-sigma1')
const targetSigma2 = document.querySelector('#target-sigma2')

console.log(inputDistance.innerHTML);



buttonShow.addEventListener('click', () => {
    targetSigma1.style.width = `${Number(inputStandardDeviation.value) * 2}px`
    targetSigma1.style.height = `${Number(inputStandardDeviation.value) * 2}px`

    targetSigma2.style.width = `${Number(inputStandardDeviation.value) * 3}px`
    targetSigma2.style.height = `${Number(inputStandardDeviation.value) * 3}px`

    divStack.map((armor) => {
        armor['hit'] = Number(inputArmor.value) - Number(armor.thickness) > 0 ? 1 : 0;
    })
})




dragElement(target)

target.addEventListener('click', (e) => {
    e.stopPropagation()
})

target.addEventListener('mousedown', (e) => {
    e.stopPropagation()
})

let divStack = [];
const stack = [];

//todo modal window when hover list item
//todo target sigmas and normal distribution plot
//todo delete contents

const ctx = document.querySelector('.plot');
const canvas = ctx.querySelector('#canvas');



const getIndex = (parent, child) => {
    return Array.prototype.indexOf.call(parent.children, child);
}



// PLOT DATA



const addData = (chart, label, data) => {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

const updateData = (chart, label) => {
    let index = chart.data.labels.indexOf(label);
    chart.data.datasets[0].data[index] += 1;
    chart.update();
}

const clearAllData = (chart) => {
    chart.data.datasets[0].data = chart.data.datasets[0].data.map(el => 0)
    chart.update();
}

// const deleteContent = (chart, index) => {
//     chart.data.datasets[0].data = chart.data.datasets[0].data.splice(index, 1)
//     chart.update()
// }

let chart = new Chart(canvas, {
    type: 'bar',
    data: {
        labels: stack.map(element => element.name),
        datasets: [{
            label: 'Количество попаданий',
            data: stack.map(element => element.value),
            borderWidth: 1,
            backgroundColor: 'rgba(55, 55, 196, 0.78)'
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const range = function(start, stop, step){
    step = step || 1;
    const arr = [];
    for (let i=start;i<stop;i+=step) {
        arr.push(i);
    }
    return arr;
};

// MATH

const normalcdf = (x) => {
    const mean = 0;
    const sigma = 1;
    const z = (x-mean)/Math.sqrt(2*sigma*sigma);
    const t = 1/(1+0.3275911*Math.abs(z));
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const erf = 1-(((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-z*z);
    let sign = 1;
    if(z < 0)
    {
        sign = -1;
    }
    return (1/2)*(1+sign*erf) - 0.5;
}

const gaussianRandom = (mean=0, stdev=1) => {
    let u = 1 - Math.random();
    let v = Math.random();
    let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    return z * stdev + mean;
}

const computeProbability = (x_dots, y_dots, standardDeviation) => {
    return new Promise(function (resolve, reject) {
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
        resolve(probabilities)
    })
    // todo this
}

// DOTS

const resetDots = () => {
    const contentArray = testContainer.querySelectorAll('.image-content-section');
    testContainer.replaceChildren(...contentArray)
    clearAllData(chart);
    console.log(divStack)

}

const isDotInContent = (dotTop, dotLeft) => {
    for (let div of divStack) {
        if (dotLeft > div.left
            && dotLeft < (div.left + div.width)
            && dotTop > div.top
            && dotTop < (div.top + div.height)
        ) {
            updateData(chart, div.name)
        }
    }
}


const make_dot_grid = () => {
    // todo optimize

    const tank_front_dots_x = range(0, windowWidth, 20)
    const tank_front_dots_y = range(0, windowHeight, 20)

    const front_dots_x = []
    const front_dots_y = []

    for (let x_dot of tank_front_dots_x) {
        for (let y_dot of tank_front_dots_y) {
            front_dots_x.push(x_dot)
            front_dots_y.push(y_dot)
            dropGridDot(y_dot, x_dot)
        }
    }

    computeProbability(front_dots_x, front_dots_y, Number(inputStandardDeviation.value)).then((result) => {

        let x = tank_front_dots_x;
        let y = tank_front_dots_y;
        let resultZ = result;
        let z = [];


        let data3d =[
            {
                opacity:0.9,
                color:'#333D79FF',
                type: 'mesh3d',
                x: front_dots_x,
                y: front_dots_y,
                z: resultZ,
            }
        ];

        let layout = {
            title: 'Вероятность попадания ПТУРа',
            scene: {camera: {eye: {x: 1.86, y: 0.88, z: -0.64}}},
            autosize: false,
            width: 500,
            height: 500,
            margin: {
                l: 65,
                r: 50,
                b: 65,
                t: 90,
            }
        };


        Plotly.newPlot(plotlyDiv, data3d, layout);

        while (result.length) z.push(result.splice(0, 25))



        let layout2d = {
            title: 'Вероятность попадания ПТУРа в плоскости'
        }

        let data2d = [
            {
                z: z,
                x: y,
                y: x,
                type: 'heatmap',
                // hoverongaps: false
            }
        ];


        Plotly.newPlot(plotlyDiv2d, data2d, layout2d, {displayModeBar: false});

    })
}


const dropGridDot = (x, y) => {
    // isDotInContent(x, y)
    let dot = document.createElement('div');
    dot.className = 'dot';
    dot.style.backgroundColor = 'red';
    dot.style.top = `${x}px`;
    dot.style.left = `${y}px`;
    testContainer.appendChild(dot)
}


const dropDot = (x, y) => {

    const targetLeft = target.offsetLeft + (target.clientWidth / 2);
    const targetTop = target.offsetTop + (target.clientHeight / 2);

    let randomX = Math.floor(gaussianRandom(targetLeft, 40));
    let randomY = Math.floor(gaussianRandom(targetTop, 40));

    isDotInContent(randomY, randomX)

    let dot = document.createElement('div');
    dot.className = 'dot'
    dot.style.top = `${randomY}px`;
    dot.style.left = `${randomX}px`;


    testContainer.appendChild(dot)

}

const dropDots = (number) => {
    for (let i = 0; i < number; i++) {
        dropDot()
    }
}

button.addEventListener('click', dropDot)
buttonDropHundred.addEventListener('click', () => dropDots(100))
buttonReset.addEventListener('click', resetDots)
buttonGrid.addEventListener('click', make_dot_grid)



function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (elmnt.querySelector('.dragHeader')) {
        elmnt.querySelector('.dragHeader').onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        if (elmnt.className !== 'target') {
            let parent = elmnt.parentNode;
            let index = Array.prototype.indexOf.call(parent.children, elmnt);
            divStack[index].top = elmnt.offsetTop - pos2;
            divStack[index].left = elmnt.offsetLeft - pos1;
        }
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}



test.addEventListener('click', (e) => {
    let content = document.createElement('div');

    addData(chart, `delta_${divStack.length+1}`, 0)

    content.className = 'content';
    content.style.top = `${e.offsetY}px`;
    content.style.left = `${e.offsetX}px`;
    content.style.overflow = 'hidden';
    content.style.resize = 'both';
    content.innerHTML = '' +
        '<div class="dragHeader">' +
        '<div class="dragHeaderCircle"></div>' +
        '<div class="dragHeaderCircle"></div>' +
        '<div class="dragHeaderCircle"></div>' +
        '</div>' +
        '<div class="contentValue">' +
        `<span class="delta">&#948;<span class="index">${divStack.length+1}</span> = </span>` +
        '<div class="value">100</div>' +
        '<input class="input"/>' +
        '<span class="delta">mm</span>' +
        '</div>'



    divStack.push({
        name: `delta_${divStack.length+1}`,
        thickness: 100,
        hit: 1,
        height: 100,
        width: 200,
        top: e.offsetY,
        left: e.offsetX,
    })

    let contentValue = content.querySelector('.contentValue')
    let input = contentValue.querySelector('.input')
    let value = contentValue.querySelector('.value')

    let listItem = document.createElement('div')
    listItem.className = 'listItem';
    listItem.innerHTML = `delta_${divStack.length} - ${100} мм`

    let divColor;

    listItem.addEventListener('mouseenter', () => {
        let index = getIndex(list, listItem)
        divColor = test.childNodes[index+1].style.backgroundColor;
        listItem.style.backgroundColor = 'rgba(39,39,147,0.78)'
        test.childNodes[index+1].style.backgroundColor = 'rgba(55, 55, 196, 0.78)'

    })

    listItem.addEventListener('mouseleave', () => {
        let index = getIndex(list, listItem)
        listItem.style.backgroundColor = '#333D79FF'
        test.childNodes[index+1].style.backgroundColor = divColor;
    })

    list.appendChild(listItem)


    contentValue.addEventListener('click', () => {
        input.value = value.innerHTML;
        value.classList.add('valueHide');
        input.classList.add('inputShow');

    })

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            input.classList.remove('inputShow');
            value.classList.remove('valueHide');
            value.innerHTML = input.value;

            let index = Array.prototype.indexOf.call(test.children, content);
            listItem.innerHTML = `delta_${index + 1} - ${input.value} мм`
            divStack[index].thickness = Number(input.value);
            divStack[index].hit = (Number(inputArmor.value) - Number(input.value)) > 0 ? 1 : 0;
            console.log(inputArmor.value);


            if (Number(value.innerHTML) > 500) {
                content.style.backgroundColor = `rgba(255, ${255-((Number(value.innerHTML)-500)/500*255)}, 0, 0.8)`
            } else {
                content.style.backgroundColor = `rgba(${Number(value.innerHTML)/500*255}, 255, 0, 0.8)`
            }
        }
    })


    dragElement(content);

    // RESIZING_CONTENT_WINDOW //

    const onresize = (dom_elem, callback) => {
        const resizeObserver = new ResizeObserver(() => callback() );
        resizeObserver.observe(dom_elem);
    };

    onresize(content, function () {
        let index = Array.prototype.indexOf.call(test.children, content);
        divStack[index].height = content.offsetHeight;
        divStack[index].width = content.offsetWidth;
        divStack[index].bottom = content.offsetHeight + divStack[index].top;
        divStack[index].right = divStack[index].left + content.offsetWidth;
    });

    // content.addEventListener('dblclick', (e) => {
    //     let index = getIndex(test, content);
    //     console.log(divStack[index].name)
    //     divStack.splice(index, 1);
    //     let array = [...list.children]
    //     let i = 0;
    //     for (let child of array) {
    //         if (i === index) {
    //             list.removeChild(child)
    //         }
    //         i++;
    //     }
    //     deleteContent(chart, index)
    //     test.removeChild(content);
    // })


    content.addEventListener('click', (e) => {
        e.stopPropagation()
    })

    content.addEventListener('mousedown', (e) => {
        e.stopPropagation()
    })

    test.appendChild(content)
    console.log(divStack)

})




