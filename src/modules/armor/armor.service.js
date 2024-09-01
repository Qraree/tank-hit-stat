class ArmorService {
    constructor(convertationService) {
        this.convertationService = convertationService
    }

    downloadArmor(divStack, armorAlert) {
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
    }
  
    uploadCustomArmor(photoPath, armorPath, width, height, message, preview, divStack, tankWidth, tankHeight, observers, test, armorInfo, list, uploadArmor) {
        this.deleteAllArmor(observers, test, divStack, armorInfo, list, uploadArmor);
        message.style.display = "none";
        preview.src = photoPath;
        let obj;
        fs.readFile(armorPath, 'utf8',  (err, data) => {
            if (err) throw err;
            obj = JSON.parse(data);
            const table = obj.table;
            this.addArmorFromTable(table, divStack)
        });
    
        tankWidth.value = width;
        tankHeight.value = height;
    
        resizeTankWindow()
    }

    handleArmorLoad(e, divStack) {
        const obj = JSON.parse(e.target.result);
        const table = obj.table;
        this.addArmorFromTable(table, divStack)
    }

    addArmorFromTable(table, divStack) {
        for (let armor of table) {
            this.addExistingArmor(armor, divStack);
        }
    }
    
    uploadArmorFunc(e, divStack) {
        const reader = new FileReader();
        reader.onload = (e) => this.handleArmorLoad(e, divStack);
        reader.readAsText(e.target.files[0]);
    }

    deleteLastArmor(observers, test, divStack, list, uploadArmor) {
        observers[observers.length - 1].disconnect();
        observers.pop();
        test.removeChild(test.lastChild);
        divStack.pop();
        list.removeChild(list.lastChild);
        uploadArmor.value = '';
    }

    

    deleteAllArmor(observers, test, divStack, armorInfo, list, uploadArmor) {
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
    
    

    addNewArmor(e, divStack) {
        let content = document.createElement('div');
    
        divStack.push({
            index: divStack.length,
            name: `delta_${divStack.length+1}`,
            thickness: 100,
            hit: 1,
            height: 100,
            width: 200,
            top: e.offsetY,
            left: e.offsetX,
            x_left_mm: this.convertationService.convert_px_to_mm(e.offsetX, true),
            x_right_mm: this.convertationService.convert_px_to_mm(e.offsetX, true) + this.convertationService.convert_px_distance_to_mm(200, true),
            y_top_mm: this.convertationService.convert_px_to_mm(e.offsetY, false),
            y_bottom_mm: this.convertationService.convert_px_to_mm(e.offsetY, false) - this.convertationService.convert_px_distance_to_mm(100, false),
        })
    
    
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
    
        this.showArmorInfo(divStack[divStack.length - 1])
    
        let contentValue = content.querySelector('.contentValue')
        let input = contentValue.querySelector('.input')
        let value = contentValue.querySelector('.value')
    
        let listItem = document.createElement('div')
        listItem.className = 'listItem';
        listItem.innerHTML = `delta_${divStack.length} - ${100} мм`
    
        this.AddListenersToArmor(listItem, input, value, contentValue, content, divStack)
    }

    addExistingArmor(armor, divStack) {
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
            x_left_mm: this.convertationService.convert_px_to_mm(armor.left, true),
            x_right_mm: this.convertationService.convert_px_to_mm(armor.left, true) + this.convertationService.convert_px_distance_to_mm(armor.width, true),
            y_top_mm: this.convertationService.convert_px_to_mm(armor.top, false),
            y_bottom_mm: this.convertationService.convert_px_to_mm(armor.top, false) - this.convertationService.convert_px_distance_to_mm(armor.height, false)
        })
    
    
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
    
    
    
        this.showArmorInfo(divStack[divStack.length-1])
    
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
        listItem.innerHTML = `delta_${divStack.length} - ${armor.thickness} мм`
    
        this.AddListenersToArmor(listItem, input, value, contentValue, content, divStack)
    }

    AddListenersToArmor(listItem, input, value, contentValue, content, divStack) {
        let divColor;
    
        listItem.addEventListener('mouseenter', () => {
            let index = this.getIndex(list, listItem)
            divColor = test.childNodes[index+1].style.backgroundColor;
            listItem.style.backgroundColor = 'rgba(39,39,147,0.78)'
            test.childNodes[index+1].style.backgroundColor = 'rgba(55, 55, 196, 0.78)'
    
        })
    
        listItem.addEventListener('mouseleave', () => {
            let index = this.getIndex(list, listItem)
            listItem.style.backgroundColor = '#333D79FF'
            test.childNodes[index+1].style.backgroundColor = divColor;
        })
    
        listItem.addEventListener('click', () => {
            let index = this.getIndex(list, listItem)
            this.showArmorInfo(divStack[index])
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
    
                this.showArmorInfo(divStack[index])
    
    
                if (Number(value.innerHTML) > 500) {
                    content.style.backgroundColor = `rgba(255, ${255-((Number(value.innerHTML)-500)/500*255)}, 0, 0.8)`
                } else {
                    content.style.backgroundColor = `rgba(${Number(value.innerHTML)/500*255}, 255, 0, 0.8)`
                }
            }
        })
    
        
    
    
        this.dragElement(content, divStack);
    
        // RESIZING_CONTENT_WINDOW //
    
        const onresize = (dom_elem, callback) => {
            const resizeObserver = new ResizeObserver(() => callback() );
            resizeObserver.observe(dom_elem);
            observers.push(resizeObserver);
        };
    
        onresize(content, () => {
            let index = Array.prototype.indexOf.call(test.children, content);
            divStack[index].height = content.offsetHeight;
            divStack[index].width = content.offsetWidth;
            divStack[index].bottom = content.offsetHeight + divStack[index].top;
            divStack[index].right = divStack[index].left + content.offsetWidth;
            divStack[index].x_right_mm = divStack[index].x_left_mm + this.convertationService.convert_px_distance_to_mm(content.offsetWidth, true);
            divStack[index].y_bottom_mm = divStack[index].y_top_mm - this.convertationService.convert_px_distance_to_mm(content.offsetHeight, false);
        });
    
    
        content.addEventListener('click', (e) => {
            e.stopPropagation()
        })
    
        content.addEventListener('mousedown', (e) => {
            e.stopPropagation()
        })
    
        test.appendChild(content)
    }

    getIndex(parent, child) {
        return Array.prototype.indexOf.call(parent.children, child);
    }

    showArmorInfo(armor) {


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

    dragElement(elmnt, divStack) {
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
    
        const elementDrag = (e) => {
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
    
                divStack[index].x_left_mm = this.convertationService.convert_px_to_mm(elmnt.offsetLeft - pos1, true);
                divStack[index].x_right_mm = this.convertationService.convert_px_to_mm(elmnt.offsetLeft - pos1, true) +
                    this.convertationService.convert_px_distance_to_mm(divStack[index].width, true);
                divStack[index].y_top_mm = this.convertationService.convert_px_to_mm(elmnt.offsetTop - pos2, false);
                divStack[index].y_bottom_mm = this.convertationService.convert_px_to_mm(elmnt.offsetTop - pos2, false) -
                    this.convertationService.convert_px_distance_to_mm(divStack[index].height, false)
            }
        }
    
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}

module.exports = { ArmorService }