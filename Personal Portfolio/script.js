function main() {

    (function () {
        'use strict';
      /* ==============================================
         Page Scrolling
         =============================================== */

        $('a.scroll-nav').click(function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top - 40
                    }, 900);
                    return false;
                }
            }
        });

        /*====================================
         Show Menu on Book
         ======================================*/
        $(window).bind('scroll', function() {
            var navHeight = $(window).height() - 100;
            if ($(window).scrollTop() > navHeight) {
                $('.navbar-default').addClass('on');
            } else {
                $('.navbar-default').removeClass('on');
            }
        });
        /* ==============================================
         Scroll Spy
         =============================================== */
        $('body').scrollspy({
            target: '.navbar-default',
            offset: 80
        })
     
       }());
      }
main();
