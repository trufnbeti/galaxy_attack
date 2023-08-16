import LevelManager from "./Manager/LevelManager";
import UIManager from "./Manager/UIManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ButtonNext extends cc.Component{
    onButtonClick(): void{
        LevelManager.Ins.onReset();
    }
}