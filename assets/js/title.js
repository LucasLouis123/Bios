function animateTitle(Title,delay){
    let counter=0;
    let direction=true;
    setInterval(function(){
    if(counter==Title.length)direction=false;
    if(counter==false)direction=true;
    counter=(direction==true)?++counter:--counter;
    newtitle=(counter==0)?"_":Title.slice(0,counter);
    document.title=newtitle;
    },delay);
}
animateTitle('@x1nf',300);