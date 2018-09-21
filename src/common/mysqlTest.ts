import mysql from './mysql'

export default class TestMySql{
    _host: string = '192.168.10.248';
    _user: string = 'root';
    _password: string = '123456';
    _port: number = 3306;
    _databaseName: string = "whf_test";
    _log: string = 'TestMySql ';
    constructor() {
        
    }

    testFunc() {
        let comSql = new mysql(this._host, this._user, this._password, this._port, this._databaseName);
        comSql.connect(function(err){
            if (err) {
                console.log(err);
                return;
            }

            comSql.getTabFiledname('test', function(err, fileds){
                if (err) {
                    console.log(err);
                    return;
                }
                
                console.log(fileds.toString());
            });
        });
    }
}