const { tankData } = require('../../constants/tank-battle-data')
const { range } = require('../../utils/common')

class PlotService {
    constructor (
        battleLoseColor, 
        battleTieColor, 
        battleWinColor,
        battlePlot,
        tankWidth, 
        tankHeight, 
    ) {
        this.battleLoseColor = battleLoseColor
        this.battleTieColor = battleTieColor
        this.battleWinColor = battleWinColor
        this.battlePlot = battlePlot
        this.tankWidth = tankWidth  
        this.tankHeight = tankHeight
    }

    makeBattlePlot(X, Y, Z) {

        let z = [];
    
        while (Z.length) z.push(Z.splice(0, Object.keys(tankData).length))
    
        let data = {
                type: 'surface',
                x: Array.from(new Set(X)),
                y: Array.from(new Set(Y)),
                z: z,
                cmax: 1,
                cmin: -1,
                opacity:1,
                colorscale: [[0, `${this.battleLoseColor.value}`],
                    [0.45, `${this.battleLoseColor.value}`],
                    [0.45, `${this.battleTieColor.value}`],
                    [0.55, `${this.battleTieColor.value}`],
                    [0.55, `${this.battleWinColor.value}`],
                    [1, `${this.battleWinColor.value}`]],
                contours: {
                    "x": {
                        "show": true,
                    },
                    "y": {
                        "show": true,
                    }
                },
            };
    
    
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
                text: BATTLE_PLOT_TITLE
            }
        }
    
        Plotly.newPlot(battlePlot, [data], layout);
    }

    plotResults(
        resultArray, 
        threeDimDiv, 
        twoDimDiv, 
        windowWidth, 
        windowHeight,
        fixedProbabilityScale,
        PLOT_TITLE_3D,
        PLOT_COLORMAP,
        autoResizeColorBar,
        summuryColorStack,
        tankWidth,
        tankHeight
    ) {

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
            title: PLOT_TITLE_3D,
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
}

module.exports = { PlotService }