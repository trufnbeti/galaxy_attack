import LevelManager from "./Manager/LevelManager";
import SoundManager from "./Manager/SoundManager";
import UIManager from "./Manager/UIManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ButtonManager extends cc.Component{
    onBtnRestartClick(): void{
        LevelManager.Ins.onReset();
        UIManager.Ins.onClose(2);
        this.unPauseGame();
        SoundManager.Ins.loadMusic();
    }
    onButtonPauseClick(): void{
        UIManager.Ins.onOpen(2);
        // cc.game.pause();
        cc.director.pause();
    }
    onButtonReplayClick(): void{
        UIManager.Ins.onClose(2);
        this.unPauseGame();
    }
    onOptionMenuClick(): void{
        UIManager.Ins.onClose(2);
        UIManager.Ins.onOpen(3);
    }
    pauseGame(): void{
        cc.director.pause();
    }
    unPauseGame(): void{
        if (cc.director.isPaused()){
            cc.director.resume();
        }
    }
    onBtnExitClick(): void{
        cc.game.end();
    }
}