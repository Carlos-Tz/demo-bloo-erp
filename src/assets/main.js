var canvas = document.getElementById('canvas');
var modal = document.getElementById('myModal');
var span = document.getElementById('close');
var span1 = document.getElementById('close1');
var done = document.getElementById('done');
var signaturePad = new SignaturePad(canvas, {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    minWidth: 3,
    maxWidth: 4,
    penColor: "rgb(33, 33, 33)"
});

function btn_click(ev) {
    modal.style.display = "block";
    resizeCanvas();
    var span2 = document.getElementById('id_note');
    span2.value = ev.id;
}

function btn_clear() {
    document.getElementById('imgSign').src = '';
}

span.onclick = function () {
    modal.style.display = "none";
    /* document.getElementById('imgSign').src = signaturePad.toDataURL(); */
}

span1.onclick = function () {
    modal.style.display = "none";
    /* document.getElementById('imgSign').src = signaturePad.toDataURL(); */
}

done.onclick = function () {
    modal.style.display = "none";
    document.getElementById('imgSign').src = signaturePad.toDataURL();
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        /* document.getElementById('imgSign').src = signaturePad.toDataURL(); */
    }
}

function resizeCanvas() {
    var w = modal.clientWidth;
    var h = modal.clientHeight;
    canvas.width = Math.ceil(w * 0.75);
    canvas.height = Math.ceil(h * 0.60);
    signaturePad.clear();
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();