var arDrone = require('ar-drone');
var keypress = require('keypress');

function Drone(ip) {
    var self = this;

    this.client = arDrone.createClient({'ip' : ip});
    this.ip = ip;

    this.parallel = 0;
    this.transverse = 0;
    this.lateral = 0;

    this.droneData = new Object();
    this.deltaTime;
    this.prevTime;
    this.curTime = Date.now();

    this.position = {
        x: 0,
        y: 0,
        z: 0
    }

    this.updateData = function(navData) {
        //console.log("Receiving data from ", ip);
        //update drone data
        self.droneData = JSON.parse(JSON.stringify(navData));
        //calculate delta time
        self.prevTime = self.curTime;
        self.curTime = Date.now();
        self.deltaTime = self.curTime - self.prevTime;

        //update position
        if (self.droneData.droneState.flying) {
            var yawRadians = self.droneData.demo.rotation.yaw * 180 / Math.PI;
            var localX = self.droneData.demo.xVelocity * deltaTime;
            var localY = self.droneData.demo.yVelocity * deltaTime;
            self.position.z = self.droneData.demo.altitude;
            self.position.x += Math.cos(yawRadians)*localX + Math.sin(yawRadians)*localY;
            self.position.y += Math.sin(yawRadians)*localX + Math.cos(yawRadians)*localY;
        }
    }
    this.client.on('navdata', this.updateData);
}

// var drone10 = new Drone("192.168.1.1");
var drones = [new Drone("192.168.1.1")];

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);
process.stdin.setRawMode(true); //making this false causes console-style input

process.stdin.on('keypress', function (ch, key) {
    if (key && key.name == "b") {
        console.log(drone1s[0].droneData);
    }
})
