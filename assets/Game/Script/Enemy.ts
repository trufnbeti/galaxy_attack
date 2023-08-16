
import Bullet from "./Bullet";
import Character from "./Character";
import LevelManager from "./Manager/LevelManager";
import SoundManager, { AudioType } from "./Manager/SoundManager";
import SimplePool, { PoolType } from "./Pool/SimplePool";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Enemy extends Character {
    @property({
        type: [cc.Node],
        tooltip: 'bulletPoints'
    })
    public bulletPoints: cc.Node[] = [];
    protected isShooting: boolean = false;
    private isShield: boolean = true;
    //nhận damage
    public onHit(damage: number){
        if (!this.isShield){
            super.onHit(damage);
        }
    }    

    //enemy death sẽ đưa nó về pool
    protected onDeath(){
        // super.onDeath();
        LevelManager.Ins.onEnemyDeath(this);
        SimplePool.spawn(PoolType.VFX_Explore, this.node.getWorldPosition(), 0);
        SimplePool.despawn(this);
        SoundManager.Ins.PlayClip(AudioType.FX_EnemyDie);
    }

    public onReset(): void {
        this.isShooting = false;
    }

    public onStart(): void{
        this.isShooting = true;
    }

    //hàm di chuyển sang vị trí mới
    public moveTo(target: cc.Vec3, duration: number, isWorldSpace: boolean): void {
        // Lấy vị trí target position của node
        const targetPosition = isWorldSpace ? this.node.getLocalPosition(target) : target;

        // Tạo một tween để di chuyển node từ vị trí hiện tại đến vị trí mới (position)
        cc.tween(this.node)
            .to(duration, 
                { position: targetPosition },
                {   easing: "linear", }
                )
            .call(() => {
                this.isShield = false;
            })
            .start();
    }
    protected shoot(){
        SoundManager.Ins.PlayClip(AudioType.FX_Bullet);
        for (let i = 0; i < this.bulletPoints.length; i++) {
          (SimplePool.spawn(PoolType.Bullet_Enemy, this.bulletPoints[i].getWorldPosition(),this.bulletPoints[i].angle) as Bullet).onInit(10);
        }
    }
    protected timer: number = 2;
    protected timeShootDelay: number = 1;
    protected update(dt: number): void {
        if(this.isShooting){            
            if (this.timer <= 0) {
                const rand: number = Math.random();
                this.timer += this.timeShootDelay;
                if (rand < 0.1){
                    this.shoot();
                }
            }
            this.timer -= dt;
        }
    }

}
