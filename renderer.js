'use strict';

const { ipcRenderer } = require('electron');
const fs = require('fs');
const { T72_ARMOR, T80_ARMOR, ABRAMS_ARMOR, LEOPARD_ARMOR } = require('./src/constants/armors')
const { colormap_array } = require('./src/utils/colormap')
const { ExcelService } = require('./src/modules/excel/excel.service')
const { PlotService } = require('./src/modules/plot/plot.service')
const { TankBattleService } = require('./src/modules/battle/tank-battle.service')
const { ConvertationService } = require('./src/utils/convert')
const { ArmorService } = require('./src/modules/armor/armor.service')

const { gaussianRandom, randomInInterval } = require('./src/utils/math')
const { throttle, addTwoArrays } = require('./src/utils/common')

const { Chart, registerables  } = require('chart.js')
Chart.register(...registerables);


let colorStack = ['red', 'blue'];
let summuryColorStack = [[0.0, 'red'], [1.0, 'blue']];

const z_colormap = colormap_array(1, 50);


const TREE_COLOR = `rgba(147, 28, 12, 0.66)`;
const ROCK_COLOR = `rgba(37, 108, 199, 0.55)`
let PLOT_COLORMAP = 'RdBu';
let PLOT_TITLE_3D = 'Вероятность поражения танка'
let PLOT_TITLE_2D =  'Вероятность поражения в картинной плоскости'
let BATTLE_PLOT_TITLE = 'Исход сражения'

const setT72FrontArmor = document.querySelector('#set-t72-front');
const setT72SideArmor = document.querySelector('#set-t72-side');
const setT80FrontArmor = document.querySelector('#set-t80-front');
const setT80SideArmor = document.querySelector('#set-t80-side');
const setAbramsFrontArmor = document.querySelector('#set-abrams-front');
const setAbramsSideArmor = document.querySelector('#set-abrams-side');
const setLeopardFrontArmor = document.querySelector('#set-leopard-front');
const setLeopardSideArmor = document.querySelector('#set-leopard-side');


const infoTip = document.querySelector('.info-tip');
const buttonShow = document.querySelector('.console');
const buttonGrid = document.querySelector('.grid');
const downloadArmor = document.querySelector('.download-armor');
const uploadArmor = document.querySelector('#upload-armor');
const deleteArmor = document.querySelector('.delete-armor');
const deleteLastArmor = document.querySelector('.delete-last-armor');
const monteCarlo = document.querySelector('.monte-carlo');
const obstacleButton = document.querySelector('.obstacle');
const deleteObstacle = document.querySelector('.delete-obstacle');
const downloadArmorExcel = document.querySelector('.download-armor-excel');
const simulation = document.querySelector('#simulation');
const mockTank = document.querySelector('.mock-tank');

const colorCheckBox = document.querySelector('#color-checkbox');
let autoResizeColorBar = false;

const dotsCheckBox = document.querySelector('#dots-checkbox');
let drawDots = false;

const scaleCheckBox = document.querySelector('#scale-checkbox');
let fixedProbabilityScale = true;


const loader = document.querySelector('.loader');

const gradientAlert = document.querySelector('#gradient-alert');
const armorAlert = document.querySelector('#armor-alert');
const sizeAlert = document.querySelector('#size-alert');
const armorExcelAlert = document.querySelector('#armor-excel-alert');

const widthTip = document.querySelector('#width-dimension');
const heightTip = document.querySelector('#height-dimension');

const monteCarlo3d = document.querySelector('#monte-carlo-3d');
const monteCarlo2d = document.querySelector('#monte-carlo-2d');

const selectColorMap = document.querySelector('#colormap-select');
const colorMapPlot = document.querySelector('.colormap-plot');

const fileInput = document.querySelector('#file-input');
const preview = document.querySelector('#file-wrapper');
const message = document.querySelector('#test-message');

const targetButton = document.querySelector('.target-button');



const obstacleWrapper = document.querySelector('.obstacle-wrapper');
const test = document.querySelector('.test');
const testWrapper = document.querySelector('.test-wrapper');
const targetDivWrapper = testWrapper.querySelector('.target-div-wrapper');
const testContainer = targetDivWrapper.querySelector('.test-container');
const list = testWrapper.querySelector('.list');
const plotlyDiv =  document.querySelector('#plotlyDiv');
const plotlyDiv2d =  document.querySelector('#plotlyDiv2d');

const armorInfo = document.querySelector('.armor-info');

const gradientPicker = document.querySelector('#gradient-picker');
const saveGradient = document.querySelector('#save-gradient');
const uploadGradient = document.querySelector('#upload-gradient');

const inputStandardDeviation = document.querySelector('#standard-deviation');
const inputArmor = document.querySelector('#armor');
const tankWidth = document.querySelector('#width');
const tankHeight = document.querySelector('#height');

const plotTitle3d = document.querySelector('#PlotName3d');
const plotTitle2d = document.querySelector('#PlotName2d');
const battlePlotTitle = document.querySelector('#battlePlotName');

const treeNumber = document.querySelector('#tree-number');
const treeMean = document.querySelector('#tree-mean');
const treeStd = document.querySelector('#tree-std');

const rockNumber = document.querySelector('#rock-number');
const rockMeanHeight = document.querySelector('#rock-mean-height');
const rockMeanWidth = document.querySelector('#rock-mean-width');
const rockStdWidth = document.querySelector('#rock-std-width');
const rockStdHeight = document.querySelector('#rock-std-height');


const landscapeNumber = document.querySelector('#landscape-number');

const battlePlot = document.querySelector('#battle-plot');


plotTitle3d.value = PLOT_TITLE_3D;
plotTitle2d.value = PLOT_TITLE_2D;
battlePlotTitle.value = BATTLE_PLOT_TITLE;

treeMean.value = 250;
treeStd.value = 40;

treeNumber.value = 1;
inputStandardDeviation.value = 200;
rockNumber.value = 1;
rockMeanHeight.value = 200;
rockMeanWidth.value = 250;
rockStdHeight.value = 30;
rockStdWidth.value = 20;

inputArmor.value = 200;
tankWidth.value = 3000;
tankHeight.value = 2500;

const FRONT_WINDOW_SIZE = 600;
const SIDE_WINDOW_SIZE = 850;


let windowWidth = FRONT_WINDOW_SIZE;
const windowHeight = 491;

const target = targetDivWrapper.querySelector('.target');


let targetDisplay = false;

const convertationService = new ConvertationService(windowWidth, windowHeight, tankWidth, tankHeight)




const addTableColumn = document.querySelector('#add-column');
const beginBattleButton = document.querySelector('#battle-button');

const battleWinColor = document.querySelector('#battleWin');
const battleTieColor = document.querySelector('#battleTie');
const battleLoseColor = document.querySelector('#battleLose');


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////         BATTLE       ////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const atgmReloadInput = document.querySelector('#atgm-reload-time');
const atgmAimingInput = document.querySelector('#atgm-aiming-time');
const atgmMissileNumberInput = document.querySelector('#missile-number');
const atgmMissileSpeedInput = document.querySelector('#missile-speed');
const tankReloadInput = document.querySelector('#tank-reload-time');
const tankAimingInput = document.querySelector('#tank-aiming-time');
const tankProjectileSpeedInput = document.querySelector('#projectile-speed');
const tankReactionInput = document.querySelector('#tank-reaction-time');

const battleTankTable = document.querySelector('#tank-table');
const battleAtgmTable = document.querySelector('#atgm-table');


const tankBattleService = new TankBattleService(
    atgmReloadInput, 
    atgmAimingInput ,
    atgmMissileNumberInput,
    atgmMissileSpeedInput,
    tankReloadInput,
    tankAimingInput,
    tankProjectileSpeedInput,
    tankReactionInput,
    battleTankTable,
    battleAtgmTable,
)


const plotService = new PlotService(
    battleLoseColor, 
    battleTieColor, 
    battleWinColor, 
    battlePlot, 
    tankWidth, 
    tankHeight
)
beginBattleButton.addEventListener('click', () => {
    const [X, Y, Z] = tankBattleService.makeOutcomeTable();
    plotService.makeBattlePlot(X, Y, Z);
})


addTableColumn.addEventListener('click', tankBattleService.addColumnToTable)


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


plotTitle3d.addEventListener('change', (e) => {
    PLOT_TITLE_3D = e.target.value;
})

plotTitle2d.addEventListener('change', (e) => {
    PLOT_TITLE_2D = e.target.value;
})

battlePlotTitle.addEventListener('change', (e) => {
    BATTLE_PLOT_TITLE = e.target.value;
})

const colorMapData = [{
    z: z_colormap,
    colorscale: PLOT_COLORMAP !== 'gradient' ? PLOT_COLORMAP : 'Greys',
    type: 'heatmap'
}]

const colorMaplayout = {
    width: 400,
    height: 400,
    title: 'Расцветка',
}

Plotly.newPlot(colorMapPlot, colorMapData, colorMaplayout);

selectColorMap.addEventListener('change', (e) => {
    PLOT_COLORMAP = e.target.value;

    const colorMapData = [{
        z: z_colormap,
        colorscale: PLOT_COLORMAP !== 'gradient' ? PLOT_COLORMAP : summuryColorStack,
        type: 'heatmap'
    }]

    Plotly.newPlot(colorMapPlot, colorMapData, colorMaplayout);


})

const overlay = document.querySelector('.overlay');
const closeModal = document.querySelector('.close-modal');

closeModal.addEventListener('click', () => {
    overlay.classList.add('hidden');
    document.body.style.overflow = 'scroll';
})

infoTip.addEventListener('click', () => {
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
})

const OBSTACLE_NAMES = {
    TREE: 'tree',
    ROCK: 'rock',
}


widthTip.addEventListener('mouseenter', () => {
    testContainer.style.borderBottomColor = 'red';
})

widthTip.addEventListener('mouseleave', () => {
    testContainer.style.borderBottomColor = '#333D79FF';
})

heightTip.addEventListener('mouseenter', () => {
    testContainer.style.borderLeftColor = 'red';
})

heightTip.addEventListener('mouseleave', () => {
    testContainer.style.borderLeftColor = '#333D79FF';
})



targetButton.addEventListener('click', () => {
    target.style.opacity = targetDisplay ? 0 : 1;
    targetDisplay = !targetDisplay;
})

let standardDeviation;

function getBase64(file) {
    const reader = new FileReader();
    reader.onload = function () {
        preview.src = `${reader.result}`;
        ipcRenderer.send('photo-uploaded', reader.result);
    };
    reader.readAsDataURL(file);
    reader.onerror = function (error) {
    };
}


fileInput.addEventListener('change', (e) => {
    message.style.display = "none";
    const photo = e.target.files[0];
    getBase64(photo);

})

ipcRenderer.on('photo-processed', (event, photo) => {
})

const resizeTankWindow = () => {
    const sizeRatio = Number(tankHeight.value) / Number(tankWidth.value);
    windowWidth = windowHeight / sizeRatio;
    testContainer.style.width = `${windowHeight / sizeRatio}px`;

    setTimeout(() => {
        if (test.clientHeight > windowHeight) {
            sizeAlert.style.display = 'block';
        } else {
            if (sizeAlert.style.display === 'block') {
                sizeAlert.style.display = 'none';
            }
        }

        standardDeviation = convertationService.convert_mm_px(Number(inputStandardDeviation.value), tankWidth.value ? tankWidth.value : test.clientWidth, test.clientWidth)

    }, 300)
}
buttonShow.addEventListener('click', () => {

    divStack.map((armor) => {
        armor['hit'] = Number(inputArmor.value) - Number(armor.thickness) > 0 ? 1 : 0;
    })
    resizeTankWindow()

})

dragElement(target)

target.addEventListener('click', (e) => {
    e.stopPropagation()
})

target.addEventListener('mousedown', (e) => {
    e.stopPropagation()
})

let obstacles = [];
let divStack = [];
let observers = [];

const armorService = new ArmorService(divStack)

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////// EXCEL //////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

const excelService = new ExcelService(armorExcelAlert)
downloadArmorExcel.addEventListener('click', () => excelService.exportData(divStack))

//////////////////////////////////////////////////////////////////////////////////////////////////////////

const deleteAllArmor = () => {
    for (let observer of observers) {
        observer.disconnect();
    }
    while (test.childNodes.length !== 1) {
        test.removeChild(test.lastChild);
    }
    divStack = [];
    observers = [];
    armorInfo.innerHTML = '';
    list.replaceChildren();
    uploadArmor.value = '';
}

deleteArmor.addEventListener('click', () => {
    deleteAllArmor();
})

downloadArmor.addEventListener('click', () => {
    const obj = {
        table: divStack,
    };

    const json = JSON.stringify(obj);
    fs.writeFile('armor.json', json, 'utf-8', () => {
        armorAlert.style.display = 'block';

        setTimeout(() => {
            armorAlert.style.display = 'none';
        }, 2000)
    })

})


const getIndex = (parent, child) => {
    return Array.prototype.indexOf.call(parent.children, child);
}

const showArmorInfo = (armor) => {


    armorInfo.innerHTML = `
    
        <div class="armor-info-table">
            <div>${armor.name}</div>
            <div>Толщина - ${armor.thickness} мм</div>
            <div>Высота - ${Math.round(armor.y_top_mm - armor.y_bottom_mm)} мм</div>
            <div>Ширина - ${Math.round(armor.x_right_mm - armor.x_left_mm)} мм</div>
            <div>Пробитие - ${armor.hit === 1 ? 'Да' : 'Нет'}</div>
        </div>
    `

    armorInfo.style.opacity = 1;

}


const range = function(start, stop, step){
    step = step || 1;
    const arr = [];
    for (let i=start;i<stop;i+=step) {
        arr.push(i);
    }
    return arr;
};


//////////////////////////////////////////////////////////////////////////////
///////////////////////////// DOTS //////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

const dropGridDot = (x, y) => {
    let dot = document.createElement('div');
    dot.className = 'dot';
    dot.style.backgroundColor = 'red';
    dot.style.top = `${x}px`;
    dot.style.left = `${y}px`;
    testContainer.appendChild(dot)
}


const makeDotGrid = () => {
    const tank_front_dots_x = range(0, windowWidth, 20)
    const tank_front_dots_y = range(0, windowHeight, 20)

    const front_dots_x = []
    const front_dots_y = []

    for (let x_dot of tank_front_dots_x) {
        for (let y_dot of tank_front_dots_y) {
            front_dots_x.push(x_dot)
            front_dots_y.push(y_dot)
            if (drawDots) {
                dropGridDot(y_dot, x_dot)
            }
        }
    }

    return [front_dots_x, front_dots_y]
}

//////////////////////////////////////////////////////////////////////////////
///////////////////////////// COMPUTE //////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

const analyticComputation = () => {
    const analyticWorker = new Worker("./src/modules/analytic/analytic-compute.worker.js");
    const [front_dots_x, front_dots_y] = makeDotGrid();

    analyticWorker.postMessage([front_dots_x, front_dots_y, Number(standardDeviation), divStack]);
    analyticWorker.onmessage = (e) => {
    plotService.plotResults(
        e.data, 
        plotlyDiv, 
        plotlyDiv2d, 
        windowWidth, 
        windowHeight, 
        fixedProbabilityScale, 
        PLOT_TITLE_3D, 
        PLOT_COLORMAP
    );
    analyticWorker.terminate();
    }
}


const monteCarloComputation = () => {

    const monteCarloWorker = new Worker("worker.js");
     const [front_x_dots, front_y_dots] = makeDotGrid();

    monteCarloWorker.postMessage([front_x_dots, front_y_dots, standardDeviation, divStack, obstacles]);

    monteCarloWorker.onmessage = (e) => {
        plotService.plotResults(
            e.data, 
            monteCarlo3d, 
            monteCarlo2d, 
            windowWidth, 
            windowHeight, 
            fixedProbabilityScale, 
            PLOT_TITLE_3D, 
            PLOT_COLORMAP
        );
        monteCarloWorker.terminate();
    }
}

buttonGrid.addEventListener('click', analyticComputation)
monteCarlo.addEventListener('click', monteCarloComputation)

///////////////////////////////////////////////////////////////////////////////////////

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
            divStack[index].right = (elmnt.offsetLeft - pos1) + divStack[index].width;
            divStack[index].bottom = (elmnt.offsetTop - pos2) + divStack[index].height;

            divStack[index].x_left_mm = convertationService.convert_px_to_mm(elmnt.offsetLeft - pos1, true);
            divStack[index].x_right_mm = convertationService.convert_px_to_mm(elmnt.offsetLeft - pos1, true) +
                convertationService.convert_px_distance_to_mm(divStack[index].width, true);
            divStack[index].y_top_mm = convertationService.convert_px_to_mm(elmnt.offsetTop - pos2, false);
            divStack[index].y_bottom_mm = convertationService.convert_px_to_mm(elmnt.offsetTop - pos2, false) -
                convertationService.convert_px_distance_to_mm(divStack[index].height, false)
        }
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

test.addEventListener('click', (e) => armorService.addNewArmor(e, divStack))
uploadArmor.addEventListener('change', (e) => armorService.uploadArmorFunc(e, divStack))


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////// GENERATE OBSTACLE //////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const generateObstacle = (name=OBSTACLE_NAMES.TREE, draw=true) => {
    let obstacle = document.createElement('div');
    let leftRandom;
    let widthRandom;
    let heightRandom;

    if (name === OBSTACLE_NAMES.TREE) {
        const mean = convertationService.convert_mm_px(Number(treeMean.value), tankWidth.value ? tankWidth.value : test.clientWidth, test.clientWidth);
        const std = convertationService.convert_mm_px(Number(treeStd.value), tankWidth.value ? tankWidth.value : test.clientWidth, test.clientWidth)
        leftRandom = randomInInterval(10, windowWidth - 100)
        widthRandom = gaussianRandom(mean, std);
    } else {
        const meanWidth = convertationService.convert_mm_px(Number(rockMeanWidth.value), tankWidth.value ? tankWidth.value : test.clientWidth, test.clientWidth);
        const stdWidth = convertationService.convert_mm_px(Number(rockStdWidth.value), tankWidth.value ? tankWidth.value : test.clientWidth, test.clientWidth)
        const meanHeight = convertationService.convert_mm_px(Number(rockMeanHeight.value), tankHeight.value ? tankHeight.value : test.clientHeight, test.clientHeight);
        const stdHeight = convertationService.convert_mm_px(Number(rockStdHeight.value), tankHeight.value ? tankHeight.value : test.clientHeight, test.clientHeight)
        leftRandom = randomInInterval(10, windowWidth - (meanWidth))
        widthRandom = gaussianRandom(meanWidth, stdWidth);
        heightRandom = gaussianRandom(meanHeight, stdHeight);
    }


    obstacle.className = 'obstacle-content';
    obstacle.style.left = `${leftRandom}px`;
    obstacle.style.width = `${widthRandom}px`;
    obstacle.style.height = name === OBSTACLE_NAMES.TREE ? `${windowHeight}px` : `${heightRandom}px`;
    obstacle.style.backgroundColor = name === OBSTACLE_NAMES.TREE ? TREE_COLOR : ROCK_COLOR;
    obstacle.style.top = name === OBSTACLE_NAMES.TREE ? '0' : `${(windowHeight - heightRandom)}px`;


    obstacles.push({
        index: obstacles.length,
        height: name === OBSTACLE_NAMES.TREE ? windowHeight : heightRandom,
        width: widthRandom,
        top: name === OBSTACLE_NAMES.TREE ? 0 : (windowHeight - heightRandom),
        left: leftRandom,
    })

    if (draw === true) {
        obstacleWrapper.appendChild(obstacle);
    }
}

const deleteObstacles = () => {
    obstacleWrapper.replaceChildren();
    obstacles = [];
}

const generateNewTerrain = () => {
    deleteObstacles();

    if (Number(treeNumber.value) >= 1 && Number(treeNumber.value) < 11) {
        for (let i = 0; i < Number(treeNumber.value); i++) {
            generateObstacle(OBSTACLE_NAMES.TREE);
        }
    }

    if (Number(rockNumber.value) >= 1 && Number(rockNumber.value) < 11) {
        for (let i = 0; i < Number(rockNumber.value); i++) {
            generateObstacle(OBSTACLE_NAMES.ROCK);
        }
    }
}

obstacleButton.addEventListener('click', generateNewTerrain)
deleteObstacle.addEventListener('click', deleteObstacles)

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const monteCarloSimulation = () => {
    loader.style.display = 'block';
    let summaryProbability = [];
    let workerP = 0;
    let forP = 0;

    const simulationWorker = new Worker("worker.js");
    const [front_x_dots, front_y_dots] = makeDotGrid();

    for (let i = 0; i < Number(landscapeNumber.value); i++) {

        deleteObstacles();

        if (Number(treeNumber.value) >= 1 && Number(treeNumber.value) < 11) {
            for (let k = 0; k < Number(treeNumber.value); k++) {
                generateObstacle(OBSTACLE_NAMES.TREE, false);
            }
        }

        if (Number(rockNumber.value) >= 1 && Number(rockNumber.value) < 11) {
            for (let i = 0; i < Number(rockNumber.value); i++) {
                generateObstacle(OBSTACLE_NAMES.ROCK, false);
            }
        }


        simulationWorker.postMessage([front_x_dots, front_y_dots, standardDeviation, divStack, obstacles]);
        forP += 1;


        simulationWorker.onmessage = (e) => {
            summaryProbability = addTwoArrays(summaryProbability, e.data)
            workerP += 1;

            if (workerP === Number(landscapeNumber.value)) {
                simulationWorker.terminate();
                summaryProbability = summaryProbability.map(e => e / workerP);
                plotService.plotResults(
                    summaryProbability, 
                    monteCarlo3d, 
                    monteCarlo2d, 
                    windowWidth, 
                    windowHeight, 
                    fixedProbabilityScale, 
                    PLOT_TITLE_3D, 
                    PLOT_COLORMAP
                );
                
                loader.style.display = 'none';
            }
        }

    }
}

simulation.addEventListener('click', monteCarloSimulation)


deleteLastArmor.addEventListener('click', () => {
    observers[observers.length - 1].disconnect();
    observers.pop();
    test.removeChild(test.lastChild);
    divStack.pop();
    list.removeChild(list.lastChild);
    uploadArmor.value = '';
})


///////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// COLOR SETTINGS ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////


let percentageColorStack = [0, 100];


const gp = new Grapick({el: gradientPicker});

gp.addHandler(0, 'red');
gp.addHandler(100, 'blue');

gp.getHandler(0).getEl().style.opacity = '0';
gp.getHandler(1).getEl().style.opacity = '0';

gp.addHandler(0, 'red');
gp.addHandler(99, 'blue');

const normalizeColor = (value) => {
    return value / 100;
}

const showColorStack = () => {
    const newPercentageArray = gp.getColorValue().match(/(\d*)%/g);
    percentageColorStack = newPercentageArray.map((e) => normalizeColor(Number(e.replace('%', ''))));
    const newStr = gp.getColorValue().replace(/\d+%/g, '');
    colorStack = newStr.match(/([a-z]+) | (rgba*\(\d*,\s\d*.\s\d*,\s*\d*\)) | (#\w*)/g)

    summuryColorStack = [];
    for (let i = 0; i < colorStack.length; i++) {
        summuryColorStack.push([percentageColorStack[i], colorStack[i]]);
    }

    const colorMapData = [{
        z: z_colormap,
        colorscale: PLOT_COLORMAP !== 'gradient' ? PLOT_COLORMAP : summuryColorStack,
        type: 'heatmap'
    }]

    Plotly.newPlot(colorMapPlot, colorMapData, colorMaplayout);

}

const throttleColorStack = throttle(showColorStack, 1000)

gp.on('change', complete => {
    throttleColorStack();
})

scaleCheckBox.addEventListener('change', (e) => {
    fixedProbabilityScale = e.target.checked;
})

colorCheckBox.addEventListener('change', (e) => {
    autoResizeColorBar = !e.target.checked;
})

dotsCheckBox.addEventListener('change', (e) => {
    drawDots = e.target.checked;
})

saveGradient.addEventListener('click', () => {
    const gradientJson = {
        gradient: summuryColorStack
    }

    const json = JSON.stringify(gradientJson);

    fs.writeFile('gradient.json', json, 'utf-8', () => {
        gradientAlert.style.display = 'block';

        setTimeout(() => {
            gradientAlert.style.display = 'none';
        }, 2000)
    })
})

const handleGradientUpload = (e) => {
    const obj = JSON.parse(e.target.result);
    const gradient = obj.gradient;
    gp.clear();

    gp.addHandler(0, 'blue');
    gp.addHandler(100, 'red');

    gp.getHandler(0).getEl().style.opacity = '0';
    gp.getHandler(1).getEl().style.opacity = '0';

    for (let i = 1; i < gradient.length - 1; i++) {
        gp.addHandler(gradient[i][0]*100, gradient[i][1])
    }

}

uploadGradient.addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onload = handleGradientUpload;
    reader.readAsText(e.target.files[0]);
})



//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// CUSTOM ARMOR ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

const uploadCustomArmor = (photoPath, armorPath, width, height) => {
    deleteAllArmor();
    message.style.display = "none";
    preview.src = photoPath;
    let obj;
    fs.readFile(armorPath, 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);
        const table = obj.table;
        for (let armor of table) {
            armorService.addExistingArmor(armor, divStack);
        }
    });

    tankWidth.value = width;
    tankHeight.value = height;

    resizeTankWindow()
}

mockTank.addEventListener('click', () => {
    uploadCustomArmor(T80_ARMOR.FRONT.PHOTO_PATH, T80_ARMOR.FRONT.ARMOR_PATH, T80_ARMOR.FRONT.WIDTH, T80_ARMOR.FRONT.HEIGHT);

})

setT72FrontArmor.addEventListener('click', () => {
    uploadCustomArmor(T72_ARMOR.FRONT.PHOTO_PATH, T72_ARMOR.FRONT.ARMOR_PATH, T72_ARMOR.FRONT.WIDTH, T72_ARMOR.FRONT.HEIGHT);
})

setT72SideArmor.addEventListener('click', () => {
    uploadCustomArmor(T72_ARMOR.SIDE.PHOTO_PATH, T72_ARMOR.SIDE.ARMOR_PATH, T72_ARMOR.SIDE.WIDTH, T72_ARMOR.SIDE.HEIGHT);
})

setT80FrontArmor.addEventListener('click', () => {
    uploadCustomArmor(T80_ARMOR.FRONT.PHOTO_PATH, T80_ARMOR.FRONT.ARMOR_PATH, T80_ARMOR.FRONT.WIDTH, T80_ARMOR.FRONT.HEIGHT);
})

setT80SideArmor.addEventListener('click', () => {
    uploadCustomArmor(T80_ARMOR.SIDE.PHOTO_PATH, T80_ARMOR.SIDE.ARMOR_PATH, T80_ARMOR.SIDE.WIDTH, T80_ARMOR.SIDE.HEIGHT);
})

setAbramsFrontArmor.addEventListener('click', () => {
    uploadCustomArmor(ABRAMS_ARMOR.FRONT.PHOTO_PATH, ABRAMS_ARMOR.FRONT.ARMOR_PATH, ABRAMS_ARMOR.FRONT.WIDTH, ABRAMS_ARMOR.FRONT.HEIGHT);
})

setAbramsSideArmor.addEventListener('click', () => {
    uploadCustomArmor(ABRAMS_ARMOR.SIDE.PHOTO_PATH, ABRAMS_ARMOR.SIDE.ARMOR_PATH, ABRAMS_ARMOR.SIDE.WIDTH, ABRAMS_ARMOR.SIDE.HEIGHT);
})

setLeopardFrontArmor.addEventListener('click', () => {
    uploadCustomArmor(LEOPARD_ARMOR.FRONT.PHOTO_PATH, LEOPARD_ARMOR.FRONT.ARMOR_PATH, LEOPARD_ARMOR.FRONT.WIDTH, LEOPARD_ARMOR.FRONT.HEIGHT);
})

setLeopardSideArmor.addEventListener('click', () => {
    uploadCustomArmor(LEOPARD_ARMOR.SIDE.PHOTO_PATH, LEOPARD_ARMOR.SIDE.ARMOR_PATH, LEOPARD_ARMOR.SIDE.WIDTH, LEOPARD_ARMOR.SIDE.HEIGHT);
})

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////