
class ExcelService {

    exportData(divStack) {
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
    }
}

module.exports = { ExcelService }
