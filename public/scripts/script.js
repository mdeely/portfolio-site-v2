$(document).ready(function() {
    $body = $('body');
    $($body).addClass("js").delay(5000).queue(function(next){
        $(this).removeClass("js");
        next();
    });

    init();

    function init() {
      gatherNodes();
      bindHandlers();

      if ( $body.hasClass("photography-wrapper") ) {
        photographyInit();
      }
      else {
        projectListLoadBehavior();
        // fullscreenImages();
        scrollToTop(this.$scrollToTop);
        lazyLoad();
      }
    };

    function gatherNodes() {
      this.$menuTrigger        = $('.menu-trigger');
      this.$menuFader          = $('.menu-fader');
      this.$projectFilters     = $('li.design, li.code, li.ui');
      this.$projects           = $('.portfolioLink');
      this.$fsImage            = $('.fullscreen-image');
      this.$scrollToTop        = $(".scrollToTop");
      // this.$photoDrawerImgs    = $('.photo-drawer img');
      // this.$sideMenu           = $('.side_menu');


      // PHOTOGRAPHY VARS
      this.$photo_viewer       = $('.photo-collection .photo-view');
      this.$imageLinks         = $('.photo-wrapper .photo-item a');
      this.$albumMenuTrigger   = $('.album-trigger');
      this.$albumMenuLinks     = $('.album-collection a');
      this.$slideshowClose     = $('.slideshow-close .slide-action');
      this.$slideshowNext      = $('.slideshow-controls .slide-action.next');
      this.$slideshowPrev      = $('.slideshow-controls .slide-action.prev');
    }

    function bindHandlers() {
      $( this.$menuTrigger        ).bind( 'click', toggleMenuClasses );
      $( this.$menuFader          ).bind( 'click', toggleMenuClasses );
      $( this.$projectFilters     ).bind( 'click', filterProjects );
      $( this.$fsImage            ).bind( 'click', handleFsImageClick );
      $( this.$photoDrawerImgs    ).bind( 'click', selectPhoto);
      $( this.$sideMenu           ).bind( 'click', showSideMenu);
      $( window                   ).bind( 'swipeleft', generateNextIndex);
      $( window                   ).bind( 'swiperight', generatePreviousIndex);
      $( this.$bgPhotoDisplay     ).bind( 'click', handleBgPhotoDisplay);
      $( this.$photoDrawerImgs    ).bind( 'mouseenter', preloadImageOnHover);
      $( this.$fbLikeIcon         ).bind( 'click', handleFbLikeMenu);
      $( this.$logoContainer      ).bind( 'click', openLogoMenu);
      $( this.$albumSwitcher      ).bind( 'click', toggleAlbumSwitcher);
      // $( this.$fbCommentIcon      ).bind( 'click', handleFbCommentMenu);
      // $( this.$heroPhoto          ).bind( 'click', handleMenuAndDisplay);
      // $( this.$heroPhoto          ).bind( 'click', handleLogoMenu);



      // PHOTOGRAPHY BIND HANDLERS
      $( this.$albumMenuLinks     ).bind( 'click', handleAlbumPhotos);
      $( this.$albumMenuTrigger   ).bind( 'click', openAlbumCollection);
      $( this.$imageLinks         ).bind( 'click', handleImageClick );
      $( this.$albumListLinks     ).bind( 'click', handleAlbumLink);
      $( this.$slideshowClose     ).bind( 'click', handleImageClick);
      $( this.$slideshowNext      ).bind( 'click', handleNavigation);
      $( this.$slideshowPrev      ).bind( 'click', handleNavigation);
    }

    function photographyInit() {
      indexRange = setIndexRangeInit();

      getImageAttributes( indexRange.firstIndex );
      setSlideshowImage(  imgAttributes         );
      setAlbumThumbnailsInit();
      // revealMenuItems();
      // detectKeyPressPhotos();
      // observeFbLikeMenu();
      // observeFbCommentMenu();
      // Hides annoying "Loading" text on mobile when swiping up
      $.mobile.loading().hide();
    }

    function setIndexRangeInit() {
      var lastImg  = $('.photo-wrapper:last a')
      var last     = lastImg.attr("data-img-index");

      indexRange = {
        "firstAll" : 0,
        "lastAll" : last
      }

      getCurrentIndexRange();

      return indexRange
    }

    function getCurrentIndexRange() {
      var firstImg   = $('.photo-wrapper:visible:first a')
      var firstIndex = firstImg.attr("data-img-index");

      var lastImg  = $('.photo-wrapper:visible:last a')
      var lastIndex = lastImg.attr("data-img-index");

      indexRange.firstIndex = firstIndex;
      indexRange.lastIndex = lastIndex;

      return indexRange
    }

    function handleNavigation(evt) {
      var control = $(evt.target);
      getCurrentIndex();

      if ( control.hasClass('next') ) {
        if (  indexRange.currentIndex == indexRange.lastIndex ) {
          var desiredIndex = indexRange.firstIndex;
        }
        else {
          indexRange.currentIndex++;
          var desiredIndex = indexRange.currentIndex;
        }
      }

      if ( control.hasClass('prev') ) {
        if (  indexRange.currentIndex == indexRange.firstIndex ) {
          var desiredIndex = indexRange.lastIndex;
        }
        else {
          indexRange.currentIndex--;
          var desiredIndex = indexRange.currentIndex;
        }
      }

      getImageAttributes(desiredIndex);
      setSlideshowImage(imgAttributes);
    }

    function getCurrentIndex() {      
      var currentIndex = $('.photo-view img').attr('data-img-index');

      indexRange.currentIndex = currentIndex;

      return indexRange;
    }

    function getImageAttributes(desiredIndex) {
      var imageLink = $('.photo-wrapper').find("a[data-img-index="+desiredIndex+"]");

      imgAttributes = {
        src      : $(imageLink).data('img-src'),
        alt      : $(imageLink).data('alt'),
        title    : $(imageLink).data('title'),
        imgIndex : $(imageLink).data('img-index'),
      };

      return imgAttributes;
    }

    function setSlideshowImage(imgAttributes) {
      $(this.$photo_viewer).children('img').attr({
        "src"            : imgAttributes.src,
        "title"          : imgAttributes.title,
        "alt"            : imgAttributes.alt,
        "data-img-index" : imgAttributes.imgIndex,
      });

      preloadNextImage( imgAttributes.imgIndex );
    }

    function handleAlbumPhotos(evt) {
      evt.preventDefault();

      showAlbumPhotos(evt);
    }

    function showAlbumPhotos(evt) {
      var albumName = $(evt.target).data('album-link');
      var albumDisplay = $(evt.target).text();

      $('.album-collection li').removeClass('selected');
      $(evt.target).parent().addClass('selected');

      $('.current-album').text(albumDisplay);

      if  ( albumName == "All photos") {
        $(".photo-wrapper").show();

        getCurrentIndexRange();
      }
      else { 
        this.$imageLinks.each( function(index, link) {
          if ( $(link).data( 'album' ) !== albumName  ) {
            $(link).closest('.photo-wrapper').hide();
          }
          else {
            $(link).closest('.photo-wrapper').show();
          }
        });

        getCurrentIndexRange();
        getImageAttributes( indexRange.firstIndex );
        setSlideshowImage(imgAttributes);
      }
    }

    function preloadNextImage(index) {
      index++

      getImageAttributes(index);

      preloadImage(imgAttributes);
    }

    function preloadImage(imgAttributes) {
      $('.preloader').children('img').attr({
        "src"            : imgAttributes.src,
        "title"          : imgAttributes.title,
        "alt"            : imgAttributes.alt,
        "data-img-index" : imgAttributes.imgIndex,
      });
    }

    function setAlbumThumbnailsInit() {
      this.$albumMenuLinks.each( function(index, link) {
        if ( $(link).data('album-link') == "All photos" ) {
          var src = $(".photo-wrapper:eq(51) a").data("img-src");
          var src2 = $(".photo-wrapper:last a").data("img-src");
          var src3 = $(".photo-wrapper:first a").data("img-src");

          $(link).children('span:first').css("background-image", "url("+src+")");
          $(link).children('span:nth-child(2)').css("background-image", "url("+src2+")");
          $(link).children('span:last').css("background-image", "url("+src3+")");
        }
        else {
          var linkAlbum = $(link).data('album-link');
          var match = $(".photo-wrapper a[data-album='"+linkAlbum+"']:first");
          var src = $(match).data('img-src');
          $(link).children('span').css("background-image", "url("+src+")");
        }
      });

    }

















    function setDisplayPhoto() {
      if ( $(".photography-wrapper").length ) {
        if ( isPhotoNamePresentInUrl() ) {
          handlePathname();
        }
      }
    }

    function openAlbumCollection() {
      $('.album-trigger').toggleClass('triggered');
      $('.album-collection, .photo-collection').toggleClass('open');
    }

    function showAllPhotos() {
      $('.photo-wrapper').show();
      indexRange.firstIndex = indexRange.firstAll;
      indexRange.lastIndex = indexRange.lastAll;
    }

    function handleAlbumLink(evt) {
      evt.preventDefault();

      var href = $(this).attr('href')
      var albumName = href.replace('/', '');
      var albumNameFormatted = albumName.replace('/','');

      if ( $(this).attr('href') == "/all-photos") {
        $(".current-album").text("all photos");
        showAllPhotos();
      }
      else {
        $('.photo-drawer span').hide();
        $(".photo-drawer span."+albumName).show();

        $(".current-album").text(albumName);
      }

      getCurrentIndexRange();

      showPhotoFromIndex(indexRange.firstIndex);

      handlePathname(albumName);

      // update title + meta,
      // update display photo
      // update album switcher display
      // update url - shouldbe automatic from calling showPhoto?
    }

    function toggleAlbumSwitcher() {
      $(this).toggleClass('open')
    }

    function handleLogoMenu() {
      if ( $(".logo-container").hasClass("open") ) {
        $(".logo-container").removeClass("open");
      }
    }

    function openLogoMenu() {
      $(this).toggleClass("open");
      $(".side_menu").removeClass('open');
      $(".album-switcher").removeClass('open')

    }



    function revealMenuItems() {
      if ( $(".current-album").text() == "all photos" ) {
        showAllPhotos();
      }
    }

    function observeFbLikeMenu() {
      var target = document.querySelector('#fb-like-icon');

      var observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {

            if ( mutation.attributeName == "fb-xfbml-state" ) {
              if ( $(".fb-like").attr("fb-xfbml-state") == "rendered" ) {
                enableFbLike();
              }
              else {
                disableFbLike();
              }
            }
          });
      });

      observer.observe(target, {
        childList: true,
        attributes: true,
        subtree: true
      });
    }

    // function observeFbCommentMenu() {
    //   var target = document.querySelector('#fb-comment-wrapper');

    //   var observer = new MutationObserver(function(mutations) {
    //       mutations.forEach(function(mutation) {

    //         if ( mutation.attributeName == "fb-xfbml-state" ) {
    //           if ( $(".fb-comments").attr("fb-xfbml-state") == "rendered" ) {
    //             enableFbComment();
    //           }
    //           else {
    //             disableFbComment();
    //           }
    //         }
    //       });
    //   });
    //
    //   observer.observe(target, {
    //     childList: true,
    //     attributes: true,
    //     subtree: true
    //   });
    // }

    function disableFbLike() {
      $('#fb-like-icon').addClass('disabled');
    }

    function enableFbLike() {
      if ( $('#fb-like-icon').attr('data-state') == 'open' ) {
        showFbLikeMenu();
      }
      $('#fb-like-icon').removeClass('disabled');
    }

    // function disableFbComment() {
    //   $('#fb-comment-icon').addClass('disabled');
    // }

    // function enableFbComment() {
    //   if ( $('#fb-comment-icon').attr('data-state') == 'open' ) {
    //     showFbLikeMenu();
    //   }
    //   $('#fb-comment-icon').removeClass('disabled');
    // }


    function handleFbLikeMenu() {
      showFbLikeMenu();
    }

    // function handleFbCommentMenu() {
    //   showFbCommentMenu();
    // }

    function showFbLikeMenu() {
      this.$fbLikeIcon.toggleClass('open');
    }

    // function showFbCommentMenu() {
    //   this.$fbCommentIcon.toggleClass('open');
    // }

    function handlePathname(albumName) {
      if ( albumName ) {
      }
      else {
        var photoName  = getPhotoNameFromPathname();
        var index      = getIndexFromPhotoName(photoName);

        showPhotoFromIndex(index);
      }
    }

    function getPhotoNameFromPathname() {
      var pathnameString = window.location.pathname;
      var photoName = pathnameString.substr(pathnameString.lastIndexOf('/') + 1);
      return photoName;
    }

    function getIndexFromPhotoName(photoName) {
      var element = "a[href*='"+photoName+"']";
      var image   = $(this.$sideMenu).find(element).children('img');
      var index   = $(image).attr('data-img-index');
      return index;
    }

    function isPhotoNamePresentInUrl() {
      var pathName = window.location.pathname;
      var photoName = pathName.substr(pathName.lastIndexOf('/') + 1);

      if ( photoName === "photography" ) {
        return false
      }
      else {
        return true
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
      $(this.$bgPhotoDisplay).removeClass().addClass('action bg-photo-display ' +klass);
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
            $keyPressed == 70 || // f
            $keyPressed == 32    // space
          )
        {
          if ($keyPressed == 37 || $keyPressed == 38) {
            generatePreviousIndex();
          }
          else if ($keyPressed == 39 ||
                   $keyPressed == 40 ||
                   $keyPressed == 32)
          {
            generateNextIndex();
          }
          else if ($keyPressed == 13 || $keyPressed == 70) {
            handleBgPhotoDisplay();
          }

        }
      });
    }

    function generatePreviousIndex() {
      generateIndex("previous");
    }

    function generateNextIndex() {
      generateIndex("next");
    }

    function generateIndex(direction) {
      handleLogoMenu();
      var currentIndex = getCurrentIndex();

      if ( direction == "previous" ) {
        if ( currentIndex < indexRange.firstIndex || currentIndex == indexRange.firstIndex ) {
          var index = indexRange.lastIndex;
        }
        else {
          var index = --currentIndex;
        }
      }

      if ( direction == "next" ) {
        if (  currentIndex == indexRange.lastIndex ) {
          var index = indexRange.firstIndex;
        }
        else {
          var index = ++currentIndex;
        }
      }

      showPhotoFromIndex(index);
    }

    function showPhotoFromIndex(index) {
      var index = index > 0 ? index : 0;

      var image = $(this.$sideMenu).find('img[data-img-index="'+index+'"]');

      showPhoto(image);

      preloadImageFromIndex(index);
    }

    function preloadImageOnHover(evt) {
        var image = evt.target;
        var index = $(image).attr('data-img-index');
        var index = --index;
        preloadImageFromIndex(index);
    }

    function preloadImageFromIndex(index) {
      if ( index <= indexRange.firstIndex ) {
        index = indexRange.lastIndex
      }
      else if ( index >= indexRange.lastIndex) {
        index = indexRange.firstIndex
      }
      else {
        var index = ++index;
      }

      var image = $(this.$sideMenu).find('img[data-img-index="'+index+'"]');

      var srcRaw   = image.attr('src');
      var src      = srcRaw.replace('-sm','');

      var img = $('<img />', {"src" : src});

      if ( !$(this.$preloadedImg).find('img[src*="'+src+'"]').length ) {
        $(this.$preloadedImg).append(img);
      }
    }

    function getLastIndex() {
      var lastIndex = $(this.$sideMenu).find('.photo-drawer a:last img');
      var currentIndex = $(lastIndex).attr("data-img-index");
      var currentIndex = ++currentIndex

      return currentIndex;
    }

    // function getCurrentIndex() {
    //   var currentImage = $(this.$sideMenu).find(".active");
    //   var currentIndex = $(currentImage).attr('data-img-index');

    //   return currentIndex
    // }

    function handleMenuAndDisplay() {
      toggleMenuTogglePhotoDisplay();
    }

    function toggleMenuTogglePhotoDisplay() {
      if ( $(this.$sideMenu).hasClass('open') || $(this.$logoContainer).hasClass('open') ) {
        $(this.$sideMenu).removeClass('open');
        $(this.$albumSwitcher).removeClass('open');
        $(this.$logoContainer).removeClass('open');
        return false
      }
      else {
        generateNextIndex();
      }
    }

    function showSideMenu(sideMenu) {
      $(this).addClass('open');
      $(".logo-container").removeClass('open')
    }

    function selectPhoto(evt) {
      evt.preventDefault();

      var image = $(evt.target);
      showPhoto(image);
    }

    function showPhoto(image) {
      var $containerPhoto = $(".container.photography");

      var srcRaw     = image.attr('src');
      var imgIndex   = image.attr('data-img-index');
      var albumName  = image.attr('data-album');
      var src        = srcRaw.replace('-sm','');
      var src2x      = srcRaw.replace('-sm','@2x');
      var bgImgUrl   = "url('"+src+"')";
      var bgImgUrl2x = "-webkit-image-set( url('"+src+"') 1x, url('"+src2x+"') 2x )";

      removeActiveClass();
      image.addClass("active");
      // scroll image in to view

      // update attribute
      // $containerPhoto.attr({
      //   "data-image-index": imgIndex,
      //   "data-rjs":"2"
      //   // Disable the following code to enable 1x and 2x images
      //   // "style": "background-image:"+bgImgUrl+";background-image:"+bgImgUrl2x+""
      // });

      $($containerPhoto).css("background-image", bgImgUrl);

      var imgTitle = image.attr('title')

      // update this to use push state
      var href     = $(image).parent().attr("href");
      var url      = (window.location.origin)+href;

      history.replaceState(null, imgTitle, href);

      // This is mostly for bookmarking. Not for Open Graph or SEO
      document.title = imgTitle+" | Marc Deely - Photography";
      $('meta[name=description]').attr('content', (imgTitle+" by Marc Deely"));
      $('meta[property=og\\:url]').attr('content', url);
      $('meta[property=og\\:title]').attr('content', imgTitle);
      $('meta[property=og\\:image]').attr('content', src);
      $(".fb-like").attr( "data-href", url);

      if ( $(this.$fbLikeIcon).hasClass('open') ) {
        $(this.$fbLikeIcon).attr('data-state', 'open');
      }
      else {
        $(this.$fbLikeIcon).attr('data-state', '');
      }
      $(this.$fbLikeIcon).removeClass('open');

      if ( $(this.$fbCommentIcon).hasClass('open') ) {
        $(this.$fbCommentIcon).attr('data-state', 'open');
      }
      else {
        $(this.$fbCommentIcon).attr('data-state', '');
      }
      $(this.$fbCommentIcon).removeClass('open');

      // Update FB Menu
      setFbLike(url);

      // retinajs( $containerPhoto );

      // Fire off GA event
      ga("send", "event", "Photography", "viewed", src+': '+imgTitle)
    }

    function setFbLike(url) {
      $(this.$fbLikeIcon).html("<div class='fb-like' data-href='"+url+"', data-layout='box_count', data-action='like', data-size='small', data-show_faces='true', data-share='true'></div>");
      // $(this.$fbCommentWrapper).html("<div class='fb-comments' data-href='"+url+"' data-mobile='true' data-numposts='5'></div>");

      if (typeof FB !== 'undefined') {
          FB.XFBML.parse(document.getElementById('fb-like-icon'));
          // FB.XFBML.parse(document.getElementById('fb-comment-wrapper'));
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
        var filterClass = $(filter).attr('data-name');
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
      image.preventDefault();

      // var $image = $(image.target);

      // if ($image.parent().hasClass('hero'))
      //   return

      // var src = $image.attr('src');
      // var desc = $image.next().contents().text();

      // populateFullscreenImage(src, desc);
      var photo_wrapper    = $(".photo-collection .photo-wrapper");
      var photo_collection = $(".photo-collection");
      var image_target     = $(image.target);


      if ( $(photo_wrapper).hasClass("selected") ) {
        $(photo_collection).removeClass("single-view");
        $(photo_wrapper).removeClass("selected");
      } else {
        $(photo_collection).addClass("single-view");
        $(image_target).parent().parent().addClass("selected");

        // setSlideshowImage(imgIndex);

        var srcRaw      = $(image_target).data('img-src');
        var alt         = $(image_target).data('alt');
        var title       = $(image_target).data('title');
        var imgIndex    = $(image_target).data('img-index');


        $(".photo-view img").attr({
            "src": srcRaw,
            "alt": alt,
            "title": title,
            "data-img-index": imgIndex
          });
      }

        toggleNoScroll();
    }

      function populateFullscreenImage(src, desc) {
        $(this.$fsImage).append('<img src='+src+'><p>'+desc+'</p>');
        $(this.$fsImage).fadeIn(200);
        toggleNoScroll();
      }

    function toggleNoScroll() {
      $body.toggleClass('no-scroll');
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