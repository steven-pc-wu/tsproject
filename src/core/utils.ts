import * as path from 'path';                     // 测试能否正常使用 Node 的内置模块
import * as _ from 'lodash';

export module Util {
  export const UTIL_VALUE:number = 123;
/**
 * 一个正常的class
 * 
 * 不得不说, TS 使用起来真是舒服,各种该有的东西都替你考虑到了
 * 很舒心
 */
export class NodeModuleTester {
  public static readonly STATIC_VAR = 'STATIC';   // 测试static变量
  _num: number = 0;

  constructor(                                    // 测试构造方法
    private readonly f1: string,
    private readonly f2: number) {

  }

  public static testPath() {                      // 测试静态方法
    const curdir = './';

    console.log(path.resolve(curdir));
  }

  public sayHello() {
    console.log("this is say helo function");
  }

}

export class Module {
  SayHi() {
    console.log("this is module hi");

    console.log(_.escape('fred, barney, & pebbles'));

    let x = _.parseInt('70', 8);
    console.log(`x = ${x}`);

    var users = [
      { 'user': 'barney',  'active': true },
      { 'user': 'fred',    'active': false },
      { 'user': 'pebbles', 'active': false }
    ];

    console.log(_.dropRightWhile(users, function(o){
      return (o.active != true);
    }));
  }
}

/**
 * 所有单例的基类，做了单例的基础检查。所有子类最好都写一个getInstance的静态方法来获取
 * @author sodaChen
 * Date:2012-10-29
 */
export class Singleton
{

  /**
   *  这个是单例需要进行私有化
   */
    private constructor()
    {

    }
    //注意，Singleton是要替换成你自己实现的子类 这里没有实际的作用
    private static instance:Singleton;
    /**
     * 获取实例的静态方法实例
     * @return
     *
     */
    public static getInstance():Singleton
    {
        if(!this.instance)
        {
            this.instance = new Singleton();
        }
        return this.instance;
    }

    public sayHello() {
      console.log("helo every one");
    }
}

}

