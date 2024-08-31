class ConvertationService {
    constructor(
        windowWidth,
        windowHeight, 
        tankWidth, 
        tankHeight
    ) {
        this.windowWidth = windowWidth
        this.windowHeight = windowHeight
        this.tankWidth = tankWidth
        this.tankHeight = tankHeight
    }

    convert_px_to_mm = (px, left=true) => {
        let mmSize;
    
        if (left) {
            mmSize = (px / this.windowWidth) * Number(this.tankWidth.value);
        } else {
            mmSize = Number(this.tankHeight.value) - ((px / this.windowHeight) * Number(this.tankHeight.value));
        }
    
        return mmSize
    }
    
    convert_px_distance_to_mm = (px, left=true) => {
        let mmDistance;
    
        if (left) {
            mmDistance = (px * Number(this.tankWidth.value)) / this.windowWidth;
        } else {
            mmDistance = (px * Number(this.tankHeight.value)) / this.windowHeight;
        }
        return mmDistance;
    }

    convert_mm_px(mmValue, mmParameter, pxParameter) {
        return (mmValue / mmParameter) * pxParameter
    }
    
    
}



module.exports = { ConvertationService }
