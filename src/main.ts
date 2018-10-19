import { Util as Ul } from './core/utils';
import mysql from './common/mysqlTest'
import TestMySql from './common/mysqlTest';
import TestExcel from './common/exceltest';

/**
 * main 入口
 * 
 * 测试
 */
function main() {

    // let mysqlTest = new TestMySql();
    // mysqlTest.testFunc();

    let testExcel = new TestExcel();
    testExcel.test();
}

main();