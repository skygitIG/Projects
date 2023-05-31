const responsive = {
    0: {
        items: 1
    },
    320: {
        items: 1
    },
    550: {
        items: 2
    },
    960: {
        items: 3
    },
    1400: {
        items: 4
    }
}

$(document).ready(function(){
    $nav = $(".nav");
    $toggleCollapse= $(".toggle-collpase");

    $toggleCollapse.click(function(){
        $nav.toggleClass("collapse");
    })

    //owl crosuel

    $('.owl-carousel').owlCarousel({
        loop:true,
        autoplay:true,
        autoplayTimeout:4000,
        dots:false,
        nav:true,
        responsive:responsive
    });

    //click to scroll top

    $('.move-up span').click(function(){
        $('html, body').animate({
            scrollTop:0
        }, 1000);
    })


    //annimation on scroll 
    AOS.init( );
    

});