const { gaussianRandom, randomInInterval } = require('../../utils/math')

class ObstaclesService {
    constructor(convertationService) {
        this.convertationService = convertationService
    }

    generateObstacle(name=OBSTACLE_NAMES.TREE, draw=true) {
        let obstacle = document.createElement('div');
        let leftRandom;
        let widthRandom;
        let heightRandom;
    
        if (name === OBSTACLE_NAMES.TREE) {
            const mean = this.convertationService.convert_mm_px(Number(treeMean.value), tankWidth.value ? tankWidth.value : test.clientWidth, test.clientWidth);
            const std = this.convertationService.convert_mm_px(Number(treeStd.value), tankWidth.value ? tankWidth.value : test.clientWidth, test.clientWidth)
            leftRandom = randomInInterval(10, windowWidth - 100)
            widthRandom = gaussianRandom(mean, std);
        } else {
            const meanWidth = this.convertationService.convert_mm_px(Number(rockMeanWidth.value), tankWidth.value ? tankWidth.value : test.clientWidth, test.clientWidth);
            const stdWidth = this.convertationService.convert_mm_px(Number(rockStdWidth.value), tankWidth.value ? tankWidth.value : test.clientWidth, test.clientWidth)
            const meanHeight = this.convertationService.convert_mm_px(Number(rockMeanHeight.value), tankHeight.value ? tankHeight.value : test.clientHeight, test.clientHeight);
            const stdHeight = this.convertationService.convert_mm_px(Number(rockStdHeight.value), tankHeight.value ? tankHeight.value : test.clientHeight, test.clientHeight)
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
    
    deleteObstacles() {
        obstacleWrapper.replaceChildren();
        obstacles = [];
    }
    
    generateNewTerrain() {
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
}