document.addEventListener("contextmenu", e => e.preventDefault());

document.addEventListener("keydown", e => {
    if (e.keyCode === 123) {
        e.preventDefault();
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
    }
    if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
    }
});

document.querySelectorAll('img, .friend-block').forEach(function(e) {
    e.setAttribute('draggable', 'false');
});
document.addEventListener('dragstart', function(e) {
    e.preventDefault();
});