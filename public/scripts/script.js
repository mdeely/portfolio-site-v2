$(document).ready(function() {
    init();

    function init() {
      gatherNodes();
      bindHandlers();

      projectListLoadBehavior();
      fullscreenImages();
      scrollToTop(this.$scrollToTop);
      lazyLoad();
    };

    function gatherNodes() {
      // Find all these via main node (which in this case is body?)
      $body = $('body'),
      this.$menuTrigger    = $('.menu-trigger');
      this.$menuFader      = $('.menu-fader');
      this.$projectFilters = $('li.design, li.code');
      this.$projects       = $('.portfolioLink');
      this.$images          = $('img');
      this.$fsImage        = $('.fullscreen-image');
      this.$scrollToTop    = $(".scrollToTop");
    }

    function bindHandlers() {
      $( this.$menuTrigger    ).bind( 'click', toggleMenuClasses );
      $( this.$menuFader      ).bind( 'click', toggleMenuClasses );
      $( this.$projectFilters ).bind( 'click', filterProjects );
      $( this.$images         ).bind( 'click', handleImageClick );
      $( this.$fsImage        ).bind( 'click', handleFsImageClick );
    }

    function filterProjects() {

      console.log(this.$projects);
      if ($(this).hasClass('activated')) {
        showAllProjects();
        return;
      }

      var filterClass = $(this).attr('class');
      $(this).addClass('activated');
      showProjects(filterClass);
    }

    function showAllProjects() {
      $(this.$projectFilters).removeClass('activated');
      $(this.$projects).removeClass('filterHide');
    }

    function showProjects(filterClass) {
      this.$projects.each( function(index, project) {
        if ( $(project).hasClass( filterClass ) ) {
          $(project).removeClass('filterHide');
        }
        else {
          $(project).addClass('filterHide');
        }
      });
    }

    function projectListLoadBehavior() {
      $('.container').addClass('fade');
      $('.portfolioLink, .collection-container').imagesLoaded( function() {
        $('.container').removeClass('fade');
      });
    }

    function lazyLoad() {
      $("img.lazy").lazyload({
        threshold : 350,
        effect : 'fadeIn'
      });
    }

    function fullscreenImages() {
      $(document).keyup(function(evt) {
        if (evt.keyCode == 39)
        {
          imageSlideshow("next");
        }

        if (evt.keyCode == 37)
        {
          imageSlideshow("previous");
        }
      });
    }

    function imageSlideshow(navigation) {
      if (navigation == "next") {
        alert("you pressed next!");
      }
      else if (navigation == "previous") {
        alert("you pressed previous!");
      }
    }

    function handleFsImageClick(fsImage) {
      var $fsImage = $(fsImage.target);

      $fsImage.empty().fadeOut(300);
      toggleNoScroll();
    }

    function handleImageClick(image) {
      var $image = $(image.target);

      if ($image.parent().hasClass('hero'))
        return

      var src = $image.attr('src');
      var desc = $image.next().contents().text();

      populateFullscreenImage(src, desc);

      // nextImg = $image.parent().next(".collection").children('img');
      // prevImg = $image.parent().prev(".collection").children('img');
    }

      function populateFullscreenImage(src, desc) {
        $(this.$fsImage).append('<img src='+src+'><p>'+desc+'</p>');
        $(this.$fsImage).fadeIn(200);
        toggleNoScroll();
      }

    function toggleNoScroll() {
      $('body').toggleClass('no-scroll');
    }

    function toggleMenuClasses() {
      $('.menu-trigger').toggleClass('triggered');
      $('.menu-container').toggleClass('open');
      $(".menu-fader").toggleClass('active');
      toggleNoScroll();
    }

    function scrollToTop(el) {
      $(document).scroll(function () {
          var y = $(this).scrollTop();
          if (y > 960) {
              el.fadeIn(200);
          } else {
              el.fadeOut(200);
          }
      });

      el.on('click', function(evt) {
        evt.preventDefault;
        $('html, body').animate({scrollTop:0},1000);
      });
    };
});