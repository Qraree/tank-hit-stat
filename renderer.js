const button = document.querySelector('.drop1');
const buttonDropHundred = document.querySelector('.drop100');
const buttonReset = document.querySelector('.reset');
const buttonShow = document.querySelector('.console');



const test = document.querySelector('.test');
const testWrapper = document.querySelector('.test-wrapper');
const targetDivWrapper = testWrapper.querySelector('.target-div-wrapper');
const testContainer = targetDivWrapper.querySelector('.test-container');
const list = testWrapper.querySelector('.list');

const inputDistance = document.querySelector('#distance');
const inputStandardDeviation = document.querySelector('#standard-deviation');
const inputArmor = document.querySelector('#armor');


let distance;
let standardDeviation;
let armorPenetration;

const target = targetDivWrapper.querySelector('.target');
const targetSigma1 = document.querySelector('#target-sigma1')
const targetSigma2 = document.querySelector('#target-sigma2')

console.log(inputDistance.innerHTML);



buttonShow.addEventListener('click', () => {
    targetSigma1.style.width = `${Number(inputStandardDeviation.value) * 2}px`
    targetSigma1.style.height = `${Number(inputStandardDeviation.value) * 2}px`

    targetSigma2.style.width = `${Number(inputStandardDeviation.value) * 3}px`
    targetSigma2.style.height = `${Number(inputStandardDeviation.value) * 3}px`

    console.log(targetSigma1.style.backgroundColor)
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

const gaussianRandom = (mean=0, stdev=1) => {
    let u = 1 - Math.random();
    let v = Math.random();
    let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    return z * stdev + mean;
}

const resetDots = () => {
    const contentArray = testContainer.querySelectorAll('.test');
    testContainer.replaceChildren(...contentArray)
    clearAllData(chart);

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


const dropDot = () => {
    // stack.push(test)
    // console.log(stack)
    const targetLeft = target.offsetLeft+ (target.clientWidth / 2);
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
        height: e.offsetHeight,
        width: e.offsetWidth,
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
        divStack[index].width = content.offsetWidth
        // console.log(divStack)
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





