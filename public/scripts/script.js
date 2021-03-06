$(document).ready(function() {
    $body = $('body');
    $($body).addClass("js").delay(3000).queue(function(next){
        $(this).removeClass("js");
        next();
    });

    init();

    function init() {
      gatherNodes();
      bindHandlers();

      if ( $body.hasClass("photography-wrapper") ) {
        photographyInit();
        $(".photo-collection").delay( 1000 ).fadeTo("slow", 1);
        $(".album-collection").delay( 1000 ).fadeTo("slow", 1);
        $(".photo-nav").delay( 1000 ).fadeTo("slow", 1);
      }
      else {
        projectListLoadBehavior();
        scrollToTop(this.$scrollToTop);
        lazyLoad();
      }
    };

    function gatherNodes() {
      this.$menuTrigger         = $('.menu-trigger');
      this.$menuFader           = $('.menu-fader');
      this.$projectFilters      = $('li.design, li.code, li.ui');
      this.$projects            = $('.portfolioLink');
      this.$scrollToTop         = $(".scrollToTop");
      this.$projectImgs         = $(".collection img");
      this.$fullscreenContainer = $(".fullscreen-image");
      // this.$photoDrawerImgs     = $('.photo-drawer img');
      // this.$sideMenu            = $('.side_menu');

      // PHOTOGRAPHY VARS
      this.$photo_collection    = $('.photo-collection');
      this.$photo_viewer        = $('.photo-collection .photo-view');
      $imageLinks               = $('.photo-wrapper .photo-item a');
      this.$albumMenuLinks      = $('.album-collection a');
      $albumPosters             = $('.photo-wrapper a img[data-poster]');
      this.$albumMenuTrigger    = $('.logo, .current-album-wrapper');
      this.$slideshowClose      = $('.slideshow-close .slide-action');
      this.$slideshowNext       = $('.slideshow-controls .slide-action.next');
      this.$slideshowPrev       = $('.slideshow-controls .slide-action.prev');
      this.$slideshowFull       = $('.slideshow-controls .slide-action.fullscreen');
      this.$bgImg               = $('.bgImg');
      this.$fbLikeIcon          = $('.slide-action.fb-like-container');
    }

    function bindHandlers() {
      $( this.$menuTrigger        ).bind( 'click', toggleMenuClasses );
      $( this.$menuFader          ).bind( 'click', toggleMenuClasses );
      $( this.$projectFilters     ).bind( 'click', filterProjects );
      $( this.$projectImgs        ).bind( 'click', fsImage );
      $( this.$fullscreenContainer).bind( 'click', closeFsImage );


      // $( this.$photoDrawerImgs    ).bind( 'click', selectPhoto);
      $( this.$sideMenu           ).bind( 'click', showSideMenu);
      // $( window                   ).bind( 'swipeleft', generateNextIndex);
      // $( window                   ).bind( 'swiperight', generatePreviousIndex);
      $( this.$bgPhotoDisplay     ).bind( 'click', handleBgPhotoDisplay);
      // $( this.$photoDrawerImgs    ).bind( 'mouseenter', preloadImageOnHover);
      $( this.$fbLikeIcon         ).bind( 'click', handleFbLikeMenu);
      $( this.$logoContainer      ).bind( 'click', openLogoMenu);
      $( this.$albumSwitcher      ).bind( 'click', toggleAlbumSwitcher);
      $( this.$slideshowFull      ).bind( 'click', enableFullscreenMode);
    

      // $( this.$fbCommentIcon      ).bind( 'click', handleFbCommentMenu);
      // $( this.$heroPhoto          ).bind( 'click', handleMenuAndDisplay);
      // $( this.$heroPhoto          ).bind( 'click', handleLogoMenu);


      // PHOTOGRAPHY BIND HANDLERS
      $( this.$albumMenuLinks     ).bind( 'click', handleAlbumPhotos);
      $( this.$albumMenuTrigger   ).bind( 'click', openAlbumCollection);
      $( $imageLinks              ).bind( 'click', handleImageClick );
      $( this.$slideshowClose     ).bind( 'click', handleCloseButton);
      $( this.$slideshowNext      ).bind( 'click', handleNavigation);
      $( this.$slideshowPrev      ).bind( 'click', handleNavigation);
      $( window                   ).bind( 'swipeleft', requestNextImage);
      $( window                   ).bind( 'swiperight', requestPreviousImage);
    }

    function photographyInit() {
      indexRange = setIndexRangeInit();

      setAlbumThumbnailsInit();
      setDisplayPhoto();
      detectKeyPressPhotos();

      if ( ! Modernizr.objectfit ) {
        $('.photo-wrapper').each(function () {
          var $container = $(this),
              imgUrl = $container.find('img').prop('src');
          if (imgUrl) {
            $container
              .find('a').css('backgroundImage', 'url(' + imgUrl + ')')
              .addClass('object-fit-fallback');
          }  
        });
      }

      // revealMenuItems();
      // observeFbLikeMenu();
      // observeFbCommentMenu();

      // Hides annoying "Loading" text on mobile when swiping up
      $.mobile.loading().hide();
    }

    function setDisplayPhoto() {
      isPhotoNamePresentInUrl()
      // if not then get first index;
    }

    function isPhotoNamePresentInUrl() {
      var pathName       = window.location.pathname;
      var pathArray      = pathName.split('/', 4).map(function(item) { return item.trim() });
      var objectFromUrl  = [];

      if ( !pathArray[3] && !pathArray[2] ) {
        // Root
        objectFromUrl = {
          type: "none",
          name: "photogrpahy"
        }

        getImageAttributes( indexRange.firstIndex );
        setSlideshowImage(  imgAttributes         );

      } else if ( pathArray[3] && pathArray[2] ) {
        // Photo
        var photoName = pathArray[3];

        objectFromUrl = {
          type: "photo",
          name: photoName
        }

        handlePathname(objectFromUrl);
        openAlbumCollection(false);
      } else {
          // Album
          var albumName = pathArray[2];

          var albumLinkElement = $(".album-collection a[data-album-link="+albumName+"]");

          objectFromUrl = {
            type: "album",
            name: albumName
          }

          showAlbumPhotos(albumLinkElement);
          getImageAttributes( indexRange.firstIndex );
          setBgHeroImage(imgAttributes);
      }
    }

    function setFirstImageAsBg(imgAttributes) {

    }

    function handlePathname(objectFromUrl) {
      var index = "";

      index = getIndexFromPhotoName(objectFromUrl);

      getImageAttributes(index);
      setSlideshowImage(imgAttributes);
      handleSingleViewDisplay();
    }

    function showPhotoFromIndex(index) {
      // var index = index > 0 ? index : 0;

      // var image = $(this.$sideMenu).find('img[data-img-index="'+index+'"]');

      // showPhoto(image);

      // preloadImageFromIndex(index);
    }

    function getPhotoNameFromPathname() {
      var pathnameString = window.location.pathname;
      var photoName = pathnameString.substr(pathnameString.lastIndexOf('/') + 1);
      return photoName;
    }

    function getIndexFromPhotoName(objectFromUrl) {
      var element = ".photo-wrapper a[href*='"+objectFromUrl.name+"']";
      var index   = $(element).data("img-index");
      return index;
    }

    function setIndexRangeInit() {
      var lastImg  = $('.photo-wrapper:last a img')
      var last     = lastImg.attr("data-img-index");

      indexRange = {
        "firstAll" : 0,
        "lastAll" : last
      }

      getCurrentIndexRange();

      return indexRange
    }

    function getCurrentIndexRange() {
      var firstImg   = $('.photo-wrapper:visible:first a img')
      var firstIndex = firstImg.attr("data-img-index");

      var lastImg  = $('.photo-wrapper:visible:last a img')
      var lastIndex = lastImg.attr("data-img-index");

      indexRange.firstIndex = firstIndex;
      indexRange.lastIndex = lastIndex;

      return indexRange
    }

    function handleNavigation(evt) {
      var control = $(evt.target);
      getCurrentIndex();

      if ( control.hasClass('next') ) {
        requestNextImage();
      }

      if ( control.hasClass('prev') ) {
        requestPreviousImage();
      }
    }

    function showLoop() {
      $(".slideshow-loop").show().delay(100).fadeOut('slow');
    }

    function requestImage(desiredIndex) {
      getImageAttributes(desiredIndex);
      setUrl(imgAttributes);

      setSlideshowImage(imgAttributes);
    }

    function requestPreviousImage() {
        getCurrentIndex();

        if (  indexRange.currentIndex == indexRange.firstIndex ) {
          var desiredIndex = indexRange.lastIndex;
          showLoop();
        }
        else {
          indexRange.currentIndex--;
          var desiredIndex = indexRange.currentIndex;
        }

        requestImage(desiredIndex);
    }

    function requestNextImage() {
      getCurrentIndex();

      if (  indexRange.currentIndex == indexRange.lastIndex ) {
        var desiredIndex = indexRange.firstIndex;
        showLoop();
      }
      else {
        indexRange.currentIndex++;
        var desiredIndex = indexRange.currentIndex;
      }
      requestImage(desiredIndex);
    }

    function getCurrentIndex() {      
      var currentIndex = $('.photo-view img').attr('data-img-index');

      indexRange.currentIndex = currentIndex;

      return indexRange;
    }

    function getImageAttributes(desiredIndex) {
      var urlOrigin = window.location.origin;

      var imageLink = $(".photo-wrapper a img[data-img-index="+desiredIndex+"]");

      var imgPath = $(imageLink).attr('src');
      imgPath = imgPath.replace('-md','');

      imgAttributes = {
        src      : imgPath,
        alt      : $(imageLink).attr('alt'),
        title    : $(imageLink).attr('title'),
        imgIndex : $(imageLink).data('img-index'),
        href     : urlOrigin + $(imageLink).parent().attr("href"),
        album    : $(imageLink).attr("data-album"),
        imgPath  : imgPath
      };

      return imgAttributes;
    }

    function setSlideshowImage(imgAttributes) {
      $(this.$photo_viewer).children('img').remove();

      $('<img src="'+ imgAttributes.src +'" title="'+ imgAttributes.title +'"alt="'+ imgAttributes.alt +'"data-img-index="'+ imgAttributes.imgIndex +'">').load(function() {
        $(this).appendTo('.photo-view');
        setBgHeroImage(imgAttributes);
      });

      setFbLike(imgAttributes.href);
      preloadNextImage( imgAttributes.imgIndex );
    }

    function setBgHeroImage(imgAttributes) {
      var urlPath = imgAttributes.src;
      var urlPath = urlPath.replace('.jpg','-sm-blurred.jpg');

      this.$bgImg.css({
        "background-image" : "url('"+urlPath+"')",
      });

      this.$body.css({
        "background-image" : "url('"+urlPath+"')",
      });
    }

    function handleAlbumPhotos(evt) {
      evt.preventDefault();

      var albumLinkElement = $(evt.target);

      handleSingleViewDisplay("close");
      showAlbumPhotos(albumLinkElement);
      setBgHeroImage(imgAttributes);
      setUrl(imgAttributes);

      $(".photo-collection").animate({ scrollTop: "0px" }, 600);
    }

    function showAlbumPhotos(albumLinkElement) {
      var albumName = $(albumLinkElement).data('album-link');
      var albumDisplay = $(albumLinkElement).text();
      var albumPoster = $(albumLinkElement).children('span').css('background-image');
      var albumPoster = albumPoster.replace("url(","");
      var albumPoster = albumPoster.replace(")","");
      var albumPoster = albumPoster.replace('"','').replace('"','');
      var albumPoster = albumPoster.replace("-xs",'');

      $('.album-collection li').removeClass('selected');
      $(albumLinkElement).parent().addClass('selected');

      $('.current-album').text(albumDisplay);

      if  ( albumName == "All photos") {
        $(".photo-wrapper").show();

        getCurrentIndexRange();
        getImageAttributes(indexRange.firstAll);

        if ( $( window ).width() < 550 ) {
          openAlbumCollection(false);
        }

        // setBgHeroImage(imgAttributes);
        setSlideshowImage(imgAttributes);

        getImageAttributes( indexRange.firstIndex );

        imgAttributes["title"]   = "All photos";
        imgAttributes["album"]   = "All photos";
        imgAttributes["href"]    = window.location.origin + "/photography";

        setBgHeroImage(imgAttributes);
      }
      else { 
        handleSingleViewDisplay("close");

        $imageLinks.each( function(index, link) {
          if ( $(link).find('img').data( 'album' ) !== albumName  ) {
            $(link).closest('.photo-wrapper').hide();
          }
          else {
            $(link).closest('.photo-wrapper').css('display', 'inline-flex');
          }
        });

        // if ( $('.photo-wrapper:visible').length == 1 ) {
        //   handleSingleViewDisplay();
        // }

        if ( $( window ).width() < 550 ) {
          openAlbumCollection(false);
        }
        
        getCurrentIndexRange();
        getImageAttributes(indexRange.firstIndex );

        imgAttributes["src"]     = albumPoster;
        imgAttributes["title"]   = albumDisplay+" Album";
        imgAttributes["imgPath"] = albumPoster.replace('xs','md');

        // setBgHeroImage(imgAttributes);
        // setSlideshowImage(imgAttributes);
        imgAttributes["href"]    = window.location.origin + "/photography/"+albumName;
      }
    }

    function openAlbumCollection(close = true) {
      if ( close == false ) {
        $('.album-trigger').removeClass('triggered');
        $('.album-collection, .photo-collection').removeClass('open');
      }
      else {
        $('.album-trigger').toggleClass('triggered');
        $('.album-collection, .photo-collection').toggleClass('open');  
      }
    }

    function preloadNextImage(index) {
      if ( index == indexRange.lastIndex ) {
        index = indexRange.firstIndex;
      }
      else {
        index++
      }

      getImageAttributes(index);
      preloadImage(imgAttributes);
    }

    function preloadImage(imgAttributes, blurredOnly = false) {
      var imgBlurred = $("<img></>");

      $(imgBlurred).attr({
        "src"            : imgAttributes.src.replace('.jpg','-sm-blurred.jpg')
      });

      $(".preloader").append(imgBlurred);

      if ( blurredOnly == true ) {
        return
      }

      var imgOg = $("<img></>");

      $(imgOg).attr({
        "src"            : imgAttributes.src,
        "title"          : imgAttributes.title,
        "alt"            : imgAttributes.alt,
        "data-img-index" : imgAttributes.imgIndex,
      });

      $(".preloader").append(imgOg);  
    }

    function setAlbumThumbnailsInit() {
      var halfAmountOfImgs      = Math.round($imageLinks.length / 2);
      var albumPostersLength    = Math.round($albumPosters.length);
      var albumPosterHalfLength = Math.round(albumPostersLength / 2);

      var lastPoster         = $albumPosters[albumPostersLength - 1];
      var lastPosterSrc      = $(lastPoster).attr('src');

      var firstPoster       = $albumPosters[0];
      var firstPosterSrc    = $(firstPoster).attr('src');

      var middlePoster      = $albumPosters[albumPosterHalfLength];
      var middlePosterSrc   = $(middlePoster).attr('src');

      this.$albumMenuLinks.each( function(index, link) {
        var albumName = $(link).data('album-link');

        if ( $(link).data('album-link') == "All photos" ) {
          var ogSrc  = middlePosterSrc;
          var ogSrc2 = lastPosterSrc;
          var ogSrc3 = firstPosterSrc;

          var src  = ogSrc.replace("-md", "-xs");
          var src2 = ogSrc2.replace("-md", "-xs");
          var src3 = ogSrc3.replace("-md", "-xs");

          $(link).children('span:first').css("background-image", "url("+src+")");
          $(link).children('span:nth-child(2)').css("background-image", "url("+src2+")");
          $(link).children('span:last').css("background-image", "url("+src3+")");

          imgAttributes = {
            src      : ogSrc.replace('-md',''),
          };

          preloadImage(imgAttributes, true);
        }
        else {
          var linkAlbum = $(link).data('album-link');
          if ( $(".photo-wrapper a img[data-album='"+linkAlbum+"'][data-poster='true']:first").length !== 0 )  {
            var match = $(".photo-wrapper a img[data-album='"+linkAlbum+"'][data-poster='true']:first");
          }
          else {
            var match = $(".photo-wrapper a img[data-album='"+linkAlbum+"']:first");
          }
          var ogSrc = $(match).attr('src');
          var src = ogSrc.replace('-md','-xs');

          $(link).children('span:first').css("background-image", "url("+src+")");

          imgAttributes = {
            src      : ogSrc.replace('-md',''),
          };

          preloadImage(imgAttributes, true);
        }
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
            requestPreviousImage();
          }
          else if ($keyPressed == 39 ||
                   $keyPressed == 40 ||
                   $keyPressed == 32)
          {
            requestNextImage();
          }
          // else if ($keyPressed == 13 || $keyPressed == 70) {
          //   handleBgPhotoDisplay();
          // }

        }
        if ( $keyPressed == 27 ) {
          openAlbumCollection(false);
        }
        if ( $keyPressed == 70 ) {
          enableFullscreenMode();
        }
        if ( $keyPressed == 13 ) {
          requestNextImage();
        }
      });
    }

    function fsImage(image) {
      var src = $(image.target).attr("src");
      $(".fullscreen-image").append("<img src="+src+" wdith='auto'/>");
      $(".fullscreen-image").addClass("open");
    }

    function closeFsImage(el) {
      $(el.target).removeClass("open");
      $(".fullscreen-image img").remove();
    }

    function handleNavBackground(addOrRemove) {
      if ( addOrRemove == "add" ) {
        $('.photo-nav').removeClass('noBg');
      } else if ( addOrRemove == "remove" ) {
        $('.photo-nav').addClass('noBg');
      }
    }

    function handleSingleViewDisplay(action) {
      if ( action == "close" ) {
        // this.$photo_viewer.children('img').attr('src','');
        this.$photo_collection.removeClass("single-view");
        handleNavBackground("add");

        toggleNoScroll("close");
        return
      }

      if ( this.$photo_collection.hasClass("single-view") ) {
        this.$photo_collection.removeClass("single-view");
        handleNavBackground("add");
        // this.$photo_viewer.children('img').attr('src','');
      } else {
        this.$photo_collection.addClass("single-view");
        handleNavBackground("remove");
      }

      toggleNoScroll();
    }

    function handleCloseButton() {
      handleSingleViewDisplay('close');

      var pageAttributes = {};

      // var pathName       = window.location.pathname;
      // var pathArray      = pathName.split('/', 4).map(function(item) { return item.trim() });

      // var albumName = pathArray[2];
      // var albumLinkElement = $(".album-collection a[data-album-link="+albumName+"]");
      // var albumPoster = $(albumLinkElement).children('span').css('background-image');
      // var albumPoster = albumPoster.replace("url(","");
      // var albumPoster = albumPoster.replace(")","");
      // var albumPoster = albumPoster.replace('"','').replace('"','');
      // var albumPoster = albumPoster.replace("-xs",'');

      var albumAnchor = $('.album-collection li.selected a');
      var albumLink   = $(albumAnchor).data('album-link');
      var albumPoster = $(".photo-wrapper a img[data-album='"+albumLink+"'][data-poster='true']").attr('src').replace('-md','-large');


      if ( albumLink === "All photos" ) {
        var albumLink = $('.album-collection li:nth-child(2n) a').data('album-link');
        var albumPoster = $(".photo-wrapper a img[data-album='"+albumLink+"'][data-poster='true']").attr('src').replace('-md','-large');
      }

      var pageAttributes= {
        title: $(albumAnchor).text()+" Album",
        href: $(albumAnchor).attr('href'),
        imgPath: albumPoster
      }

      setUrl(pageAttributes);
    }

    function handleImageClick(image) {
      $(this.$photo_viewer).children('img').fadeTo(0,0);
      image.preventDefault();

      var image_target     = $(image.target);
      var imgIndex    = $(image_target).data('img-index');

      getImageAttributes( imgIndex);
      setUrl(imgAttributes);
      setSlideshowImage(imgAttributes);

      handleSingleViewDisplay();
    }

    function setUrl(pageAttributes) {
      // var url      = (window.location.origin)+href;
      history.replaceState(null, pageAttributes.title, pageAttributes.href);

      // This is mostly for bookmarking. Not for Open Graph or SEO
      document.title = pageAttributes.title+" | Marc Deely - Photography";
      $('meta[name=description]').attr('content', (pageAttributes.title+" by Marc Deely"));
      $('meta[property=og\\:url]').attr('content', pageAttributes.href);
      $('meta[property=og\\:title]').attr('content', pageAttributes.title);
      $('meta[property=og\\:image]').attr('content', pageAttributes.imgPath);
      $(".fb-like").attr( "data-href", pageAttributes.href);

      // ga("send", "event", "Photography", "viewed", pageAttributes.href+': '+pageAttributes.title)
    }

    function enableFullscreenMode() {
      if ( $($body).hasClass("fullscreen-mode") ) {
        $($body).removeClass("fullscreen-mode");
        $($slideshowClose).show();
        $('.fa.fa-expand').toggle();
        $('.fa.fa-compress').toggle();

        return
      }
      $($body).addClass("fullscreen-mode");
      $('.fa.fa-expand').toggle();
      $('.fa.fa-compress').toggle();
      $($slideshowClose).hide();
    }

    function setFbLike(url) {
      $(this.$fbLikeIcon).html("Like<div class='fb-like' data-href='"+url+"', data-layout='box_count', data-action='like', data-size='small', data-show_faces='true', data-share='true'></div>");
      // $(this.$fbCommentWrapper).html("<div class='fb-comments' data-href='"+url+"' data-mobile='true' data-numposts='5'></div>");

      if (typeof FB !== 'undefined') {
          FB.XFBML.parse(document.getElementById('fb-like-icon'));
          // FB.XFBML.parse(document.getElementById('fb-comment-wrapper'));
      }
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

    function toggleNoScroll(action) {
      if ( action == "close" ) {
        $body.removeClass('no-scroll');
        return
      }

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