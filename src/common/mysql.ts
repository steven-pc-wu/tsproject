'use strict'
import * as path from 'path';
import * as mdSql from 'mysql';

export default class ComSql {
    private _host: string = "";
    private _user: string = "";
    private _password: string = "";
    private _port: number = 0;
    private _databaseName: string = "";
    private _log: string = 'ComSql ';
    private _connect: any = null;

    constructor(host: string, user: string, password: string, port: number, databaseName: string) {
        this._host = host;
        this._user = user;
        this._password = password;
        this._port = port;
        this._databaseName = databaseName;
    }

    connect(callback: (err: any) => void) {
        let con = mdSql.createConnection({
            'host': this._host,
            'user': this._user,
            'password': this._password,
            'port': this._port,
            'database': this._databaseName
        });
        if (!con) {
            console.log(this._log, 'createConnection failed');
            callback(null);
            return;
        }
        this._connect = con;
        callback(null);
        // con.connect(function (err) {
        //     if (err) {
        //         console.log('connect failed: ', err);
        //         callback(err);
        //         return;
        //     }

        //     callback(null);
        //     console.log('connect ok');
        // });
    }

    /**
     * 
     * @param tabName {string} tablename
     * @param callback {( err:any, filedNames: string[])=>void}
     */
    getTabFiledname(tabName: string, callback: (err: any, filedNames?: string[]) => void) {
        //par check
        if (!tabName) {
            callback("errParaTabNameInvalid");
            return;
        }
        if (!this._connect) {
            callback("errNotConnected");
            return;
        }
        let con: mdSql.Connection = this._connect;

        //查寻数据获取表格的相关列
        // let sql = mdSql.format('SELECT * FROM ? LIMIT 1', [tabName]);
        // let sql = mdSql.format(`SELECT * FROM ${tabName}  LIMIT 1`);
        let sql = `SELECT * FROM ${tabName} LIMIT 2`;
        con.query(sql, function (err, results, fileds) {
            if (err) {
                callback(err);
                return;
            }

            let filedNames: string[] = [];
            if (!fileds) {
                callback(err, filedNames)
                return;
            }

            //遍列所有的fileds，获取对象element中“name”值
            fileds.forEach(element => {
                if (!element.hasOwnProperty("name")) {
                    return;
                }
                filedNames.push(element.name);
            });;

            callback(err, filedNames);
        });
    }
}