/* ========================================================================

 * Bootstrap: carousel.js v3.3.7

 * http://getbootstrap.com/javascript/#carousel

 * ========================================================================

 * Copyright 2011-2016 Twitter, Inc.

 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)

 * ======================================================================== */







+function ($) {

  'use strict';




  // CAROUSEL CLASS DEFINITION

  // =========================




  var Carousel = function (element, options) {

    this.$element    = $(element)

    this.$indicators = this.$element.find('.carousel-indicators')

    this.options     = options

    this.paused      = null

    this.sliding     = null

    this.interval    = null

    this.$active     = null

    this.$items      = null




    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))




    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element

      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))

      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))

  }




  Carousel.VERSION  = '3.3.7'




  Carousel.TRANSITION_DURATION = 600




  Carousel.DEFAULTS = {

    interval: 5000,

    pause: 'hover',

    wrap: true,

    keyboard: true

  }




  Carousel.prototype.keydown = function (e) {

    if (/input|textarea/i.test(e.target.tagName)) return

    switch (e.which) {

      case 37: this.prev(); break

      case 39: this.next(); break

      default: return

    }




    e.preventDefault()

  }




  Carousel.prototype.cycle = function (e) {

    e || (this.paused = false)




    this.interval && clearInterval(this.interval)




    this.options.interval

      && !this.paused

      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))




    return this

  }




  Carousel.prototype.getItemIndex = function (item) {

    this.$items = item.parent().children('.item')

    return this.$items.index(item || this.$active)

  }




  Carousel.prototype.getItemForDirection = function (direction, active) {

    var activeIndex = this.getItemIndex(active)

    var willWrap = (direction == 'prev' && activeIndex === 0)

                || (direction == 'next' && activeIndex == (this.$items.length - 1))

    if (willWrap && !this.options.wrap) return active

    var delta = direction == 'prev' ? -1 : 1

    var itemIndex = (activeIndex + delta) % this.$items.length

    return this.$items.eq(itemIndex)

  }




  Carousel.prototype.to = function (pos) {

    var that        = this

    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))




    if (pos > (this.$items.length - 1) || pos < 0) return




    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"

    if (activeIndex == pos) return this.pause().cycle()




    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))

  }




  Carousel.prototype.pause = function (e) {

    e || (this.paused = true)




    if (this.$element.find('.next, .prev').length && $.support.transition) {

      this.$element.trigger($.support.transition.end)

      this.cycle(true)

    }




    this.interval = clearInterval(this.interval)




    return this

  }




  Carousel.prototype.next = function () {

    if (this.sliding) return

    return this.slide('next')

  }




  Carousel.prototype.prev = function () {

    if (this.sliding) return

    return this.slide('prev')

  }




  Carousel.prototype.slide = function (type, next) {

    var $active   = this.$element.find('.item.active')

    var $next     = next || this.getItemForDirection(type, $active)

    var isCycling = this.interval

    var direction = type == 'next' ? 'left' : 'right'

    var that      = this




    if ($next.hasClass('active')) return (this.sliding = false)




    var relatedTarget = $next[0]

    var slideEvent = $.Event('slide.bs.carousel', {

      relatedTarget: relatedTarget,

      direction: direction

    })

    this.$element.trigger(slideEvent)

    if (slideEvent.isDefaultPrevented()) return




    this.sliding = true




    isCycling && this.pause()




    if (this.$indicators.length) {

      this.$indicators.find('.active').removeClass('active')

      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])

      $nextIndicator && $nextIndicator.addClass('active')

    }




    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"

    if ($.support.transition && this.$element.hasClass('slide')) {

      $next.addClass(type)

      $next[0].offsetWidth // force reflow

      $active.addClass(direction)

      $next.addClass(direction)

      $active

        .one('bsTransitionEnd', function () {

          $next.removeClass([type, direction].join(' ')).addClass('active')

          $active.removeClass(['active', direction].join(' '))

          that.sliding = false

          setTimeout(function () {

            that.$element.trigger(slidEvent)

          }, 0)

        })

        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)

    } else {

      $active.removeClass('active')

      $next.addClass('active')

      this.sliding = false

      this.$element.trigger(slidEvent)

    }




    isCycling && this.cycle()




    return this

  }







  // CAROUSEL PLUGIN DEFINITION

  // ==========================




  function Plugin(option) {

    return this.each(function () {

      var $this   = $(this)

      var data    = $this.data('bs.carousel')

      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)

      var action  = typeof option == 'string' ? option : options.slide




      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))

      if (typeof option == 'number') data.to(option)

      else if (action) data[action]()

      else if (options.interval) data.pause().cycle()

    })

  }




  var old = $.fn.carousel




  $.fn.carousel             = Plugin

  $.fn.carousel.Constructor = Carousel







  // CAROUSEL NO CONFLICT

  // ====================




  $.fn.carousel.noConflict = function () {

    $.fn.carousel = old

    return this

  }







  // CAROUSEL DATA-API

  // =================




  var clickHandler = function (e) {

    var href

    var $this   = $(this)

    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7

    if (!$target.hasClass('carousel')) return

    var options = $.extend({}, $target.data(), $this.data())

    var slideIndex = $this.attr('data-slide-to')

    if (slideIndex) options.interval = false




    Plugin.call($target, options)




    if (slideIndex) {

      $target.data('bs.carousel').to(slideIndex)

    }




    e.preventDefault()

  }




  $(document)

    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)

    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)




  $(window).on('load', function () {

    $('[data-ride="carousel"]').each(function () {

      var $carousel = $(this)

      Plugin.call($carousel, $carousel.data())

    })

  })




}(jQuery);

//添加随着滚动，导航栏的标签跟着滚动的功能
/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.7
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.7'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);
