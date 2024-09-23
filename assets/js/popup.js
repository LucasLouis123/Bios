document.getElementById('dc-pfp').addEventListener('click', function() {
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('overlay');

    popup.style.display = 'block';
    overlay.style.display = 'block';

    setTimeout(() => {
        popup.classList.add('show');
        overlay.classList.add('show');
    }, 10);
});

function closePopup() {
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('overlay');

    popup.classList.remove('show');
    overlay.classList.remove('show');

    setTimeout(() => {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    }, 300);
}
