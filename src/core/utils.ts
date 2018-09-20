import * as path from 'path';                     // 测试能否正常使用 Node 的内置模块


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
}

