$(function(){

  var _html = $('html');
  var _body = $('body');
  var _window = $(window);

  var ww = _window.width();
  var wh = _window.height();
  var wwNew = ww;

  const wwSlim = 480;
  const wwMedium = 700; //此值以下是手機
  const wwNormal = 960;  //此值以上是電腦
  const wwMaximum = 1200;

  var _menu = $('.webHeader .menu');
  var _menuCtrl = $('.menuCtrl');
  var _sidebar = $('.sidebar');
  var _webHeader = $('.webHeader');
  var _webFooter = $('.webFooter');

  _html.removeClass('no-js');


  // --------------------- 外掛套件 slick 參數設定
  $('.slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    speed : 400,
    arrows: true,
    fade: true,
    infinite: false,
    accessibility: true,
    asNavFor: '.slider-nav'
  });
  $('.slider-nav').slick({
    variableWidth: true,
    slidesToShow: 1,  
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    dots: false,
    centerMode: false,
    infinite: false,
    focusOnSelect: true,
    arrows: false
  });
  // --------------------- slick 參數設定：結束


  // 計算照片張數
  var _countPhoto = $('.imgSlick').filter('.count');
  _countPhoto.each(function(){
    let _this = $(this);
    _this.prepend('<div class="photoCount"><span class="current" title="目前位置"></span><span class="total" title="總張數"></span></div>');
    let _photoCount = _this.find('.photoCount');
    let _current = _photoCount.find('.current');
    let _total = _photoCount.find('.total');
    let _countThis = _this.find('.slider-for');

    _total.text(_countThis.find('.slick-slide').length);
    _current.text( _countThis.find('.slick-current').index()+1);

    _this.find('.slick-arrow').add('.slick-slide').click( function(){
      _current.text( _countThis.find('.slick-current').index()+1);
    })
  })


  // 20221227 無障礙修改：開燈箱的圖片可由 tab 鍵 focus
  var _lbxPhotoImgSlick = $('.imgSlick').has('.showLightbox');
  var _lbxTrigger = _lbxPhotoImgSlick.find('.showLightbox');
  var _sliderBtns = _lbxPhotoImgSlick.find('.slick-arrow');
  var _sliderNav = _lbxPhotoImgSlick.find('.slider-nav');
  var _sliderNavImgDiv = _sliderNav.find('.slick-slide');
  // console.log(_sliderNavImgDiv);

  // 把目前顯示的圖的容器 和 導覽小圖的容器的 tabindex 由 -1 改為 0，才能被 focus
  _lbxTrigger.filter('.slick-active').attr('tabindex', 0);
  _sliderNavImgDiv.attr('tabindex', 0);

  // 每次點左右箭頭或小圖都要再重新設定 tabindex
  _sliderBtns.add(_sliderNavImgDiv).click( function(){
    setTimeout( function(){
      _lbxTrigger.filter('.slick-active').attr('tabindex', 0);
      _sliderNavImgDiv.attr('tabindex', 0);
    }, 500 )
  })
  // 20221227 修改結束



  // 使用 slick 套件的導覽小圖，點擊對應另一組 slick 大圖
  // 用於 cp_image_slide.html, cp_image_slide2.html, cp_image_slide3.html
  var _imgSlick = $('.imgSlick');
  _imgSlick.each(function(){
    let _thisSlick  = $(this);
    let _slideNav = _thisSlick.find('.slider-nav');
    let _navItem = _slideNav.find('.slick-slide');
    let _slickArrow = _thisSlick.find('.slider-for').find('.slick-arrow');

    _navItem.on('focus', function(){
      $(this).keyup(function (e) {
        if( e.key == "Tab" ){
          $(this).trigger('click');
        }
      });  
    })

    // 20231013 無障礙修改：大小圖同步 slide
    // 把導覽小圖的 aria-hidden 由 true 改為 false，img 的替代文字才能被語音報讀軟體報讀
    _navItem.attr('aria-hidden', 'false');

    // 每次點左右箭頭或小圖都要再重新設定 aria-hidden = "false"
    _slickArrow.add(_navItem).click(function () {
      setTimeout(function () {
        _navItem.attr('aria-hidden', 'false');
      }, 500)
    })
    // 20231013 修改結束

  })



  


  // 製作側欄選單遮罩
  _body.append('<div class="sidebarMask"></div>');

  // 找出_menu中有次選單的li
  _menu.find('li').has('ul').addClass('hasChild');

  // 寬版「主選單」開合
  const menuCtrlText1 = '顯示主選單';
  const menuCtrlText2 = '隱藏主選單';
  _menu.hasClass('reveal') ?  _menuCtrl.text(menuCtrlText2) : _menuCtrl.text(menuCtrlText1);
  _menuCtrl.click(function(){
    if (_menu.hasClass('reveal')) {
      $(this).removeClass('closeIt').text(menuCtrlText1);
      _menu.removeClass('reveal');
      setTimeout( function(){ _menu.hide(); }, 800);
    } else {
      $(this).addClass('closeIt').text(menuCtrlText2);
      _menu.show(5, function(){_menu.addClass('reveal')});
    }
  })

  // 離開（key Tab out） _menu 隱藏所有次選單
  $('*').not(_menuCtrl).focus(function(){
    if( $(this).parents('.menu').length == 0 && _menu.hasClass('reveal') ){
      _menu.removeClass('reveal');
      setTimeout( function(){ _menu.hide(); }, 800);
      _menuCtrl.removeClass('closeIt');
    }
  })


  // 行動版側欄選單
  //複製「主選單」到側欄給行動版用
  _menu.clone().prependTo(_sidebar);
  _menuCtrl.clone().appendTo(_webHeader).addClass('sidebarCtrl').removeClass('menuCtrl');
  $('.topNav').clone().appendTo(_sidebar);
  var _sidebarCtrl = _webHeader.find('.sidebarCtrl');
  var _sidebarMenu = _sidebar.find('.menu');
  var _hasChild = _sidebarMenu.find('.hasChild>a');
  var _sidebarMask = $('.sidebarMask');
  _hasChild.click(  
    function(e){
      e.preventDefault();

      let _this = $(this);
      let _subMenu = _this.next('ul');

      if (_subMenu.is(':hidden')) {
        _subMenu.stop(true, false).slideDown();
        _this.parent().addClass('closeIt');
      } else {
        _subMenu.stop(true, false).slideUp();
        _this.parent().removeClass('closeIt');
      }
    }
  )


  _sidebarCtrl.click(function(){
    if (_sidebar.hasClass('reveal')) {
      _sidebar.removeClass('reveal');
      _sidebarCtrl.removeClass('closeIt');
      _sidebarMask.fadeOut(400);
      _body.removeClass('noScroll');
    } else {
      _sidebar.addClass('reveal');
      _sidebarCtrl.addClass('closeIt');
      _sidebarMask.fadeIn(400);
      _body.addClass('noScroll')
    }
  })
  _sidebarMask.click(function(){
    _sidebar.removeClass('reveal');
    _sidebarCtrl.removeClass('closeIt');
    _body.removeClass('noScroll');
    $(this).fadeOut(400);
  })

  let winResizeTimer0;
  _window.resize(function () {
    clearTimeout(winResizeTimer0);
    ww = _window.width();
    winResizeTimer = setTimeout(function () {
      if(ww >= wwNormal) {
        _sidebarMask.hide();
        _body.removeClass('noScroll');
        _sidebar.removeClass('reveal');
        _sidebarCtrl.removeClass('closeIt');
      } else {
        _menu.removeAttr('style').removeClass('reveal');
        _menuCtrl.removeClass('closeIt');
      }
    }, 200);
  });



  // 查詢區開合 -----------------------------------------------------
  const searchCtrlText1 = '顯示查詢區';
  const searchCtrlText2 = '隱藏查詢區';
  var _search = $('.search').hide();
  var _searchCtrl = $('.searchCtrl').text(searchCtrlText1);

  var _closeSearch = _search.find('.closeThis');
  _search.append('<button class="skip" type="button">跳到關閉按鈕</button>');
  var _searchSkip = _search.find('.skip');

  _searchCtrl.click(function(){
    if( _search.hasClass('reveal')) {
      searchHide();
    } else {
      _search.show(0, function(){
        $(this).addClass('reveal');
        _searchCtrl.text(searchCtrlText2);
      });
    }
  })
  
  // Alt 的鍵盤代碼是 18，S 的鍵盤代碼是 83
  _body.keyup(function(e){
    if ((e.altKey) && (e.keyCode == 83)) {
      _search.show().addClass('reveal').find('input[type="text"]').focus();
    }
  })

  _searchSkip.focus(function(){
    _closeSearch.focus();
  })

  _closeSearch.click(function () {
    searchHide();
  })
  function searchHide(){
    _search.removeClass('reveal');
    _searchCtrl.text(searchCtrlText1);
    setTimeout( function(){
      _search.removeAttr('style').hide();
      _searchCtrl.focus();
    } , 800);
  }


  // fatfooter 開合 -----------------------------------------------------
  var _fatFootCtrl = $('.fatFootCtrl');
  var _footSiteTree = $('.fatFooter').find('.siteTree>ul>li>ul');
  const text1 = _fatFootCtrl.text();
  const text2 = _fatFootCtrl.attr('data-altText');

  _fatFootCtrl.click(function(){
    if ( _footSiteTree.is(':visible')) {
      _footSiteTree.slideUp();
      $(this).addClass('closed').text(text2);
    } else {
      _footSiteTree.slideDown();
      $(this).removeClass('closed').text(text1);
    }
  })


  // 向上捲動箭頭 + 「實境展覽」連結-----------------------------------------------------
  var _goTop = $('.goTop');
  var _vrLink = $('.vrLink'); // 「實境展覽」連結元件
  var _topRow = $('.topRow'); // 版頭，含大圖輪播

  _goTop.click(function(){
    _html.stop(true,false).animate({scrollTop: 0}, 800, function(){
      $('.goCenter').focus();
    });
  });

  vrLinkFixed(); // 「實境展覽」定位模式

  _window.scroll(function () {
    if (_window.scrollTop() > 200) {
      _goTop.addClass('show');
    } else {
      _goTop.removeClass('show');
    }

    vrLinkFixed();

  });

  // 「實境展覽」固定在視窗右下，下緣不超過 _webFooter，上緣不超過 _topRow
  function vrLinkFixed(){
    if ( _vrLink.length > 0 ) {
      
      // 向下捲，到達 _webFooter
      if ( _vrLink.offset().top + _vrLink.innerHeight() >= _webFooter.offset().top ) {
        _vrLink.addClass('bottomStop');
      }
      
      // 向下捲，離開 _topRow
      if (_vrLink.hasClass('topStop') && _window.scrollTop() >= _vrLink.innerHeight() + _vrLink.offset().top - _window.height()) {
        _vrLink.removeClass('topStop');
      }
  
      // 向上捲，離開 _webFooter
      if ( _vrLink.hasClass('bottomStop') && _window.scrollTop() + _window.height() <=  _webFooter.offset().top ) {
        _vrLink.removeClass('bottomStop');
      }
  
      // 向上捲，到達 _topRow
      if ( _vrLink.offset().top <= _topRow.innerHeight() ){
        _vrLink.addClass('topStop');
      }
    }
  }


  // 右側點點快速連結 -----------------------------------------------------
  var _main = $('.main');
  var _mainRow = _main.children('.row');
  var roleCount = _mainRow.length;
  var rowDotLi = '';
  _body.append('<nav class="mpNav"><ul></ul></nav>');
  var _navDotsUl = $('.mpNav>ul');

  // 產生<li><a>元件
  for (let n = 0; n < roleCount; n++) {
    let rowtext = _mainRow.eq(n).find('.blockHeader>h2').text();
    // rowDotLi = rowDotLi + `<li><a href="#row${n}" title="${rowtext}"></a></li>`;
    rowDotLi = rowDotLi + `<li><a href="#row${n}"><span>${rowtext}</span></a></li>`;
    _mainRow.eq(n).attr('id', 'row' + n);
  }
  _navDotsUl.append(rowDotLi);
  var _navDots = _navDotsUl.find('li');
  var navDotTop;

  _navDots.children('a').focus( function(e){
    e.preventDefault();
    let _dotliNow = $(this).parent();
    _dotliNow.addClass('focused').siblings().removeClass('focused');

  })
  _navDots.children('a').click(function(e){
    e.preventDefault();
    let _dotliNow = $(this).parent();
    _dotliNow.addClass('focused').siblings().removeClass('focused');

    navDotTop = _mainRow.eq(_dotliNow.index()).offset().top;

    _html.stop(true, false).animate({'scrollTop': navDotTop }, 800, function(){
      setTimeout(() => {
        _navDots.removeClass('focused');
      }, 1000);
    });
  })


  // 大圖自動輪播 -----------------------------------------------------
  var _bigBanner = $('.bigBanner');
  _bigBanner.each( function() {
    let _this = $(this);
    let _floxBox = _this.find('.flowBox');
    let _flowList = _floxBox.find('.flowList');
    let _flowItem = _flowList.children('li');
    let count = _flowItem.length;
    let _btnRight = _this.find('.diskBtn.next');
    let _btnLeft = _this.find('.diskBtn.prev');
    const speed = 900;
    const duration = 4000;
    const actClassName = 'active';
    let i = 0;
    let j;
    let _dots = '';
    let _indicatItem;
    let autoLoop;
    
    if (count > 1){
      // 產生 indicator
      _floxBox.append('<div class="flowNav"><ul></ul></div>');
      let _indicator = _this.find(".flowNav>ul");
      for (let n = 0; n < count; n++) {
        _dots = _dots + '<li></li>';
      }
      _indicator.append(_dots);
      _indicatItem = _indicator.find('li');
      _indicatItem.eq(i).addClass(actClassName);

      // 開始自動輪播
      autoLoop = setInterval( slideForward , duration);

      // 滑鼠移入、移出輪播區
      _floxBox.mouseenter(function(){
        clearInterval(autoLoop);
      });
      _floxBox.mouseleave(function(){
        clearInterval(autoLoop);
        autoLoop = setInterval( slideForward , duration);
      });

      // touch and swipe 左右滑動
      _floxBox.swipe({
        swipeRight: function () {slideBackward();},
        swipeLeft: function () {slideForward();},
        threshold: 20,
      });

      // tab 鍵遊走
      _flowItem.children('a').focus(function(){
        clearInterval(autoLoop);
        $(this).parent().css('left', 0).siblings().css('left', '-100%');
        i = $(this).parent().index();
        _indicatItem.removeClass(actClassName).eq(i).addClass(actClassName);
      })
      _flowItem.last().children('a').blur( function(){
        _flowItem.css('left', '100%');
        _flowItem.last().css('left', 0);
        i = count - 1;
        j = (i + 1) % count;
      })
      _floxBox.focusout( function(){
        clearInterval(autoLoop);
        autoLoop = setInterval( slideForward , duration);
      })

    } else {
      _btnRight.add(_btnLeft).hide();
    }



    function slideForward() {
      j = (i + 1) % count;
      _flowItem.eq(i).stop(true, true).animate({'left': '-100%'}, speed, function(){
        $(this).css('left', '100%');
      })
      _flowItem.eq(j).stop(true, true).animate({ 'left': 0}, speed);
      _indicatItem.eq(i).removeClass(actClassName);
      _indicatItem.eq(j).addClass(actClassName);
      i = j;
    }

    function slideBackward() {
      j = (i - 1) % count;
      _flowItem.eq(j).css('left', '-100%').stop(true, true).animate({left: 0} , speed);
      _flowItem.eq(i).stop(true, true).animate({'left': '100%'}, speed );
      _indicatItem.eq(i).removeClass(actClassName);
      _indicatItem.eq(j).addClass(actClassName);
      i = j;
    }

    // 點擊向右箭頭
    _btnRight.click(function () { 
      clearInterval(autoLoop);
      slideForward();
    });

    // 點擊向左箭頭
    _btnLeft.click(function () {
      clearInterval(autoLoop);
      slideBackward();
    });
    // 點擊向右箭頭
    _btnRight.add(_btnLeft).focus(function(){
      clearInterval(autoLoop);
    })




    // 改變視窗大小時，暫停自動輪播
    let winResizeTimer;
    _window.resize(function () {
      clearTimeout(winResizeTimer);
      winResizeTimer = setTimeout(function () {
        if (count > 1){
          clearInterval(autoLoop);
          autoLoop = setInterval( slideForward , duration);
        }
        vrLinkFixed();
      }, 200);
    });




  })


  // 點選左右箭頭滑動（非自動輪播） -----------------------------------------
  // .flow1：寬版顯示三筆，每筆等寬 -----------------------------------------
  var _flow1 = $('.flow1');
  _flow1.each(function () {
    let _this = $(this);
    let _floxBox = _this.find('.flowBox');
    let _flowList = _floxBox.find('.flowList');
    let _flowItem = _flowList.children('li');
    let slideDistance = _flowItem.first().outerWidth(true);
    let slideCount = _flowItem.length;
    let _btnRight = _this.find('.diskBtn.next');
    let _btnLeft = _this.find('.diskBtn.prev');
    const speed = 600;
    const actClassName = 'active';
    let i = 0;
    let j;
    let _dots = '';

    // 產生 indicator
    _floxBox.append('<div class="flowNav"><ul></ul></div>');
    let _indicator = _this.find(".flowNav>ul");
    for (let n = 0; n < slideCount; n++) {
      _dots = _dots + '<li></li>';
    }
    _indicator.append(_dots);
    let _indicatItem = _indicator.find('li');
    _indicatItem.eq(i).addClass(actClassName);

    // 依據可視的 slide 項目，決定 indicator 樣式
    indicatReady();
    function indicatReady() {
      _indicatItem.removeClass(actClassName);
      _indicatItem.eq(i).addClass(actClassName);
      if (ww < wwMedium) {
        if (slideCount > 1) {
          flownavShow();
        } else {
          flownavHide();
        }
      }
      if (ww >= wwMedium) {
        if (slideCount <= 2) {
          flownavHide();
        } else {
          flownavShow();
          _indicatItem.eq((i + 1) % slideCount).addClass(actClassName);
        }
      }
      if (ww >= wwNormal) {
        if (slideCount <= 3) {
          flownavHide();
        } else {
          flownavShow();
          _indicatItem.eq((i + 1) % slideCount).addClass(actClassName);
          _indicatItem.eq((i + 2) % slideCount).addClass(actClassName);
        }
      }
    }
    function flownavShow(){
      _indicator.add(_btnRight).add(_btnLeft).show();
    }
    function flownavHide(){
      _indicator.add(_btnRight).add(_btnLeft).hide();
    }

    function slideForward(){
      _flowList.stop(true, false).animate({'margin-left': -1 * slideDistance }, speed, function(){
        j = (i + 1) % slideCount;
        _flowItem.eq(i).appendTo(_flowList);
        _indicatItem.eq(i).removeClass(actClassName);
        _indicatItem.eq(j).addClass(actClassName);
        _flowList.css('margin-left', 0);
        if (ww >= wwMedium) {
          _indicatItem.eq((j + 1) % slideCount).addClass(actClassName);
        }
        if (ww >= wwNormal) {
          _indicatItem.eq((j + 1) % slideCount).addClass(actClassName);
          _indicatItem.eq((j + 2) % slideCount).addClass(actClassName);
        }
        i = j;
      });
    }
    function slideBackward() {
      j = (i - 1) % slideCount;
      _flowItem.eq(j).prependTo(_flowList);
      _flowList.css("margin-left", -1 * slideDistance);

      _flowList.stop(true, false).animate({ "margin-left": 0 }, speed, function () {
          _indicatItem.eq(j).addClass(actClassName);
          if (ww >= wwNormal) {
            _indicatItem.eq((i + 2) % slideCount).removeClass(actClassName);
          } else if (ww >= wwMedium) {
            _indicatItem.eq((i + 1) % slideCount).removeClass(actClassName);
          } else {
            _indicatItem.eq(i).removeClass(actClassName);
          }
          i = j;
        });
    }

    // 點擊向右箭頭
    _btnRight.click(function () { slideForward(); });

    // 點擊向左箭頭
    _btnLeft.click(function () { slideBackward(); });

    // touch and swipe 左右滑動
    _floxBox.swipe({
      swipeRight: function () {slideBackward();},
      swipeLeft: function () {slideForward();},
      threshold: 20,
    });

    // tab focus
    let tabCount = 0;
    _flowItem.children('a').focus(function (e) { 
      e.preventDefault();
      if ( tabCount > 0 && tabCount <= slideCount) {
        slideForward();
      }
      tabCount++
      if(tabCount > slideCount) {
        _btnLeft.focus();
        tabCount = 0;
      }
    });

    let winResizeTimer;
    _window.resize(function () {
      clearTimeout(winResizeTimer);
      winResizeTimer = setTimeout(function () {
        ww = _window.width();
        slideDistance = _flowItem.first().outerWidth(true);
        indicatReady();
      }, 200);
    });
  });


  // .flow2：寬版顯示三筆，中間圖放大且與其他項排版不同 --------------------
  var _flowCenter = $('.flow2');
  _flowCenter.each(function () {
    let _this = $(this);
    let _floxBox = _this.find('.flowBox');
    let _flowList = _floxBox.find('.flowList');
    let _flowItem = _flowList.children('li');
    let slideDistance = _flowItem.eq(0).outerWidth(true);
    let slideCount = _flowItem.length;
    let _btnRight = _this.find('.diskBtn.next');
    let _btnLeft = _this.find('.diskBtn.prev');
    const speed = 800;
    const actClassName = 'active';
    let i = 0;
    let j = 1;
    let _dots = '';

    // 產生 indicator
    _flowList.after('<div class="flowNav"><ul></ul></div>');
    let _indicator = _this.find(".flowNav>ul");
    for (let n = 1; n <= slideCount; n++) {
      _dots = _dots + '<li><span>' + n + '</span></li>';
    }
    _indicator.append(_dots);
    let _indicatItem = _indicator.find('li');
    _indicatItem.removeClass(actClassName).eq(1).addClass(actClassName);
    _flowItem.removeClass(actClassName).eq(1).addClass(actClassName);

    // tabindex 初始值
    _flowItem.children('a').attr('tabindex', -1);
    _flowItem.filter('.active').children('a').attr('tabindex', 0);

    function slideForward() {
      j = (i + 1) % slideCount;
      _flowItem.eq(j).removeClass(actClassName).children('a').attr('tabindex', -1);
      _flowItem.eq((j + 1) % slideCount).addClass(actClassName).children('a').attr('tabindex', 0);

      _flowList.stop(true, false).animate({'left': -1 * slideDistance}, speed, function () {
        _flowList.css('left', 0);
        _flowItem.eq(i).appendTo(_flowList);
        _indicatItem.eq(j).removeClass(actClassName);
        _indicatItem.eq((j + 1) % slideCount).addClass(actClassName);
        i = j;
      });
    }

    function slideBackward() {
      j = (i - 1) % slideCount;
      _flowItem.eq((i + 1) % slideCount).removeClass(actClassName).children('a').attr('tabindex', -1);
      _flowItem.eq(i).addClass(actClassName).children('a').attr('tabindex', 0);
      _flowItem.eq(j).prependTo(_flowList);
      _flowList.css('left', -1 * slideDistance);

      _flowList.stop(true, false).animate({ 'left': 0  }, speed, function () {
        _indicatItem.removeClass(actClassName).eq(i).addClass(actClassName);
        i = j;
      });
    } 

    // 點擊向右箭頭
    _btnRight.click(function () { slideForward(); });

    // 點擊向左箭頭
    _btnLeft.click(function () { slideBackward(); });

    // touch and swipe 左右滑動
    _floxBox.swipe({
      swipeRight: function () {slideBackward();},
      swipeLeft: function () {slideForward();},
      threshold: 20,
    });

    // tab focus
    // let tabCount = 0;
    // _flowItem.children('a').focus(function(e){
    //   e.preventDefault();
    //   if (tabCount == 0) {
    //     slideBackward();
    //     tabCount++;
    //   } else if ( tabCount < slideCount) {
    //     slideForward();
    //     tabCount++;
    //   } else {
    //     _btnLeft.focus();
    //     tabCount = 0;
    //   }
    // })
    

    let winResizeTimer;
    _window.resize(function () {
      clearTimeout(winResizeTimer);
      winResizeTimer = setTimeout(function () {
        slideDistance = _flowItem.not('.active').outerWidth(true);
      }, 200);
    });
  });


  // .flow3：寬版顯示兩筆完整，第三筆顯示局部 ------------------------------
  var _flow3 = $('.flow3');
  _flow3.each(function () {
    let _this = $(this);
    let _floxBox = _this.find('.flowBox');
    let _flowList = _floxBox.find('.flowList');
    let _flowItem = _flowList.children('li');
    let slideDistance = _flowItem.first().outerWidth(true);
    let slideCount = _flowItem.length;
    let _btnRight = _this.find('.diskBtn.next');
    let _btnLeft = _this.find('.diskBtn.prev');
    const speed = 600;
    const actClassName = 'active';
    let i = 0;
    let j;
    let _dots = '';

    // 產生 indicator
    _floxBox.append('<div class="flowNav"><ul></ul></div>');
    let _indicator = _this.find(".flowNav>ul");
    for (let n = 0; n < slideCount; n++) {
      _dots = _dots + '<li></li>';
    }
    _indicator.append(_dots);
    let _indicatItem = _indicator.find('li');
    _indicatItem.eq(i).addClass(actClassName);

    // 依據可視的 slide 項目，決定 indicator 樣式
    indicatReady();
    function indicatReady() {
      _indicatItem.removeClass(actClassName);
      _indicatItem.eq(i).addClass(actClassName);
      if (ww < wwMedium ) {
        if ( slideCount > 1) {
          flownavShow();
        } else {
          flownavHide()
        }
      }
      if (ww >= wwMedium) {
        if (slideCount <= 2) {
          flownavHide();
        } else {
          flownavShow();
          _indicatItem.eq((i + 1) % slideCount).addClass(actClassName);
        }
      }
    }
    function flownavShow(){
      _indicator.add(_btnRight).add(_btnLeft).show();
    }
    function flownavHide(){
      _indicator.add(_btnRight).add(_btnLeft).hide();
    }


    function slideForward() {
      _flowList.stop(true, false).animate({ 
        'margin-left': -1 * slideDistance }, speed, function () {
          j = (i + 1) % slideCount;
          _flowItem.eq(i).appendTo(_flowList);
          _indicatItem.eq(i).removeClass(actClassName);
          _indicatItem.eq(j).addClass(actClassName);
          _flowList.css('margin-left', 0);

          // if (ww >= wwMedium) {
          //   _indicatItem.eq((j + 1) % slideCount).addClass(actClassName);
          // }
          if (ww >= wwNormal) {
            _indicatItem.eq((j + 1) % slideCount).addClass(actClassName);
            // _indicatItem.eq((j + 2) % slideCount).addClass(actClassName);
          }
          i = j;
        });
    }
    function slideBackward() {
      j = (i - 1) % slideCount;
      _flowItem.eq(j).prependTo(_flowList);
      _flowList.css('margin-left', -1 * slideDistance);

      _flowList.stop(true, false).animate({ 'margin-left': 0 }, speed, function () {
          _indicatItem.eq(j).addClass(actClassName);
          if (ww >= wwNormal) {
            // _indicatItem.eq(i).removeClass(actClassName);
            _indicatItem.eq((i + 1) % slideCount).removeClass(actClassName);
          // } else if (ww >= wwMedium) {
          //   _indicatItem.eq((i + 1) % slideCount).removeClass(actClassName);
          } else {
            _indicatItem.eq(i).removeClass(actClassName);
          }
          i = j;
        });
    }

    // 點擊向右箭頭
    _btnRight.click(function () { slideForward(); });

    // 點擊向左箭頭
    _btnLeft.click(function () { slideBackward(); });

    // touch and swipe 左右滑動
    _floxBox.swipe({
      swipeRight: function () {slideBackward();},
      swipeLeft: function () {slideForward();},
      threshold: 20,
    });

    // tab focus
    let tabCount = 0;
    _flowItem.children('a').focus(function (e) { 
      e.preventDefault();
      if ( tabCount > 0 && tabCount <= slideCount) {
        slideForward();
      }
      tabCount++
      if(tabCount > slideCount) {
        _btnLeft.focus();
        tabCount = 0;
      }
    });
    var winResizeTimer;
    _window.resize(function () {
      clearTimeout(winResizeTimer);
      winResizeTimer = setTimeout(function () {
        ww = _window.width();
        slideDistance = _flowItem.first().outerWidth(true);
        indicatReady();
      }, 200);
    });


  });

  // .photoflow：cp頁的照片 -----------------------------------------
  var _photoflow = $('.photoflow');
  var _cpBigPhoto = $('.lightbox.bigPhoto');
  
  _photoflow.each(function () {
    let _this = $(this);
    let _floxBox = _this.find('.flowBox');
    let _flowList = _floxBox.find('.flowList');
    let _flowItem = _flowList.children('li');
    let slideDistance = _flowItem.first().outerWidth(true);
    let slideCount = _flowItem.length;
    let _btnRight = _this.find('.diskBtn.next');
    let _btnLeft = _this.find('.diskBtn.prev');
    const speed = 400;
    const actClassName = 'active';
    let i = 0;
    let j;
    let _dots = '';

    

    // 產生 indicator 和 自訂屬性 data-index
    _floxBox.append('<div class="flowNav"><ul></ul></div>');
    let _indicator = _this.find(".flowNav>ul");
    for (let n = 0; n < slideCount; n++) {
      _dots = _dots + '<li></li>';
      _flowItem.eq(n).attr('data-index', n);
      _cpBigPhoto.find('.flowList>li').eq(n).attr('data-index', n);
    }
    _indicator.append(_dots);
    let _indicatItem = _indicator.find('li');
    _indicatItem.eq(i).addClass(actClassName);
    _indicatItem.eq((i + 1) % slideCount).addClass(actClassName);

    // 依據可視的 slide 項目，決定 indicator 樣式
    indicatReady();
    function indicatReady() {
      _indicatItem.removeClass(actClassName);
      _indicatItem.eq(i).addClass(actClassName);
      _indicatItem.eq((i + 1) % slideCount).addClass(actClassName);
      if (ww < wwMedium) {
        if (slideCount > 2) {
          flownavShow();
        } else {
          flownavHide();
        }
      }
      if (ww >= wwMedium) {
        if (slideCount <= 3) {
          flownavHide();
        } else {
          flownavShow();
          _indicatItem.eq((i + 1) % slideCount).addClass(actClassName);
          _indicatItem.eq((i + 2) % slideCount).addClass(actClassName);
        }
      }
      if (ww >= wwNormal) {
        if (slideCount <= 4) {
          flownavHide();
        } else {
          flownavShow();
          _indicatItem.eq((i + 1) % slideCount).addClass(actClassName);
          _indicatItem.eq((i + 2) % slideCount).addClass(actClassName);
          _indicatItem.eq((i + 3) % slideCount).addClass(actClassName);
        }
      }
    }
    function flownavShow(){
      _indicator.add(_btnRight).add(_btnLeft).show();
    }
    function flownavHide(){
      _indicator.add(_btnRight).add(_btnLeft).hide();
    }

    function slideForward(){
      _flowList.stop(true, false).animate({'margin-left': -1 * slideDistance }, speed, function(){
        j = (i + 1) % slideCount;
        _flowItem.eq(i).appendTo(_flowList);
        _indicatItem.eq(i).removeClass(actClassName);
        _indicatItem.eq(j).addClass(actClassName);
        _indicatItem.eq((j + 1) % slideCount).addClass(actClassName);
        _flowList.css('margin-left', 0);
        if (ww >= wwMedium) {
          _indicatItem.eq((j + 2) % slideCount).addClass(actClassName);
        }
        if (ww >= wwNormal) {
          _indicatItem.eq((j + 3) % slideCount).addClass(actClassName);
        }
        i = j;
      });
    }
    function slideBackward() {
      j = (i - 1) % slideCount;
      _flowItem.eq(j).prependTo(_flowList);
      _flowList.css("margin-left", -1 * slideDistance);

      _flowList.stop(true, false).animate({ "margin-left": 0 }, speed, function () {
          _indicatItem.eq(j).addClass(actClassName);
          if (ww >= wwNormal) {
            _indicatItem.eq((i + 3) % slideCount).removeClass(actClassName);
          } else if (ww >= wwMedium) {
            _indicatItem.eq((i + 2) % slideCount).removeClass(actClassName);
          } else {
            _indicatItem.eq((i + 1) % slideCount).removeClass(actClassName);
            _indicatItem.eq(i).removeClass(actClassName);
          }
          i = j;
        });
    }

    // 點擊向右箭頭
    _btnRight.click(function () { slideForward(); });

    // 點擊向左箭頭
    _btnLeft.click(function () { slideBackward(); });

    // touch and swipe 左右滑動
    _floxBox.swipe({
      swipeRight: function () {slideBackward();},
      swipeLeft: function () {slideForward();},
      threshold: 20,
    });

    // tab focus
    let tabCount = 0;
    _flowItem.children('a').focus(function (e) { 
      e.preventDefault();
      if ( tabCount > 0 && tabCount <= slideCount) {
        slideForward();
      }
      tabCount++
      if(tabCount > slideCount) {
        _btnLeft.focus();
        tabCount = 0;
      }
    });

    let winResizeTimer;
    _window.resize(function () {
      clearTimeout(winResizeTimer);
      winResizeTimer = setTimeout(function () {
        ww = _window.width();
        slideDistance = _flowItem.first().outerWidth(true);
        indicatReady();
      }, 200);
    });

  });




  // ======================================================================




  // 燈箱 ---------------------------------------
  var _showLightbox =  $('.showLightbox');
  var _lightbox = $('.lightbox');
  var _hideLightbox = _lightbox.find('.closeThis');
  var _lightboxNow;
  var _lbFlag;
  const speed = 400;

  _hideLightbox.text('click 或按 enter 鍵關閉燈箱');
  _lightbox.before('<div class="coverAll"></div>');
  _lightbox.append('<button type="button" class="skip">跳到「關閉燈箱」</button>');
  var _cover = $('.coverAll');
  var _skipToClose = _lightbox.find('.skip');

  _skipToClose.focus( function () {
    _hideLightbox.focus().addClass('reFocuse');
    setTimeout( () => _hideLightbox.removeClass('reFocuse'), 2100);
  })

  _showLightbox.click(function(){
    _lbFlag = $(this);
    let boxID = $(this).attr('data-id');

    _lightboxNow = _lightbox.filter( function(){ return $(this).attr('data-id') === boxID} );
    _lightboxNow.stop(true, false).fadeIn(speed).addClass('show');
    // _lightboxNow.find('.closeThis').focus();
    _skipToClose.focus();
    _lightboxNow.prev(_cover).fadeIn(speed);
    _body.addClass('noScroll');
  })

  _showLightbox.focus(function(){
    $(this).keyup(function (e) { 
      if( e.keyCode == 13 ){
        $(this).trigger('click');
      }
    });
  })

  _hideLightbox.click(function(){
    let _targetLbx = $(this).parents('.lightbox');
    _targetLbx.stop(true, false).fadeOut(speed,
      function(){
        _targetLbx.removeClass('show');
        _lbFlag.focus();
      }
    );
    _targetLbx.prev(_cover).fadeOut(speed);
    _body.removeClass('noScroll');
    _hideLightbox.removeClass('reFocuse');
  })

  _cover.click(function(){
    let _targetLbx = $(this).next('.lightbox');
    $(this).fadeOut(speed);
    _body.removeClass('noScroll');
    _targetLbx.fadeOut(speed,
      function(){
        _targetLbx.removeClass('show');
      }
    );
  })




})