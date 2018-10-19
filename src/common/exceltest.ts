import * as Excel from 'exceljs'

export default class ExcelTest {
    private readonly tabName: string = 'test.xlsx';
    test() {
        let workbook = new Excel.Workbook();
        let data = [];
        workbook.xlsx.readFile(this.tabName)
            .then(() => {
                let worksheet = workbook.getWorksheet(1);
                worksheet.eachRow((row, rowNumber) => {
                    row.eachCell((cell, colNumber) => {
                        let value = cell.value;
                        // if (typeof value == "object") {
                        //     value = value.text;
                        // }
                        data.push(value);

                        console.log('Cell ' + colNumber + ' = ' + JSON.stringify(cell.value));
                    });
                });

                console.log("worksheet get table data: ", this.tabName);
                console.log(JSON.stringify(data));
            });


    }
}