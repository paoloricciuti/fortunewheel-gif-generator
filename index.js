const express = require("express");
const { createCanvas } = require('canvas');
var GIFEncoder = require('gifencoder');


const app = express();

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log("Your app is listening on port " + listener.address().port);
});


app.get("/", (request, response) => {
    response.json({ ok: true });
});

app.get("/generate", (request, response) => {
    let { names } = request.query;
    const canvas = createCanvas(200, 200);
    sendAsGIF(response, canvas, names.split(","));
})

function sendAsGIF(response, canvas, names) {
    let oldHeight=canvas.height;
    canvas.height=canvas.height+10*(names.length+2);
    var encoder = createGifEncoder({ x: canvas.width, y: canvas.height }, response);
    var context = canvas.getContext("2d");
    let angle = (Math.PI * 2) / names.length;
    let randomSpin=Math.PI*8;
    let vel=Math.random()*2;
    let i=0;
    while(vel > 0){
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'black';
        context.beginPath();
        context.moveTo(canvas.width/2-5, (canvas.width/10)/2-10);
        context.lineTo(canvas.width/2+5, (canvas.width/10)/2-10);
        context.lineTo(canvas.width/2, (canvas.width/10)/2);
        context.fill();
        let radius = (canvas.width - canvas.width / 10) / 2;
        context.strokeStyle = "black";
        let currentAngle=i;
        let numOfName=0;
        for (let name of names) {
            currentAngle+=angle;
            context.beginPath();
            let x = Math.cos(currentAngle) * radius;
            let y = Math.sin(currentAngle) * radius;
            context.moveTo(canvas.width / 2, canvas.width / 2);
            context.lineTo(canvas.width / 2 + x, canvas.width / 2 + y);
            context.arc(canvas.width / 2, canvas.width / 2, radius, currentAngle, currentAngle + angle);
            context.lineTo(canvas.width / 2, canvas.width / 2);
            context.stroke();
            context.fillStyle = `hsl(${(currentAngle-i) * 180 / Math.PI},100%,50%`;
            context.fill();
            context.fillRect(10, oldHeight+10*(numOfName)+4, 8, 8);
            context.fillStyle="black";
            context.fillText(name, 25, oldHeight+10*(numOfName+1)+1);
            numOfName++;
        }
        encoder.addFrame(context);
        i+=vel;
        vel-=0.02;
    }
    //let colors = ['white', 'yellow', 'cyan', 'lime', 'magenta', 'red', 'blue'];

    /*for (let i = 0; i < colors.length; ++i) {
        console.log("adding "+colors[i]);
        context.fillStyle = colors[i];
        context.fillRect(i / colors.length * 120, 0, 120 / colors.length, 120);
        encoder.addFrame(context);
    }*/
    console.log("finished adding frames");
    encoder.finish();
    console.log("finished encoder");
};


function createGifEncoder(resolution, response) {

    var encoder = new GIFEncoder(resolution.x, resolution.y);

    var stream = encoder.createReadStream();
    response.type("gif");
    stream.pipe(response);

    encoder.start();
    encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
    encoder.setDelay(100);  // frame delay in ms
    encoder.setQuality(15); // image quality. 10 is default.

    return encoder;
}
