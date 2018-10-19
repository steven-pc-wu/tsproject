import mysql from './mysql'
import * as mdSql from 'mysql';

interface IFileds {
    id: number;
    reward: number;
    type: number;
    neednum: number;
    str: string
}

export default class TestMySql {
    _host: string = '192.168.20.248';
    _user: string = 'root';
    _password: string = '123456';
    _port: number = 3306;
    _databaseName: string = "whf_test";
    _log: string = 'TestMySql ';
    constructor() {

    }

    testFunc3() {

        let connection = mdSql.createConnection({
            host: this._host,
            user: this._user,
            password: this._password,
            port: this._port,
            database: this._databaseName
        });

        connection.on('error', function (err) {
            console.log("error happen ", err); // 'ER_BAD_DB_ERROR'
        });

        connection.connect(function (error) {
            if (error) {
                console.log('connection connect error, ', error);
                return;
            }

            console.log('connection connected ok as id: ', connection.threadId);
        });

        let tabName = 'test';
        let sql = `INSERT INTO ${tabName} SET ?`
        let sql2 = `INSERT INTO ${tabName} (reward, type, neednum, str) values ?`;
        let post = { id: 1003, reward: 30, type: 2, neednum: 15, str: 'lingdong' };
        let posts = [{ id: 1004, reward: 30, type: 2, neednum: 15, str: 'lingdong' },
        { id: 1005, reward: 30, type: 2, neednum: 15, str: 'lingdong' }];
        let postx = [[30, 2, 15, 'lingdong2'], [30, 3, 16, 'whfdfs']];
        let postx1 = [[30, 2, 15, 'lingdong2']];
        let sql3 = `INSERT INTO ${tabName} (id, reward, type, neednum, str) values ` + connection.escape(posts);

        let formats = "SELECT * FROM ?? WHERE ?? = ?";
        let userid = 1001;
        let vals = ['test', 'id', userid];

        let format4 = "SELECT * FROM ?? WHERE ?";
        let obj1 = { id: 1001 };

        let parx = ['reward', 'type', 'neednum', 'str'];
        let format2 = "INSERT INTO ?? (id, reward, type, neednum, str) VALUES ?";
        let format3 = "INSERT INTO ?? (??) VALUES ?";
        let sql4 = mdSql.format(format3, [tabName, parx, postx1]);

        // let sql5 = mdSql.format(format4, [obj1]);
        let sql6 = "SELECT * FROM test";
        console.log('connection query sql: ', sql6);

        connection.query(sql6, (error, results, fileds) => {
            if (error) {
                console.log('connection query failed error: ', error);
                return;
            }

            if (fileds) {
                console.log('connection query fileds: ');
                fileds.forEach((value, index) => {
                    console.log('table name: ', value.table, 'filed name: ', value.name);
                })
            }

            if (results) {
                console.log("results[0]: ", results[0], " id: ", results[0].id);
                console.log('connection query results: ', results);

                let rx = JSON.stringify(results);
                console.log('connection query rx: ', rx);

                console.log('conenction querys objx: ');
                let objx: IFileds[] = JSON.parse(rx);
                objx.forEach((val, index) => {
                    console.log(`id: ${val.id} neednum: ${val.neednum} reward: ${val.reward} str: ${val.str} type: ${val.type}`);
                })
            }

            console.log('connection query ok as id: ', connection.threadId);
        });

        connection.end(function (error) {
            if (error) {
                console.log('connection end error: ', error);
                return;
            }

            console.log('connection end ok id: ', connection.threadId);
        });

    }

    testFunc() {
        console.log('testFunc');

        let comSql = new mysql(this._host, this._user, this._password, this._port, this._databaseName);
        comSql.connect(function (err) {
            if (err) {
                console.log(err);
                return;
            }
        });

        comSql.getTabFiledName('test', function (err, fileds) {
            if (err) {
                console.log(err);
                return;
            }
            if (!fileds) {
                console.log('empty fileds');
                return;
            }

            console.log('getTabFiledName ok: ', fileds.toString());
        });

        comSql.queryTabData('test', (err, datas) => {
            if (err) {
                console.log(err);
                return;
            }

            console.log('queryTabData data ok data: ', datas);
        });

        let parFiled = ['reward', 'type', 'neednum', 'str'];
        let postDatas = [[40, 2, 15, 'lingdong2'], [50, 3, 16, 'whfdfs']];
        comSql.insertTabData('test', parFiled, postDatas, (err) => {
            if (err) {
                console.log(err);
                return;
            }

            console.log('insert data ok');
        });

        comSql.queryTabData('test', (err, datas) => {
            if (err) {
                console.log(err);
                return;
            }

            console.log('queryTabData data ok data: ', datas);
        });

        comSql.end();
    }
}