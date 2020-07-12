let butn = document.querySelector('button');
let nav = document.querySelector('.sidenav');
let close = document.querySelector('.close');

butn.addEventListener('click', () => {
    nav.style.width = '250px';
    btn.style.color = 'white';
});

close.addEventListener('click', () => {
    nav.style.width = '0px';
    btn.style.color = 'black';
})