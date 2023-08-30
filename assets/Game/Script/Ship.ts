// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Bullet from "./Bullet";
import Character from "./Character";
import LevelManager from "./Manager/LevelManager";
import SoundManager, { AudioType } from "./Manager/SoundManager";
import UIManager from "./Manager/UIManager";
import SimplePool, { PoolType } from "./Pool/SimplePool";
import Utilities from "./Utilities";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Ship extends Character {
	@property({
		type: [cc.Node],
		tooltip: "bulletPoints_1",
	})
	//list đạn ban đầu
	public bulletPoints_1: cc.Node[] = [];
	private isShield: boolean = false;

	@property({
		type: [cc.Node],
		tooltip: "bulletPoints_2",
	})
	//list đạn sau khi level up
	public bulletPoints_2: cc.Node[] = [];
	//list đạn bắn ra
	private bulletPoints: cc.Node[] = [];

	@property(cc.Node)
	private ripple: cc.Node = null;
	@property(cc.Node)
	private shield: cc.Node = null;

	private levelBullet: number = 1;
	// private player: cc.Node;
	private touchOffset: cc.Vec2;

	//giới hạn khu vực điều khiển
	private screen: cc.Vec2 = new cc.Vec2(
		cc.view.getVisibleSize().width,
		cc.view.getVisibleSize().height
	);
	private clampHorizon: cc.Vec2; // = new cc.Vec2(-0.5, 0.5).mul(this.screen.x);
	private clampVertical: cc.Vec2; // = new cc.Vec2(-0.5, 0.5).mul(this.screen.y);

	private isShooting: boolean = false;
	private timeShootDelay = 0.2;

	onLoad() {
		// this.player = cc.find('player');
		//set up move object
		// this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
		// this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);

		this.screen = new cc.Vec2(
			cc.view.getVisibleSize().width,
			cc.view.getVisibleSize().height
		);
		this.clampHorizon = new cc.Vec2(-0.5, 0.5).mul(this.screen.x);
		this.clampVertical = new cc.Vec2(-0.5, 0.5).mul(this.screen.y);

		this.bulletPoints = this.bulletPoints_1;
	}

	onReset(): void {
		this.node.x = 0;
		this.node.y = -1800;
		this.bulletPoints = this.bulletPoints_1;
		this.isShooting = false;
		this.timeShootDelay = 0.2;
		this.levelBullet = 1;
		this.shield.active = false;
		this.ripple.active = false;
		this.isShooting = false;
		this.node.active = true;
	}

	onDestroy() {
		this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
		this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
	}

	//Move

	//bat dau an xuong
	private onTouchBegan(event: cc.Event.EventTouch) /*: boolean*/ {
		this.onStart();
		this.touchOffset = Utilities.vec3ToVec2(this.node.position).subtract(
			this.getMousePoint(event)
		);
	}

	//di chuyen chuot
	private onTouchMoved(event: cc.Event.EventTouch) {
		const newPos = this.getMousePoint(event).add(this.touchOffset);

		newPos.x = cc.misc.clampf(
			newPos.x,
			this.clampHorizon.x,
			this.clampHorizon.y
		);
		newPos.y = cc.misc.clampf(
			newPos.y,
			this.clampVertical.x,
			this.clampVertical.y
		);

		this.node.position = Utilities.vec2ToVec3(newPos);
	}

	//lay vi tri chuot bam xuong
	private getMousePoint(event: cc.Event.EventTouch): cc.Vec2 {
		return event
			.getLocation()
			.sub(cc.v2(this.screen.x * 0.5, this.screen.y * 0.5));
	}

	//------------------------------

	private timer: number = this.timeShootDelay;

	update(dt: number) {
		if (this.isShooting) {
			//mỗi 0.2s bắn 1 lần
			if (this.timer <= 0) {
				this.timer += this.timeShootDelay;
				this.shoot();
			}

			this.timer -= dt;
		}
	}

	//bắn đạn
	private shoot() {
		SoundManager.Ins.PlayClip(AudioType.FX_Bullet);
		for (let i = 0; i < this.bulletPoints.length; i++) {
			(
				SimplePool.spawn(
					this.levelBullet,
					this.bulletPoints[i].getWorldPosition(),
					this.bulletPoints[i].angle
				) as Bullet
			).onInit(10 * this.levelBullet);
		}
	}

	public onPowerUp(): void {
		this.timeShootDelay = 0.17;
		this.bulletPoints = this.bulletPoints_2;
		this.shield.active = true;
		this.isShield = true;
		this.scheduleOnce(() => {
			this.shield.active = false;
			this.isShield = false;
		}, 5);
		this.levelBullet++;
		SoundManager.Ins.PlayClip(AudioType.FX_Booster);
	}

	public onAwake() {
		this.onInit(100);
		this.moveTo(
			cc.Vec3.UP.mul(-500),
			1,
			() => {
				//bật tut
				//bật fx
				this.ripple.active = true;
				UIManager.Ins.onOpen(0);
				this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
				this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
			},
			false
		);
	}

	//khi player bắt đầu ấn xuống
	public onStart(): void {
		//bắt đầu bắn đạn
		if (!this.isShooting) {
			this.isShooting = true;
			//tắt tut
			//tắt fx
			this.ripple.active = false;
			UIManager.Ins.onClose(0);
		}
		LevelManager.Ins.onStart();
	}

	public onFinish(): void {
		//tàu k bắn đạn nữa, vụt đi
		this.isShooting = false;
		this.isShield = true;
		this.moveTo(
			this.node.position.add(cc.Vec3.UP.mul(-200)),
			1,
			() =>
				this.moveTo(
					this.node.position.add(cc.Vec3.UP.mul(10000)),
					1,
					//show UI end card
					() => UIManager.Ins.onOpen(1),
					false
				),
			false
		);
	}

	//hàm di chuyển sang vị trí mới
	public moveTo(
		target: cc.Vec3,
		duration: number,
		doneAction: Function,
		isWorldSpace: boolean
	): void {
		// Lấy vị trí target position của node
		const targetPosition = isWorldSpace
			? this.node.getLocalPosition(target)
			: target;

		// Tạo một tween để di chuyển node từ vị trí hiện tại đến vị trí mới (position)
		cc.tween(this.node)
			.to(duration, { position: targetPosition }, { easing: "linear" })
			.call(doneAction)
			.start();
	}

	public onHit(damage: number): void {
		if (!this.isShield){
			super.onHit(damage);
		}
	}
	protected onDeath() {
		this.node.active = false;
		SimplePool.spawn(PoolType.VFX_Explore, this.node.getWorldPosition(), 0);
		SoundManager.Ins.PlayClip(AudioType.FX_EnemyDie);
		UIManager.Ins.onOpen(1);
	}
}
