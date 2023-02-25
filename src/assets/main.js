var canvas = document.getElementById('canvas');
var modal = document.getElementById('myModal');
var span = document.getElementById('close');
var signaturePad = new SignaturePad(canvas, {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    minWidth: 3,
    maxWidth: 4,
    penColor: "rgb(33, 33, 33)"
});

function btn_click() {
    modal.style.display = "block";
    resizeCanvas();
}

function btn_clear() {
    document.getElementById('imgSign').src = '';
}

span.onclick = function () {
    modal.style.display = "none";
    document.getElementById('imgSign').src = signaturePad.toDataURL();
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        document.getElementById('imgSign').src = signaturePad.toDataURL();
    }
}

function resizeCanvas() {
    var w = modal.clientWidth;
    var h = modal.clientHeight;
    canvas.width = Math.ceil(w * 0.75);
    canvas.height = Math.ceil(h * 0.7);
    signaturePad.clear();
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();