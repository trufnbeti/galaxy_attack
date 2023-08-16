const {ccclass, property} = cc._decorator;

@ccclass
export default class HealthBar extends cc.Component{
    private maxHp: number;
    private hp: number;

    update(dt: number): void{
        
    }
}