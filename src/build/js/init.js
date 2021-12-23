/*-----------------------------------------------------------------------------------
/*
/* Init JS
/*
-----------------------------------------------------------------------------------*/

jQuery(document).ready(function($) {

  /*----------------------------------------------------*/
  /* Highlight the current section in the navigation bar
  ------------------------------------------------------*/
    var sections = $("section");
    var navigation_links = $(".navbar a");
  
    sections.waypoint({
  
        handler: function(event, direction) {
  
         var active_section;
  
        active_section = $(this);
        if (direction === "up") active_section = active_section.prev();
  
        var active_link = $('.navbar a[href="#' + active_section.attr("id") + '"]');
  
           navigation_links.parent().removeClass("current");
        active_link.parent().addClass("current");
  
      },
      offset: '35%'
  
    });
    console.log('section : ',sections)
  
  
  });
  

  
  
  
  