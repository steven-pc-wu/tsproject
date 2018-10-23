import { Util as Ul } from './core/utils';
import ComSql from './common/mysql'
import ComExcel from './common/myexcel';
import TestMySql from './common/mysqlTest';
import TestExcel from './common/exceltest';

function test(callback: (err: any) => void) {
    let excelName: string = 'commonCfg.xlsx';
    let tableName: string = 'commonCfg';

    let _host: string = '192.168.20.248';
    let _user: string = 'root';
    let _password: string = '123456';
    let _port: number = 3306;
    let _dataBase: string = 'whf_test';
    let testSql = new ComSql(_host, _user, _password, _port, _dataBase);
    testSql.connect(function (err) {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }

        //清空表格中的数据
        testSql.clearTableDatas(tableName, (err) => {
            if (err) {
                console.log('main clearTableDatas failed error: ', err);
                callback(err);
                return;
            }
        })

        //获取sql中指定表格中filedName
        testSql.getTabFiledName(tableName, (err, filedName) => {
            if (err) {
                callback(err);
                return;
            }

            console.log('main getTabFiledName filedName: ', filedName);

            //根据sql中filedName 获取excel 中相关列中数据
            let testExcel = new ComExcel(excelName);
            testExcel.getTableDesFiledDatas(filedName, (err, datas) => {
                if (err) {
                    console.log('get table datas error: ', err);
                    callback(err);
                    return;
                }

                console.log('getTable datas ok: ', datas.toString());


                testSql.insertTabData(tableName, filedName, datas, (err) => {
                    if (err) {
                        console.log('main insert datas failed err: ', err);
                        callback(err);
                        return;
                    }

                    console.log('main insert datas ok');
                });

                testSql.queryTabData(tableName, (err, datas) => {
                    if (err) {
                        console.log('main query table datas failed err: ', err);
                        callback(err);
                        return;
                    }

                    console.log('main query tabel datas ok datas: ', datas);
                });
            })
            //把excel中获取到的相关列中数据插入到sql中
        })
    });
}

function selfTest() {
    let test = new TestExcel();
    test.test1();
}
/**
 * main 入口
 * 
 * 测试
 */
function main() {

    // selfTest();

    test((error) => {
        if (error) {
            console.log('test failed err: ', error);
            return;
        }

        console.log('test ok');
    });
}

main();