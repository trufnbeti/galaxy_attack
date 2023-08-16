import Bullet from "./Bullet";
import Enemy from "./Enemy";
import LevelManager from "./Manager/LevelManager";
import SoundManager, { AudioType } from "./Manager/SoundManager";
import SimplePool, { PoolType } from "./Pool/SimplePool";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Boss extends Enemy{
    @property(cc.Node)
    private healthBar: cc.Node;
    @property(cc.Node)
    private sprite: cc.Node;
    private maxHp: number;
    private progressBar: cc.ProgressBar;

    public onHit(damage: number): void {
        this.onHitEffect(this.sprite);
        super.onHit(damage);
        
    }

    private onHitEffect(object){
      object.color = cc.color(120, 0, 120); // Đặt màu trắng
      this.scheduleOnce(() => {
          object.color = cc.color(255, 255, 255); // Quay trở lại màu sắc ban đầu
      }, 0.1);
  }

    public onInit(hp: number){
        super.onInit(hp);
        this.maxHp = hp;
        this.timeShootDelay = 2;
        this.progressBar = this.healthBar.getComponent(cc.ProgressBar);
    }

    protected shoot(): void {
      const radToDeg = (rad: number): number => rad * (180.0 / Math.PI);
      
      SoundManager.Ins.PlayClip(AudioType.FX_Bullet);
      for (let i = 0; i < this.bulletPoints.length; i++) {
        const dx: number = LevelManager.Ins.ship.node.getWorldPosition().x - this.bulletPoints[i].getWorldPosition().x;
        const dy: number = this.bulletPoints[i].getWorldPosition().y - LevelManager.Ins.ship.node.getWorldPosition().y;
        const deg: number = radToDeg(Math.atan(dx/dy));
        (SimplePool.spawn(PoolType.Bullet_Enemy, this.bulletPoints[i].getWorldPosition(), this.bulletPoints[i].angle + deg) as Bullet).onInit(10);
      }
    }
	
    
    update(dt: number) {
        
        if (this.isShooting) {
          if (this.timer <= 0) {
            this.timer += this.timeShootDelay;
            this.shoot();
          }
    
          this.timer -= dt;
        }

        //update hp bar
        let currentHp: number = this.getHp();
        let value: number = currentHp / this.maxHp;
        this.progressBar.progress = value;
        
        

    }
    
}