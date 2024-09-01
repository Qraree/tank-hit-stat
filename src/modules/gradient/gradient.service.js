class GradientService {
    constructor() {
        this.gradientPicker = new Grapick({el: gradientPicker});

        this.gradientPicker.addHandler(0, 'red');
        this.gradientPicker.addHandler(100, 'blue');

        this.gradientPicker.getHandler(0).getEl().style.opacity = '0';
        this.gradientPicker.getHandler(1).getEl().style.opacity = '0';

        this.gradientPicker.addHandler(0, 'red');
        this.gradientPicker.addHandler(99, 'blue');

        this.gradientPicker.on('change', complete => {
            this.throttleColorStack();
        })
    }

    throttleColorStack() {  
        throttle(this.showColorStack, 1000)
    }

    showColorStack() {
        const newPercentageArray = this.gradientPicker.getColorValue().match(/(\d*)%/g);
        percentageColorStack = newPercentageArray.map((e) => normalizeColor(Number(e.replace('%', ''))));
        const newStr = this.gradientPicker.getColorValue().replace(/\d+%/g, '');
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


    saveGradien(gradientAlert, summuryColorStack) {
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
    }

    handleGradientUpload(e) {
        const obj = JSON.parse(e.target.result);
        const gradient = obj.gradient;
        this.gradientPicker.clear();
    
        this.gradientPicker.addHandler(0, 'blue');
        this.gradientPicker.addHandler(100, 'red');
    
        this.gradientPicker.getHandler(0).getEl().style.opacity = '0';
        this.gradientPicker.getHandler(1).getEl().style.opacity = '0';
    
        for (let i = 1; i < gradient.length - 1; i++) {
            this.gradientPicker.addHandler(gradient[i][0]*100, gradient[i][1])
        }
    }

    normalizeColor(value) {
        return value / 100;
    }
    
}

module.exports = { GradientService }