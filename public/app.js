// app.js
// Written by tompl

scrollIntervalID = setInterval(stickIt, 10);
var global_position = 0;

function stickIt() {
    var orgElementPos= $('.original').offset();

    if (orgElementPos){
        orgElementTop = orgElementPos.top;

        if ($(window).scrollTop() >= (orgElementTop)) {
            // scrolled past the original position; now only show the cloned, sticky element.
            // Cloned element should always have same left position and width as original element.
            orgElement = $('.original');
            coordsOrgElement = orgElement.offset();
            leftOrgElement = coordsOrgElement.left;
            widthOrgElement = orgElement.css('width');
            $('.cloned').css('left',leftOrgElement+'px')
                .css('top',0)
                .css('width',widthOrgElement)
                .show();
            $('.original').css('visibility','hidden');
        } else {
            // not scrolled past the menu; only show the original menu.
            $('.cloned').hide();
            $('.original').css('visibility','visible');
        }
    }
}

function onScroll(event){

    var scrollPos = $(document).scrollTop();
    // There is a menu item with not a ID href but a IP address. This function only works on elements with Ids
    // Therefor we use nav a with a expression
    var target = scrollPos > 400 ? '.cloned a[href^="#"]' : '.original a[href^="#"]';
    $(target).each(function () {

        var currLink = $(this);
        var refElement = $(currLink.attr("href"));

        let section_percentage;
        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            var position = $(this).parent().position();
            currLink.addClass("active");

            section_percentage = Math.round(currLink.position().left / $(window).width() * 100) + 12.5
            section_percentage -= (5.5 / $(window).width() * 100).toFixed(2)


            if (section_percentage != global_position) {
                global_position = section_percentage
                parent = '.' + currLink.parent().parent().parent()[0].className.split(' ')[1]

                $(parent + ' #progress-bar').animate({'width': section_percentage + '%'});
            }

        } else {
            currLink.removeClass("active");
        }
    });
}

$(document).ready(function () {
    // Create a clone of the menu, right next to original.
    $('.menu').addClass('original')
        .clone()
        .insertAfter('.menu')
        .addClass('cloned')
        .css('position','fixed')
        .css('top','0')
        .css('margin-top','0')
        .css('z-index','500')
        .removeClass('original')
        .hide();

    $(document).on("scroll", onScroll);

    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        $(document).off("scroll");

        $('a').each(function () {
            $(this).removeClass('active');
        })
        $(this).addClass('active');

        var target = this.hash,
            menu = target;

        $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top+2
        }, 500, 'swing', function () {
            window.location.hash = target;
            $(document).on("scroll", onScroll);
        });
    });


});

$(window).on('load', function(){
    onScroll();
});
