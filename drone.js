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
        self.deltaTime = (self.curTime - self.prevTime) / 1000;

        //update position
        if (self.droneData.droneState.flying) {
            var yawRadians = self.droneData.demo.rotation.yaw * 180 / Math.PI;
            var localX = self.droneData.demo.xVelocity * self.deltaTime;
            var localY = self.droneData.demo.yVelocity * self.deltaTime;
            self.position.z = self.droneData.demo.altitude;
            self.position.x += Math.cos(yawRadians)*localX + Math.sin(yawRadians)*localY;
            self.position.y += Math.sin(yawRadians)*localX + Math.cos(yawRadians)*localY;
            // self.position.x += localX;
            // self.position.y += localY;
        }
    }
    this.client.on('navdata', this.updateData);

    this.move = function(parallel, transverse, rotational) {
        if (parallel >= 0) {
            self.client.front(parallel);
        } else {
            self.client.back(-parallel);
        }
        if (transverse >= 0) {
            self.client.right(transverse);
        } else {
            self.client.left(-transverse);
        }
        if (rotational >= 0) {
            self.client.clockwise(rotational);
        } else {
            self.client.counterClockwise(-rotational)
        }

        if (parallel == 0 && transverse == 0 && rotational == 0) {
            self.client.stop();
        }
    }

    this.isFacing(enemyDrone) {

    }
}

var drones = [new Drone("192.168.1.20"), new Drone("192.168.1.21")];

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);
process.stdin.setRawMode(true); //making this false causes console-style input

process.stdin.on('keypress', function (ch, key) {
    if (key) {
        switch (key.name) {
            case 'c':
                for (i = 0; i < drones.length; i++) {
                    if (drones[i].droneData.droneState.flying == 0) {
                        drones[i].client.takeoff();
                    } else {
                        drones[i].client.land();
                    }
                }
                break;
            case 's':
                for (i = 0; i < drones.length; i++) {
                    drones[i].client.stop();
                }
                break;
            case 'b':
                for (i = 0; i < drones.length; i++) {
                    console.log("Drone", i + 1, "battery:", drones[i].droneData.demo.batteryPercentage);
                }
                break;
            case 'p':
                for (i = 0; i < drones.length; i++) {
                    console.log("Drone", i + 1, "position:", drones[i].position.x, drones[i].position.y, drones[i].position.z);
                }
                break;
            default:
                break;
        }
    }
})
