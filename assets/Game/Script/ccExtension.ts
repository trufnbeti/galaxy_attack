declare module cc{
	export interface Node{
		getWorldPosition(): cc.Vec3;
		getLocalPosition(pos: cc.Vec3): cc.Vec3;
		setWorldPosition(pos: cc.Vec3): void;
	}
}
//lấy giá trị world pos của node
cc.Node.prototype.getWorldPosition = function (): cc.Vec3 {
	//this ở đây là node luon
	const worldPos = this.convertToWorldSpaceAR(cc.v3(0, 0, 0));
	return worldPos;
};

//set world pos cho node
cc.Node.prototype.setWorldPosition = function (worldPosition: cc.Vec3){
	const localPos = this.parent?.convertToNodeSpaceAR(worldPosition);
	this.position = localPos;
};

//get local pos cua node
cc.Node.prototype.getLocalPosition = function (worldPosition: cc.Vec3): cc.Vec3{
	const localPos = this.parent?.convertToNodeSpaceAR(worldPosition);
	return localPos;
}