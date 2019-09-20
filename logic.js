
var image = new Image();
image.onload = function() {
    setInterval(move, 100);
}

image.src = "images/greenhead.png";
var x = canvas.width - 100;

function move() {
    if(x > 10) {
        x -= 20;
    } else {
        x = canvas.width - 100;
    }


    //ctx.scale(0.001 * x, 0.001 * x);
    //ctx.rotate(-1 * Math.PI / 180);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, x, 300, 80, 80);
}

/*
ctx.lineWidth = 5;

ctx.strokeStyle = "green";
ctx.fillStyle = "green";
ctx.rect(300, 0, 100, 50);
ctx.fill();
ctx.shadowColor = "darkred";
ctx.shadowBlur = 5;
ctx.strokeStyle = "orange";
ctx.strokeText("SAS", 320, 20);
*/
    /*ctx.strokeStyle = "red";
    ctx.lineTo(i * 50, i % 2 == 0 ? i * 30 : i * 15);*/
    
/*
function printSquare(offset, size, color) {

    ctx.strokeStyle = color;
    ctx.strokeRect(offset, offset, size, size);
    ctx.stroke();
}
for (var i = 0; i < 20; i++) {
    
    printSquare(i * 5, i * 5, 'darkblue');
    printSquare((20 + i) * 5, i * 5, 'darkred');
    printSquare((40 + i) * 5, i * 5, 'darkgreen');

}
*/
