import * as Excel from 'exceljs'
import ComExCel from './myexcel';

export default class ExcelTest {
    private readonly tabName: string = 'commonCfg.xlsx';

    _getCelValue(cell: Excel.Cell): string {
        let value = cell.value;
        if (cell.type === Excel.ValueType.RichText) {
            let valStr = '';
            let valueRich: Excel.CellRichTextValue = cell.value as Excel.CellRichTextValue;
            valueRich.richText.forEach((value) => {
                valStr += value.text;
            });
            value = valStr;
        }

        return value.toString();
    }

    test() {
        let testExcel = new ComExCel('commonCfg.xlsx');
        testExcel.getTableField((err, fileds) => {
            if (err) {
                console.log('getTableField error: ', err);
                return;
            }

            console.log('getTableField fileds ok: ', fileds.toString());
        });

        testExcel.getTableDatas((err, datas) => {
            if (err) {
                console.log('get table datas error: ', err);
                return;
            }

            console.log('getTable datas ok: ', datas.toString());
        });
    }

    test1() {
        let workbook = new Excel.Workbook();
        workbook.xlsx.readFile(this.tabName)
            .then(() => {
                let worksheet = workbook.getWorksheet(1);

                //获取列的名字
                let filedsName: string[] = [];
                let row1 = worksheet.getRow(1);
                row1.eachCell((cell, collNum) => {
                    filedsName.push(this._getCelValue(cell));
                });
                console.log(`table filedName: `, filedsName.toString());

                let data = [];
                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) {
                        return;
                    }

                    row.eachCell((cell: Excel.Cell, colNumber) => {
                        let value = this._getCelValue(cell);
                        data.push(value);

                        console.log('Cell ' + colNumber + ' = ' + JSON.stringify(cell.value));
                    });
                });

                console.log("worksheet get table data: ", data.toString());
            });


    }
}