'use strict';

const {ipcRenderer} = require('electron');
const fs = require('fs');
const xl = require('excel4node');

let colorStack = ['red', 'blue'];
let summuryColorStack = [[0.0, 'red'], [1.0, 'blue']];
const z_colormap = [[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51], [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52], [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53], [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54], [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55], [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56], [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57], [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58], [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59], [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60], [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61], [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62], [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63], [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64], [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65], [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66], [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67], [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68], [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69], [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70], [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], [23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72], [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73], [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74], [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75], [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76], [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77], [29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78], [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79], [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80], [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81], [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82], [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83], [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84], [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85], [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86], [38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87], [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88], [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89], [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90], [42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91], [43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92], [44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93], [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94], [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95], [47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96], [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97], [49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98], [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99], [51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]];
const landscapesTank = ['firstTank', 'secondTank', 'thirdTank', 'forthTank', 'fifthTank', 'sixTank', 'sevenTank', 'eightTank'];
const landscapesAtgm = ['firstAtgm', 'secondAtgm', 'thirdAtgm', 'forthAtgm', 'fifthAtgm', 'sixAtgm', 'sevenAtgm', 'eightAtgm'];

const MAIN_COLOR = '#333D79FF';
const SECONDARY_COLOR = '#FAEBEFFF';
const TREE_COLOR = `rgba(147, 28, 12, 0.66)`;
const ROCK_COLOR = `rgba(37, 108, 199, 0.55)`
let PLOT_COLORMAP = 'RdBu';
let PLOT_TITLE_3D = 'Вероятность поражения танка'
let PLOT_TITLE_2D =  'Вероятность поражения в картинной плоскости'


const infoTip = document.querySelector('.info-tip');
const button = document.querySelector('.drop1');
const buttonDropHundred = document.querySelector('.drop100');
const buttonReset = document.querySelector('.reset');
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

const analyticsTab = document.querySelector('#analytics-mode');
const monteCarloTab = document.querySelector('#monte-carlo-mode');
const battleTab = document.querySelector('#battle-mode');
const otherTab = document.querySelector('#other-mode');
const settingsTab = document.querySelector('#settings-mode');

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

const atgmReloadInput = document.querySelector('#atgm-reload-time');
const atgmAimingInput = document.querySelector('#atgm-aiming-time');
const atgmMissileNumberInput = document.querySelector('#missile-number');
const atgmMissileSpeedInput = document.querySelector('#missile-speed');


atgmReloadInput.value = 15;
atgmAimingInput.value = 5;
atgmMissileNumberInput.value = 4;
atgmMissileSpeedInput.value = 200;

const tankReloadInput = document.querySelector('#tank-reload-time');
const tankAimingInput = document.querySelector('#tank-aiming-time');
const tankProjectileSpeedInput = document.querySelector('#projectile-speed');
const tankReactionInput = document.querySelector('#tank-reaction-time');

tankReloadInput.value = 8;
tankAimingInput.value = 5;
tankProjectileSpeedInput.value = 800;
tankReactionInput.value = 2;


plotTitle3d.value = PLOT_TITLE_3D
plotTitle2d.value = PLOT_TITLE_2D

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
const targetSigma1 = document.querySelector('#target-sigma1')
const targetSigma2 = document.querySelector('#target-sigma2')

let targetDisplay = false;


const monteCarloPlots = document.querySelector('#monte-carlo-plots');
const analyticsPlots = document.querySelector('#analytics-plots');
const battlePlots = document.querySelector('#battle-plots');
const otherPlots = document.querySelector('#other-plots');
const settings = document.querySelector('#settings');

const battleTankTable = document.querySelector('#tank-table');
const battleAtgmTable = document.querySelector('#atgm-table');
const battleResultTable = document.querySelector('#result-table');


const addTableRow = document.querySelector('#add-row');
const deleteTableRow = document.querySelector('#delete-row');
const addTableColumn = document.querySelector('#add-column');
const getData = document.querySelector('#get-data');
const beginBattleButton = document.querySelector('#battle-button');

const battleWinColor = document.querySelector('#battleWin');
const battleTieColor = document.querySelector('#battleTie');
const battleLoseColor = document.querySelector('#battleLose');

const makeid = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

let tankData = {
    "1": {
        "500": 0.59,
        "1000": 0.12,
        "1500": 0.035,
        "2000": 0.02,
    },
    "2": {
        "500": 0.54,
        "1000": 0.1,
        "1500": 0.02,
        "2000": 0.008,
    },
    "3": {
        "500": 0.45,
        "1000": 0.07,
        "1500": 0.01,
        "2000": 0.008,
    }
}

let atgmData = {
    "1": {
        "500": 0.63,
        "1000": 0.33,
        "1500": 0.182,
        "2000": 0.1,
    },
    "2": {
        "500": 0.57,
        "1000": 0.28,
        "1500": 0.14,
        "2000": 0.08,
    },
    "3": {
        "500": 0.52,
        "1000": 0.23,
        "1500": 0.11,
        "2000": 0.09,
    },
}


const calculateBattle = (atgmProbability=0.2, tankProbability=0.2, distance=500, landscape=1) => {

    let time = -0.1;
    let atgmMissileNumber = Number(atgmMissileNumberInput.value)

    let confidenceProbabilityAtgm = 0;
    let confidenceProbabilityTank = 0;

    let probabilityValueAtgm = atgmProbability;
    let probabilityValueTank = tankProbability;

    let atgmMissileSpeed = Number(atgmMissileSpeedInput.value);
    let tankProjectileSpeed = Number(tankProjectileSpeedInput.value);

    let atgmReloadTime = Number(atgmReloadInput.value) + Number(atgmAimingInput.value);
    let tankReloadTime = Number(tankReloadInput.value) + Number(tankAimingInput.value);


    let atgmReload = atgmReloadTime + 1;
    let tankReload = tankReloadTime + 1;

    let atgmFire = false;
    let tankFire = false;

    let atgmMissileFlightTime = distance / atgmMissileSpeed;
    let tankProjectileFlightTime = distance / tankProjectileSpeed;

    let atgmMissileFlight = 0;
    let tankProjectileFlight = 0;

    let firstMissileHit = false;
    let tankReactionTime = Number(tankReactionInput.value);
    let tankReactionTimer = false;

    let step = 0.1;

    while (true) {
        time += step;
        time = Math.round(time * 100) / 100;


        if (tankReactionTimer) {
            tankReactionTime -= step;
        }

        if (atgmReload >= atgmReloadTime && atgmFire === false && atgmMissileNumber !== 0) {
            atgmMissileNumber -= 1;
            atgmFire = true;
            atgmReload = 0;
            atgmMissileFlight = 0;
        } else {
            if (atgmFire === false) {
                atgmReload += step;
            }
        }

        if (firstMissileHit === true && tankReactionTime <= 0) {
            if (tankReload >= tankReloadTime && tankFire === false) {
                tankFire = true;
                tankReactionTimer = false;
                tankReload = 0;
                tankProjectileFlight = 0;
            } else {
                if (tankFire === false) {
                    tankReload += step;
                }
            }
        }

        if (atgmFire) {
            if (atgmMissileFlight >= atgmMissileFlightTime) {

                if (firstMissileHit === false) {
                    firstMissileHit = true;
                    tankReactionTimer = true;
                }

                if (atgmMissileNumber === 0) {
                    return 0
                }

                atgmFire = false;
                confidenceProbabilityAtgm += probabilityValueAtgm;

            } else {
                atgmMissileFlight += step;
                atgmReload += step;
            }
        }

        if (tankFire) {
            if (tankProjectileFlight >= tankProjectileFlightTime) {
                tankFire = false;
                confidenceProbabilityTank += probabilityValueTank;
            } else {
                tankProjectileFlight += step;
                tankReload += step;
            }
        }

        if (confidenceProbabilityAtgm >= 0.95 && confidenceProbabilityTank >= 0.95) {
            return 0
        }

        if (confidenceProbabilityAtgm >= 0.95) {
            if (tankProjectileFlight >= tankProjectileFlightTime) {
                return 1
            }
            return 1
        }

        if (confidenceProbabilityTank >= 0.95) {
            if (atgmMissileFlight >= atgmMissileFlightTime) {
                return -1
            }
            return -1
        }

    }
}

const makeOutcomeTable = (atgmTable, tankTable) => {
    let outcomeTable = {};

    let X = [];
    let Y = [];
    let Z = [];

    for (let tankProperty in tankTable) {
        outcomeTable[tankProperty] = {};
        for (let valueProperty in tankTable[tankProperty]) {
            let outcome = calculateBattle(atgmTable[tankProperty][valueProperty], tankTable[tankProperty][valueProperty], Number(valueProperty), Number(tankProperty));
            X.push(Number(tankProperty));
            Y.push(Number(valueProperty));
            outcomeTable[tankProperty][valueProperty] = outcome;

        }
    }

    for (let outcomeProperty in outcomeTable['1']) {
        for (let outcomeFirstProperty in outcomeTable) {
            Z.push(outcomeTable[outcomeFirstProperty][outcomeProperty])
        }
    }

    return [outcomeTable, X, Y, Z]
}

const make_battle_plot = (outcomeTable, X, Y, Z) => {

    let z = [];

    while (Z.length) z.push(Z.splice(0, Object.keys(tankData).length))

    // console.log(Array.from(new Set(X)))
    // console.log(Array.from(new Set(Y)))
    // console.log(z)

    // console.log(z)

    let data = {
            type: 'surface',
            x: Array.from(new Set(X)),
            y: Array.from(new Set(Y)),
            z: z,
            cmax: 1,
            cmin: -1,
            opacity:1,
            colorscale: [[0, `${battleLoseColor.value}`],
                [0.45, `${battleLoseColor.value}`],
                [0.45, `${battleTieColor.value}`],
                [0.55, `${battleTieColor.value}`],
                [0.55, `${battleWinColor.value}`],
                [1, `${battleWinColor.value}`]],
            contours: {
                "x": {
                    "show": true,
                },
                "y": {
                    "show": true,
                }
            },
        };

    // console.log(Array.from(new Set(Y)).length)

    let layout = {
        scene: {
            aspectratio: {
                "x": 1,
                "y": 1,
                "z": 0.5
            },
            xaxis: {
                title: "Число помех на 1000м2",
                tickmode: 'array',
                tickvals: Array.from(new Set(X)),
                ticktext: Array.from(new Set(X)),
                // range: [Array.from(new Set(X))[0], Array.from(new Set(X))[Array.from(new Set(X)).length - 1]],
                // nticks: Array.from(new Set(X)).length,
                // dtick: 500
            },
            yaxis: {
                title: "Дистанция",
                range: [Array.from(new Set(Y))[0], Array.from(new Set(Y))[Array.from(new Set(Y)).length - 1]],
                nticks: Array.from(new Set(Y)).length,
            },
            zaxis: {
                title: "Исход",
                range: [-1, 1],
                dtick: 1
            }
        },
        title: {
            text: "Исход сражения"
        }
    }

    Plotly.newPlot(battlePlot, [data], layout);
}

beginBattleButton.addEventListener('click', () => {
    const atgmDataTable = getDataFromTable(atgmTable, 'Atgm');
    const tankDataTable = getDataFromTable(tankTable, 'Tank');
    const [outcomeTable, X, Y, Z] = makeOutcomeTable(atgmDataTable, tankDataTable);
    make_battle_plot(outcomeTable, X, Y, Z);
})


let tableTankData = [
    {distanceTank:'', firstTank:"1", secondTank:'2', thirdTank:'3', forthTank: '', fifthTank: '', sixTank: '', sevenTank: '', eightTank: ''},
    {distanceTank:'500', firstTank:"0.59", secondTank:'0.54', thirdTank:"0.45", forthTank: '', fifthTank: '', sixTank: '', sevenTank: '', eightTank: ''},
    {distanceTank:'1000', firstTank:"0.12", secondTank:'0.1', thirdTank:"0.07", forthTank: '', fifthTank: '', sixTank: '', sevenTank: '', eightTank: ''},
    {distanceTank:'1500', firstTank:"0.035", secondTank:'0.03', thirdTank:"0.02", forthTank: '', fifthTank: '', sixTank: '', sevenTank: '', eightTank: ''},
    {distanceTank:'2000', firstTank:"0.02", secondTank:'0.012', thirdTank:"0.008", forthTank: '', fifthTank: '', sixTank: '', sevenTank: '', eightTank: ''},
];

let tableAtgmData = [
    {distanceAtgm:'', firstAtgm:"1", secondAtgm:'2', thirdAtgm:'3', forthAtgm: '', fifthAtgm: '', sixAtgm: '', sevenAtgm: '', eightAtgm: ''},
    {distanceAtgm:'500', firstAtgm:"", secondAtgm:'', thirdAtgm:"", forthAtgm: '', fifthAtgm: '', sixAtgm: '', sevenAtgm: '', eightAtgm: ''},
    {distanceAtgm:'1000', firstAtgm:"", secondAtgm:'', thirdAtgm:"", forthAtgm: '', fifthAtgm: '', sixAtgm: '', sevenAtgm: '', eightAtgm: ''},
    {distanceAtgm:'1500', firstAtgm:"", secondAtgm:'', thirdAtgm:"", forthAtgm: '', fifthAtgm: '', sixAtgm: '', sevenAtgm: '', eightAtgm: ''},
    {distanceAtgm:'2000', firstAtgm:"", secondAtgm:'', thirdAtgm:"", forthAtgm: '', fifthAtgm: '', sixAtgm: '', sevenAtgm: '', eightAtgm: ''},
];

const defaultTankColumns = [
    {title: '-', field: 'distanceTank', editor: 'input'},
    {title: '-', field: 'firstTank', editor: 'input'},
    {title: '-', field: 'secondTank', editor: 'input'},
    {title: '-', field: 'thirdTank', editor: 'input'},
    {title: '-', field: 'forthTank', editor: 'input'},
    {title: '-', field: 'fifthTank', editor: 'input'},
    {title: '-', field: 'sixTank', editor: 'input'},
    {title: '-', field: 'sevenTank', editor: 'input'},
    {title: '-', field: 'eightTank', editor: 'input'},
]

const defaultAtgmColumns = [
    {title: '-', field: 'distanceAtgm', editor: 'input'},
    {title: '-', field: 'firstAtgm', editor: 'input'},
    {title: '-', field: 'secondAtgm', editor: 'input'},
    {title: '-', field: 'thirdAtgm', editor: 'input'},
    {title: '-', field: 'forthAtgm', editor: 'input'},
    {title: '-', field: 'fifthAtgm', editor: 'input'},
    {title: '-', field: 'sixAtgm', editor: 'input'},
    {title: '-', field: 'sevenAtgm', editor: 'input'},
    {title: '-', field: 'eightAtgm', editor: 'input'},
]

//define table
let tankTable = new Tabulator(battleTankTable, {
    data:tableTankData,
    columns: defaultTankColumns,
});

let atgmTable = new Tabulator(battleAtgmTable, {
    data:tableAtgmData,
    columns: defaultAtgmColumns,
});

// let resultTable = new Tabulator(battleResultTable, {
//     data:tabledata,
//     columns: defaultColumns,
// });

getData.addEventListener('click', () => {
    let result = getDataFromTable(atgmTable, 'Atgm')
    // console.log(result)
})

const getDataFromTable = (table, mode) => {
    let data = table.getData();
    let result = {}
    let landscapes = mode === 'Tank' ? landscapesTank : landscapesAtgm
    for (let landscape of landscapes) {
        if (data['0'][`${landscape}`] !== "") {
            result[`${data['0'][`${landscape}`]}`] = {}
        }
    }

    // console.log(result);

    for (let property in data) {
        if (property !== "0") {
            let i = -1;
            for (let resultProperty in result) {
                i++;
                if (Number(data[property][landscapes[i]]) === 0) {
                    continue
                }
                result[resultProperty][data[property][`distance${mode}`]] = Number(data[property][landscapes[i]]);
            }
        }
    }

    return result
}



addTableRow.addEventListener('click', () => {
    tankTable.addRow({});
    atgmTable.addRow({});

})

deleteTableRow.addEventListener('click', () => {
    // tankTable.deleteRow(tankTable.getData().length - 1)
    tankTable.deleteRow(1)
    atgmTable.deleteRow(1)
})

addTableColumn.addEventListener('click', () => {
    let newTankStringField = makeid(6);
    let newAtgmStringField = makeid(6);


    tankTable.addColumn({title:"-", field:newTankStringField, editor: "input"}, false);
    atgmTable.addColumn({title:"-", field:newAtgmStringField, editor: "input"}, false);
    // resultTable.addColumn({title:"-", field:newStringField, editor: "input"}, false);

})







plotTitle3d.addEventListener('change', (e) => {
    PLOT_TITLE_3D = e.target.value;
})

plotTitle2d.addEventListener('change', (e) => {
    PLOT_TITLE_2D = e.target.value;
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

// TABS

const tabsArray = [
    {
        tab: analyticsTab,
        plot: analyticsPlots,
    },
    {
        tab: monteCarloTab,
        plot: monteCarloPlots,
    },
    {
        tab: battleTab,
        plot: battlePlots,
    },
    {
        tab: otherTab,
        plot: otherPlots,
    },
    {
        tab: settingsTab,
        plot: settings,
    }
];

const changeTab = (tab_value) => {
    for (let tab of tabsArray) {
        if (tab.tab === tab_value) {
            tab.tab.style.backgroundColor = 'white';
            tab.tab.style.color = MAIN_COLOR;
            tab.plot.style.display = 'flex';
        } else {
            tab.tab.style.backgroundColor = MAIN_COLOR;
            tab.tab.style.color = 'white';
            tab.plot.style.display = 'none';
        }
    }
}




analyticsTab.addEventListener('click', () => {
    changeTab(analyticsTab)
    target.style.display = 'none';
})

monteCarloTab.addEventListener('click', () => {
    changeTab(monteCarloTab)
    target.style.display = 'none';
})

battleTab.addEventListener('click', () => {
    changeTab(battleTab)
    target.style.display = 'none';
})

otherTab.addEventListener('click', () => {
    changeTab(otherTab)
    target.style.display = 'flex';
})

settingsTab.addEventListener('click', () => {
    changeTab(settingsTab);
    target.style.display = 'none';
})





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

const convert_mm_px = (mmValue, mmParameter, pxParameter) => {
    return (mmValue / mmParameter) * pxParameter
}

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

buttonShow.addEventListener('click', () => {

    divStack.map((armor) => {
        armor['hit'] = Number(inputArmor.value) - Number(armor.thickness) > 0 ? 1 : 0;
    })

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

        standardDeviation = convert_mm_px(Number(inputStandardDeviation.value), tankWidth.value ? tankWidth.value : test.clientWidth, test.clientWidth)

    }, 300)

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
const stack = [];
let observers = [];

downloadArmorExcel.addEventListener('click', () => {
    const divStackList = ["x_left_mm", "x_right_mm", "y_top_mm", "y_bottom_mm", "thickness"];

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Sheet 1');

    ws.cell(1,1).string('X-Лев');
    ws.cell(1,2).string('X-Прав');
    ws.cell(1,3).string('Y-Вверх');
    ws.cell(1,4).string('Y-Низ');
    ws.cell(1,5).string('Толщина');

    for (let i = 0; i < divStack.length; i++) {
        for (let j = 0; j < 5; j++) {
            ws.cell(i+2, j+1).number(divStack[i][divStackList[j]])
        }
    }

    wb.write('armor_excel.xlsx', () => {
        armorExcelAlert.style.display = 'block';

        setTimeout(() => {
            armorExcelAlert.style.display = 'none';
        }, 2000)
    });
})

deleteArmor.addEventListener('click', () => {
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
    deleteAllArmorChart(chart);

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



const ctx = document.querySelector('.plot');
const canvas = ctx.querySelector('#canvas');



const getIndex = (parent, child) => {
    return Array.prototype.indexOf.call(parent.children, child);
}

const showArmorInfo = (armor) => {


    armorInfo.innerHTML = `
    
        <div class="armor-info-table">
            <div>${armor.name}</div>
            <div>Толщина - ${armor.thickness} мм</div>
            <div>Высота - ${armor.height} px</div>
            <div>Ширина - ${armor.width} px</div>
            <div>Пробитие - ${armor.hit === 1 ? 'Да' : 'Нет'}</div>
        </div>
    `

    armorInfo.style.opacity = 1;

}


// PLOT DATA

const addData = (chart, label, data) => {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

const deleteAllArmorChart = (chart) => {
    chart.data.labels = [];
    chart.data.datasets = [];
    chart.update();
}

const deleteLastArmorChart = (chart) => {
    chart.data.labels.pop();
    chart.data.datasets.pop();
    chart.update();
}

const updateData = (chart, label) => {
    let index = chart.data.labels.indexOf(label);
    chart.data.datasets[0].data[index] += 1;
    chart.update();
}

const clearAllData = (chart) => {
    chart.data.datasets[0].data = chart.data.datasets[0].data.map(() => 0)
    chart.update();
}


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
    return new Promise(function (resolve) {
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

const plotResults = (resultArray, threeDimDiv, twoDimDiv) => {

    const dot_width = tankWidth.value ? Number(tankWidth.value) : windowWidth;
    const dot_height = tankHeight.value ? Number(tankHeight.value) : windowHeight;

    let x_step = windowWidth / 20
    let x = range(0, dot_width, dot_width / x_step);
    let y = range(0, dot_height, dot_height / 25);

    let z = [];

    let layout = {
        title: PLOT_TITLE_3D,
        scene: {
            zaxis: {
                title: 'P',
                range: fixedProbabilityScale ? [0, 1] : 'none',
            },
            camera: {
                eye: {
                    x: 1.86, y: 0.88, z: -0.64}}},
        width: 500,
        height: 500,

    };




    while (resultArray.length) z.push(resultArray.splice(0, 25))
    z = z[0].map((_, colIndex) => z.map(row => row[colIndex]));
    z = z.reverse();


    let layout2d = {
        title: PLOT_TITLE_2D,
    }

    let data2d = [
        {
            z: z,
            x: x,
            y: y,
            zauto: autoResizeColorBar,
            zmax: 1,
            zmin: 0,
            type: 'heatmap',
            hoverongaps: false,
            colorscale: PLOT_COLORMAP !== 'gradient' ? PLOT_COLORMAP : summuryColorStack,
        }
    ];


    Plotly.newPlot(twoDimDiv, data2d, layout2d, {displayModeBar: false});

    const data_z = {
        x: x,
        y:y,
        z: z,
        cauto: autoResizeColorBar,
        cmax: 1,
        cmin: 0,
        opacity:1,
        type: 'surface',
        colorscale: PLOT_COLORMAP !== 'gradient' ? PLOT_COLORMAP : summuryColorStack,
    };
    Plotly.newPlot(threeDimDiv, [data_z], layout);
}


const analyticComputation = () => {
    // todo optimize

    const [front_dots_x, front_dots_y] = makeDotGrid();

    computeProbability(front_dots_x, front_dots_y, Number(standardDeviation)).then((result) => {
        plotResults(result, plotlyDiv, plotlyDiv2d);

    })
}

let myWorker;

const monteCarloComputation = () => {

    myWorker = new Worker("worker.js");
     const [front_x_dots, front_y_dots] = makeDotGrid();

    myWorker.postMessage([front_x_dots, front_y_dots, standardDeviation, divStack, obstacles]);

    myWorker.onmessage = (e) => {
        plotResults(e.data, monteCarlo3d, monteCarlo2d);
        myWorker.terminate();
    }
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


const dropDot = () => {

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
buttonGrid.addEventListener('click', analyticComputation)
monteCarlo.addEventListener('click', () => {
    monteCarloComputation(false);
})



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

            divStack[index].x_left_mm = convert_px_to_mm(elmnt.offsetLeft - pos1, true);
            divStack[index].x_right_mm = convert_px_to_mm(elmnt.offsetLeft - pos1, true) +
                convert_px_distance_to_mm(divStack[index].width, true);
            divStack[index].y_top_mm = convert_px_to_mm(elmnt.offsetTop - pos2, false);
            divStack[index].y_bottom_mm = convert_px_to_mm(elmnt.offsetTop - pos2, false) -
                convert_px_distance_to_mm(divStack[index].height, false)
        }
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

const convert_px_to_mm = (px, left=true) => {
    let mmSize;

    if (left) {
        mmSize = (px / windowWidth) * Number(tankWidth.value);
    } else {
        mmSize = Number(tankHeight.value) - ((px / windowHeight) * Number(tankHeight.value));
    }

    return mmSize
}

const convert_px_distance_to_mm = (px, left=true) => {
    let mmDistance;

    if (left) {
        mmDistance = (px * Number(tankWidth.value)) / windowWidth;
    } else {
        mmDistance = (px * Number(tankHeight.value)) / windowHeight;
    }
    return mmDistance;
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
        index: divStack.length,
        name: `delta_${divStack.length+1}`,
        thickness: 100,
        hit: 1,
        height: 100,
        width: 200,
        top: e.offsetY,
        left: e.offsetX,
        x_left_mm: convert_px_to_mm(e.offsetX, true),
        x_right_mm: convert_px_to_mm(e.offsetX, true) + convert_px_distance_to_mm(200, true),
        y_top_mm: convert_px_to_mm(e.offsetY, false),
        y_bottom_mm: convert_px_to_mm(e.offsetY, false) - convert_px_distance_to_mm(100, false),
    })


    showArmorInfo(divStack[divStack.length - 1])

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

    listItem.addEventListener('click', () => {
        let index = getIndex(list, listItem)
        showArmorInfo(divStack[index])
    })

    list.appendChild(listItem)

    // const armorTableRow = document.createElement('div');
    // armorTableRow.classList.add('')



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

            showArmorInfo(divStack[index])


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
        observers.push(resizeObserver);
    };

    onresize(content, function () {
        let index = Array.prototype.indexOf.call(test.children, content);
        divStack[index].height = content.offsetHeight;
        divStack[index].width = content.offsetWidth;
        divStack[index].bottom = content.offsetHeight + divStack[index].top;
        divStack[index].right = divStack[index].left + content.offsetWidth;
        divStack[index].x_right_mm = divStack[index].x_left_mm + convert_px_distance_to_mm(content.offsetWidth, true);
        divStack[index].y_bottom_mm = divStack[index].y_top_mm - convert_px_distance_to_mm(content.offsetHeight, false);
    });


    content.addEventListener('click', (e) => {
        e.stopPropagation()
    })

    content.addEventListener('mousedown', (e) => {
        e.stopPropagation()
    })

    test.appendChild(content)
    // console.log(divStack);

})



const addContent = (armor) => {
    let content = document.createElement('div');

    divStack.push({
        index: armor.index,
        name: armor.name,
        thickness: armor.thickness,
        hit: armor.hit,
        height: armor.height,
        width: armor.width,
        top: armor.top,
        left: armor.left,
        x_left_mm: convert_px_to_mm(armor.left, true),
        x_right_mm: convert_px_to_mm(armor.left, true) + convert_px_distance_to_mm(armor.width, true),
        y_top_mm: convert_px_to_mm(armor.top, false),
        y_bottom_mm: convert_px_to_mm(armor.top, false) - convert_px_distance_to_mm(armor.height, false)
    })

    addData(chart, `delta_${divStack.length}`, 0)

    content.className = 'content';
    content.style.top = `${armor.top}px`;
    content.style.left = `${armor.left}px`;
    content.style.width = `${armor.width}px`;
    content.style.height = `${armor.height}px`;
    content.style.overflow = 'hidden';
    content.style.resize = 'both';
    content.innerHTML = '' +
        '<div class="dragHeader">' +
        '<div class="dragHeaderCircle"></div>' +
        '<div class="dragHeaderCircle"></div>' +
        '<div class="dragHeaderCircle"></div>' +
        '</div>' +
        '<div class="contentValue">' +
        `<span class="delta">&#948;<span class="index">${divStack.length}</span> = </span>` +
        '<div class="value">100</div>' +
        '<input class="input"/>' +
        '<span class="delta">mm</span>' +
        '</div>'



    showArmorInfo(divStack[divStack.length-1])

    let contentValue = content.querySelector('.contentValue')
    let input = contentValue.querySelector('.input')
    let value = contentValue.querySelector('.value')

    value.innerHTML = `${armor.thickness}`;

    if (Number(value.innerHTML) > 500) {
        content.style.backgroundColor = `rgba(255, ${255-((Number(value.innerHTML)-500)/500*255)}, 0, 0.8)`
    } else {
        content.style.backgroundColor = `rgba(${Number(value.innerHTML)/500*255}, 255, 0, 0.8)`
    }

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

    listItem.addEventListener('click', () => {
        let index = getIndex(list, listItem)
        showArmorInfo(divStack[index])
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

            showArmorInfo(divStack[index])


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
        observers.push(resizeObserver);

    };

    onresize(content, function () {
        let index = Array.prototype.indexOf.call(test.children, content);
        divStack[index].height = content.offsetHeight;
        divStack[index].width = content.offsetWidth;
        divStack[index].bottom = content.offsetHeight + divStack[index].top;
        divStack[index].right = divStack[index].left + content.offsetWidth;

        divStack[index].x_right_mm = divStack[index].x_left_mm + convert_px_distance_to_mm(content.offsetWidth, true);
        divStack[index].y_bottom_mm = divStack[index].y_top_mm - convert_px_distance_to_mm(content.offsetHeight, false);
    });


    content.addEventListener('click', (e) => {
        e.stopPropagation()
    })

    content.addEventListener('mousedown', (e) => {
        e.stopPropagation()
    })

    test.appendChild(content)
}

const handleArmorLoad = (e) => {
    const obj = JSON.parse(e.target.result);
    const table = obj.table;
    for (let armor of table) {
        addContent(armor);
    }
}
uploadArmor.addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onload = handleArmorLoad;
    reader.readAsText(e.target.files[0]);
})

const randomInInterval = (max, min=0) => {
    return Math.floor((Math.random() * (max - min)) + min);
}

const generateObstacle = (name=OBSTACLE_NAMES.TREE, draw=true) => {
    let obstacle = document.createElement('div');
    let leftRandom;
    let widthRandom;
    let heightRandom;

    if (name === OBSTACLE_NAMES.TREE) {
        const mean = convert_mm_px(Number(treeMean.value), tankWidth.value ? tankWidth.value : test.clientWidth, test.clientWidth);
        const std = convert_mm_px(Number(treeStd.value), tankWidth.value ? tankWidth.value : test.clientWidth, test.clientWidth)
        leftRandom = randomInInterval(10, windowWidth - 100)
        widthRandom = gaussianRandom(mean, std);
    } else {
        const meanWidth = convert_mm_px(Number(rockMeanWidth.value), tankWidth.value ? tankWidth.value : test.clientWidth, test.clientWidth);
        const stdWidth = convert_mm_px(Number(rockStdWidth.value), tankWidth.value ? tankWidth.value : test.clientWidth, test.clientWidth)
        const meanHeight = convert_mm_px(Number(rockMeanHeight.value), tankHeight.value ? tankHeight.value : test.clientHeight, test.clientHeight);
        const stdHeight = convert_mm_px(Number(rockStdHeight.value), tankHeight.value ? tankHeight.value : test.clientHeight, test.clientHeight)
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

obstacleButton.addEventListener('click', (e) => {
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

})

deleteObstacle.addEventListener('click', () => {
    deleteObstacles();
})

const addTwoArrays = (a, b) => {
    if (a.length === 0 || b.length === 0) {
        return a.length === 0 ? b : a
    }

    return a.map((e, i) => e + b[i])
}

let mySecondWorker;
simulation.addEventListener('click', () => {
    loader.style.display = 'block';
    let summaryProbability = [];
    let workerP = 0;
    let forP = 0;

    mySecondWorker = new Worker("worker.js");
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


        mySecondWorker.postMessage([front_x_dots, front_y_dots, standardDeviation, divStack, obstacles]);
        forP += 1;


        mySecondWorker.onmessage = (e) => {
            summaryProbability = addTwoArrays(summaryProbability, e.data)
            workerP += 1;

            if (workerP === Number(landscapeNumber.value)) {
                mySecondWorker.terminate();
                summaryProbability = summaryProbability.map(e => e / workerP);
                plotResults(summaryProbability, monteCarlo3d, monteCarlo2d)
                loader.style.display = 'none';
            }
        }

    }

})


deleteLastArmor.addEventListener('click', () => {
    observers[observers.length - 1].disconnect();
    observers.pop();
    test.removeChild(test.lastChild);
    divStack.pop();
    list.removeChild(list.lastChild);
    uploadArmor.value = '';
    deleteLastArmorChart(chart);
})

function throttle(callee, timeout) {
    let timer = null

    return function perform(...args) {
        if (timer) return

        timer = setTimeout(() => {
            callee(...args)

            clearTimeout(timer)
            timer = null
        }, timeout)
    }
}

const parseColorString = (str) => {
}

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

    // console.log(summuryColorStack)
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
    // console.log(gradient);

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
