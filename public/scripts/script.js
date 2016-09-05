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
      this.$menuTrigger     = $('.menu-trigger');
      this.$menuFader       = $('.menu-fader');
      this.$projectFilters  = $('li.design, li.code');
      this.$projects        = $('.portfolioLink');
      this.$images          = $('img');
      this.$fsImage         = $('.fullscreen-image');
      this.$scrollToTop     = $(".scrollToTop");
      this.$photoDrawerImgs = $('.photo-drawer img');
      this.$sideMenu        = $('.side_menu')
      this.$heroPhoto       = $('.container.photography');
    }

    function bindHandlers() {
      $( this.$menuTrigger      ).bind( 'click', toggleMenuClasses );
      $( this.$menuFader        ).bind( 'click', toggleMenuClasses );
      $( this.$projectFilters   ).bind( 'click', filterProjects );
      $( this.$images           ).bind( 'click', handleImageClick );
      $( this.$fsImage          ).bind( 'click', handleFsImageClick );
      $( this.$images           ).bind( 'contextmenu', function(evt) { return false });
      $( this.$photoDrawerImgs  ).bind( 'click', showPhoto);
      $( this.$sideMenu         ).bind( 'click', showSideMenu);
      $( this.$heroPhoto        ).bind( 'click', hideSideMenu);
    }

    function hideSideMenu() {
      hideSideMenuFunction();
    }

    function hideSideMenuFunction() {
      $(this.$sideMenu).removeClass('open');
    }

    function showSideMenu(sideMenu) {
      $(this).addClass('open');
    }

    function showPhoto(image) {
      var $image = $(image.target)
      var $containerPhoto = $(".container.photography");

      var srcRaw = $image.attr('src');
      var src = srcRaw.replace('-sm','');

      if ($image.hasClass("active")) {
        $image.removeClass("active");
        $containerPhoto.css({
          "background-image": "",
          "background-size": ""
          });
      }
      else {
        removeActiveClass();

        $image.addClass("active");

        $containerPhoto.css({
          "background-image": "url('"+src+"')",
          "background-size": "contain"
          });
      }
    }

    function removeActiveClass() {
      this.$photoDrawerImgs.removeClass("active");
    }

    function filterProjects() {
      handleFilterDisplay( this );
    }

    function handleFilterDisplay( filter ) {
      if ( $(filter).hasClass('activated') ) {
        $(filter).removeClass('activated');
        showHiddenProjects();
      }
      else {
        var filterClass = $(filter).attr('class');
        $( this.$projectFilters ).removeClass('activated');
        $(filter).addClass('activated');

        displayFilteredProjects( filterClass );
        // hide all non-relevant projects
        // show all relevant projects
      }

    }

    function displayFilteredProjects(filterClass) {
      this.$projects.each( function(index, project) {
        if ( !$(project).hasClass( filterClass ) ) {
          $(project).hide();
        }
        else {
          $(project).show();
        }
      });
    }

    function showHiddenProjects() {
      this.$projects.each( function(index, project) {
        if ( !$(project).is('visible') ) {
          $( project ).show();
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

    // function imageSlideshow(navigation) {
    //   if (navigation == "next") {
    //     alert("you pressed next!");
    //   }
    //   else if (navigation == "previous") {
    //     alert("you pressed previous!");
    //   }
    // }

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