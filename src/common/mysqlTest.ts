import mysql from './mysql'
import * as mdSql from 'mysql';

export default class TestMySql {
    _host: string = '192.168.20.248';
    _user: string = 'root';
    _password: string = '123456';
    _port: number = 3306;
    _databaseName: string = "whf_test";
    _log: string = 'TestMySql ';
    constructor() {

    }

    testFunc() {
        let connection = mdSql.createConnection({
            host: this._host,
            user: this._user,
            password: this._password,
            port: this._port,
            database: this._databaseName
        });

        connection.connect(function (error) {
            if (error) {
                console.log('connection connect error, ', error);
                return;
            }

            console.log('connection connected ok as id: ', connection.threadId);
        });

        connection.query('SELECT * FROM test WHERE type = ?', [1], (error, results, fileds) => {
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
                console.log('connection query results: ', results);
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

    testFunc2() {
        let comSql = new mysql(this._host, this._user, this._password, this._port, this._databaseName);
        comSql.connect(function (err) {
            if (err) {
                console.log(err);
                return;
            }

            comSql.getTabFiledname('test', function (err, fileds) {
                if (err) {
                    console.log(err);
                    return;
                }
                if (!fileds) {
                    console.log('empty fileds');
                    return;
                }

                console.log(fileds.toString());
            });
        });
    }
}