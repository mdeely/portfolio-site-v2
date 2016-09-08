$(document).ready(function() {
    init();

    function init() {
      gatherNodes();
      bindHandlers();

      setDisplayPhoto();
      projectListLoadBehavior();
      // fullscreenImages();
      detectKeyPressPhotos();
      scrollToTop(this.$scrollToTop);
      lazyLoad();
    };

    function gatherNodes() {
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
      this.$bgPhotoDisplay  = $('a.bg-photo-display');
      this.$preloadedImg    = $(".preload-image-container");
    }

    function bindHandlers() {
      $( this.$menuTrigger      ).bind( 'click', toggleMenuClasses );
      $( this.$menuFader        ).bind( 'click', toggleMenuClasses );
      $( this.$projectFilters   ).bind( 'click', filterProjects );
      $( this.$images           ).bind( 'click', handleImageClick );
      $( this.$fsImage          ).bind( 'click', handleFsImageClick );
      $( this.$photoDrawerImgs  ).bind( 'click', selectPhoto);
      $( this.$sideMenu         ).bind( 'click', showSideMenu);
      $( window                 ).bind( 'swipeleft', generateNextIndex);
      $( window                 ).bind( 'swiperight', generatePreviousIndex);
      $( this.$heroPhoto        ).bind( 'click', handleMenuAndDisplay);
      $( this.$bgPhotoDisplay   ).bind( 'click', handleBgPhotoDisplay);
    }

    function handlePathname() {
      var photoName  = getPhotoNameFromPathname();
      var index      = getIndexFromPhotoName(photoName);
      showPhotoFromIndex(index);
    }

    function getPhotoNameFromPathname() {
      var pathnameString = window.location.pathname;
      var photoName = pathnameString.replace('/photography/','');
      return photoName;
    }

    function getIndexFromPhotoName(photoName) {
      var element = "a[href='/"+photoName+"']";
      var image   = $(this.$sideMenu).find(element).children('img');
      var index   = $(image).attr('data-img-index');
      return index;
    }

    function isPhotoNamePresentInUrl() {
      var origin = window.location.origin;
      if ( window.location.href === (origin+"/photography") ) {
        return false
      }
      else {
        return true
      }
    }

    function setDisplayPhoto() {
      if ( $(".photography-wrapper").length ) {
        if ( isPhotoNamePresentInUrl() ) {
          handlePathname();
        }
        else {
          var lastIndex = getLastIndex();
          var lastIndex = --lastIndex;

          var index = Math.floor(Math.random() * lastIndex) + 0;

          showPhotoFromIndex(index);
        }
      }
    }

    function handleBgPhotoDisplay() {
      if ( bgPhotoDisplayState() === "showing-all") {
        updateBgPhotoDisplayIcon("fill-screen");
        photoBgSize("cover")
      }
      else if ( bgPhotoDisplayState() === "fullscreened") {
        updateBgPhotoDisplayIcon("show-all");
        photoBgSize("contain")
      }
    }

    function updateBgPhotoDisplayIcon(klass) {
      $(this.$bgPhotoDisplay).removeClass().addClass('bg-photo-display ' +klass);
    }

    function bgPhotoDisplayState() {
      if ( $(this.$bgPhotoDisplay).hasClass('show-all') ) {
        return "showing-all"
      }
      else {
        return "fullscreened"
      }
    }

    function photoBgSize(property) {
      $(this.$heroPhoto).css({
        "background-size": property
        });
    }

    function detectKeyPressPhotos() {
      $(document).keyup(function(evt) {
        var $keyPressed = evt.keyCode;

        if ($keyPressed == 37 || // left
            $keyPressed == 38 || // up
            $keyPressed == 39 || // right
            $keyPressed == 40 || // down
            $keyPressed == 13 || // enter
            $keyPressed == 9  || // tab
            $keyPressed == 87 || // w
            $keyPressed == 65 || // a
            $keyPressed == 83 || // s
            $keyPressed == 68 || // d
            $keyPressed == 70 || // f
            $keyPressed == 32    // space
          )
        {

          if ($keyPressed == 37 || $keyPressed == 38 || $keyPressed == 87 || $keyPressed == 65) {
            generatePreviousIndex();
          }
          else if ($keyPressed == 39 ||
                   $keyPressed == 40 ||
                   $keyPressed == 9  ||
                   $keyPressed == 83 ||
                   $keyPressed == 68 ||
                   $keyPressed == 13)
          {
            generateNextIndex();
          }
          else if ($keyPressed == 32 || $keyPressed == 70) {
            handleBgPhotoDisplay();
          }

        }
      });
    }

    function generatePreviousIndex() {
      var currentIndex = getCurrentIndex();

      if (currentIndex == 0) {
        var currentIndex = getLastIndex();
      }

      var previousIndex = --currentIndex;

      showPhotoFromIndex(previousIndex);
    }

    function generateNextIndex() {
      var currentIndex = getCurrentIndex();
      var lastIndex = getLastIndex();
      var lastIndex = (lastIndex - 1);

      if ( currentIndex == lastIndex ) {
        var currentIndex = -1;
      }

      var nextIndex = ++currentIndex;
      showPhotoFromIndex(nextIndex);
    }

    function showPhotoFromIndex(index) {
      var index = index > 0 ? index : 0;

      var image = $(this.$sideMenu).find('img[data-img-index="'+index+'"]');

      showPhoto(image);

      preloadImageFromIndex(index);
    }

    function preloadImageFromIndex(index) {
      var index = ++index;

      // $(this.$preloadedImg).empty();

      var image = $(this.$sideMenu).find('img[data-img-index="'+index+'"]');

      var srcRaw   = image.attr('src');
      var src      = srcRaw.replace('-sm','');

     var img = $('<img />', {"src" : src});

      $(this.$preloadedImg).append(img);
    }

    function getLastIndex() {
      var lastIndex = $(this.$sideMenu).find('.photo-drawer a:last img');
      var currentIndex = $(lastIndex).attr("data-img-index");
      var currentIndex = ++currentIndex

      return currentIndex;
    }

    function getCurrentIndex() {
      var currentImage = $(this.$sideMenu).find(".active");

      if ( $(currentImage).is(":first") ) {
        return false
      }
      else if ( $(currentImage).is(":last") ) {
        var currentIndex = -1;
        return currentIndex;
      }
      else {
        var currentIndex = $(currentImage).attr("data-img-index");
        return currentIndex;
      }
    }

    function handleMenuAndDisplay() {
      toggleMenuTogglePhotoDisplay();
    }

    function toggleMenuTogglePhotoDisplay() {
      if ( $(this.$sideMenu).hasClass('open') ) {
        $(this.$sideMenu).removeClass('open')
        return false
      }
      else {
        generateNextIndex();
      }
    }

    function showSideMenu(sideMenu) {
      $(this).addClass('open');
    }

    function selectPhoto(image) {
      event.preventDefault();

      var image = $(image.target)
      showPhoto(image);
    }

    function showPhoto(image) {
      var $containerPhoto = $(".container.photography");

      var srcRaw   = image.attr('src');
      var imgIndex = image.attr('data-img-index');
      var src      = srcRaw.replace('-sm','');

      removeActiveClass();

      image.addClass("active");

      $containerPhoto.attr("data-image-index", imgIndex);
      $containerPhoto.css({
        "background-image": "url('"+src+"')"
        });

      var imgTitle = image.attr('title')

      // update this to use push state
      var href        = $(image).parent().attr("href");
      var newPathname = "/photography"+href;

      history.replaceState(null, imgTitle, newPathname);

      ga("send", "event", "Photography", "viewed", src+': '+imgTitle)
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

    // function fullscreenImages() {
    //   $(document).keyup(function(evt) {
    //     if (evt.keyCode == 39)
    //     {
    //       imageSlideshow("next");
    //     }

    //     if (evt.keyCode == 37)
    //     {
    //       imageSlideshow("previous");
    //     }
    //   });
    // }

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