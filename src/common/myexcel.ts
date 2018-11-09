import * as Excel from 'exceljs'

export default class ComExcel {
    private readonly _excelFileName: string = '';

    constructor(excelFileName: string) {
        this._excelFileName = excelFileName;
    }

    //get table fields name
    getTableField(callback: (err, fileds: string[]) => void) {
        let workbook = new Excel.Workbook();
        workbook.xlsx.readFile(this._excelFileName)
            .then(() => {
                let worksheet = workbook.getWorksheet(1);

                //获取列的名字
                let filedsName: string[] = [];
                let row1 = worksheet.getRow(1);
                row1.eachCell((cell, collNum) => {
                    filedsName.push(this._getCelValue(cell));
                });
                // console.log(`table get tabe fileds ok`);

                callback(null, filedsName);
            }).catch((reson) => {
                callback(reson, []);
                // console.log('worksheet get tabe fileds failed ');
            });

        // console.log('worksheet get datas 222');
    }

    //获取表格中指定列中的数据
    getTableDesFiledDatas(descFileds: string[], callback: (err: any, datas: any[]) => void) {
        // console.log('worksheet getTableDesFiledDatas descFileds: ', descFileds);

        let workbook = new Excel.Workbook();
        workbook.xlsx.readFile(this._excelFileName)
            .then(() => {
                let worksheet = workbook.getWorksheet(1);

                let allRowdatas = [];
                let filedsName: string[] = [];
                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) {
                        row.eachCell((cell: Excel.Cell, colNumber) => {
                            let value = this._getCelValue(cell);
                            filedsName.push(value);
                        });

                        return; //第一行数据是列名不需要插入
                    }

                    let rowDatas = [];
                    row.eachCell((cell: Excel.Cell, colNumber) => {
                        let value = this._getCelValue(cell);

                        //获取列的名字并查看列的名字是否在要求的表格中
                        let colName: string = filedsName[colNumber - 1];
                        if (descFileds.indexOf(colName) === -1) {
                            // console.log(`getTableDesFiledDatas colNum: ${colNumber} colName: ${colName} not in`);
                            return;
                        }

                        rowDatas.push(value);
                    });

                    allRowdatas.push(rowDatas);
                });

                callback(null, allRowdatas);
                // console.log("worksheet get datas ok");
            }).catch((reson) => {
                callback(reson, []);
                // console.log('worksheet get datas failed ')
            });

        // console.log('worksheet get datas 222');
    }

    //get table all data
    getTableDatas(callback: (err: any, datas: any[]) => void) {
        let workbook = new Excel.Workbook();
        workbook.xlsx.readFile(this._excelFileName)
            .then(() => {
                let worksheet = workbook.getWorksheet(1);

                let allRowdatas = [];
                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) {
                        return;
                    }

                    let rowDatas = [];
                    row.eachCell((cell: Excel.Cell, colNumber) => {
                        let value = this._getCelValue(cell);
                        rowDatas.push(value);
                    });

                    allRowdatas.push(rowDatas);
                });

                callback(null, allRowdatas);
                // console.log("worksheet get datas ok");
            }).catch((reson) => {
                callback(reson, []);
                // console.log('worksheet get datas failed ')
            });

        // console.log('worksheet get datas 222');
    }

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
}