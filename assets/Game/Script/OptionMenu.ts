import SoundManager from "./Manager/SoundManager";
import UIManager from "./Manager/UIManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class OptionMenu extends cc.Component{
    @property(cc.Slider)
    private soundSlider: cc.Slider;
    @property(cc.Slider)
    private musicSlider: cc.Slider;
    onConfirmClick(): void{
        SoundManager.Ins.changeVolumeSound(this.soundSlider.progress);
        SoundManager.Ins.changeVolumeBgMusic(this.musicSlider.progress);
        console.log(this.soundSlider.progress);
        
        console.log(this.musicSlider.progress);
        
        UIManager.Ins.onClose(3);
        cc.director.resume();
    }
    onCancelClick(): void{
        UIManager.Ins.onClose(3);
        cc.director.resume();
    }
}