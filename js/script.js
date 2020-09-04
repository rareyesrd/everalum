"use strict";
(function () {
	// Global variables
	var userAgent = navigator.userAgent.toLowerCase(),
		initialDate = new Date(),

		$document = $(document),
		$window = $(window),
		$html = $("html"),
		$body = $("body"),

		isDesktop = $html.hasClass("desktop"),
		isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false,
		isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
		windowReady = false,
		isNoviBuilder = false,
		livedemo = false,

		plugins = {
			bootstrapTooltip: $("[data-toggle='tooltip']"),
			bootstrapModalDialog: $('.modal'),
			bootstrapTabs: $(".tabs-custom"),
			customToggle: $("[data-custom-toggle]"),
			counter: $(".counter"),
			circleProgress: $(".progress-bar-circle"),
			captcha: $('.recaptcha'),
			copyrightYear: $(".copyright-year"),
			checkbox: $("input[type='checkbox']"),
			dateCountdown: $('.DateCountdown'),
			isotope: $(".isotope-wrap"),
			lightGallery: $("[data-lightgallery='group']"),
			lightGalleryItem: $("[data-lightgallery='item']"),
			lightDynamicGalleryItem: $("[data-lightgallery='dynamic']"),
			materialParallax: $(".parallax-container"),
			owl: $(".owl-carousel"),
			popover: $('[data-toggle="popover"]'),
			progressLinear: $(".progress-linear"),
			preloader: $(".preloader"),
			rdNavbar: $(".rd-navbar"),
			rdInputLabel: $(".form-label"),
			regula: $("[data-constraints]"),
			radio: $("input[type='radio']"),
			swiper: document.querySelectorAll( '.swiper-container' ),
			search: $(".rd-search"),
			searchResults: $('.rd-search-results'),
			statefulButton: $('.btn-stateful'),
			viewAnimate: $('.view-animate'),
			vide: $( '.vide' ),
			wow: $(".wow"),
			maps: $(".google-map-container"),
			bootstrapDateTimePicker: $("[data-time-picker]"),
			selectFilter: $(".select")
		};

	/**
	 * @desc Check the element was been scrolled into the view
	 * @param {object} elem - jQuery object
	 * @return {boolean}
	 */
	function isScrolledIntoView ( elem ) {
		if ( isNoviBuilder ) return true;
		return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
	}

	/**
	 * @desc Toggle swiper videos on active slides
	 * @param {object} swiper - swiper slider
	 */
	function toggleSwiperInnerVideos(swiper) {
		var prevSlide = $(swiper.slides[swiper.previousIndex]),
			nextSlide = $(swiper.slides[swiper.activeIndex]),
			videos,
			videoItems = prevSlide.find("video");

		for (var i = 0; i < videoItems.length; i++) {
			videoItems[i].pause();
		}

		videos = nextSlide.find("video");
		if (videos.length) {
			videos.get(0).play();
		}
	}

	for ( let i = 0; i < plugins.vide.length; i++ ) {
		let
			$element = $(plugins.vide[i]),
			options = $element.data('vide-options'),
			path = $element.data('vide-bg');

		if ( !isMobile ) {
			$element.vide( path, options );

			let
				videObj = $element.data('vide').getVideoObject(),
				scrollHandler = (function( $element ) {
					if ( isScrolledIntoView( $element ) ) this.play();
					else this.pause();
				}).bind( videObj, $element );

			scrollHandler();
			if ( isNoviBuilder ) videObj.pause();
			else document.addEventListener( 'scroll', scrollHandler );
		} else {
			$element.css({ 'background-image': 'url('+ path +'.jpg)' });
		}
	}

	/**
	 * @desc Calls a function when element has been scrolled into the view
	 * @param {object} element - jQuery object
	 * @param {function} func - init function
	 */
	function lazyInit( element, func ) {
		var scrollHandler = function () {
			if ( ( !element.hasClass( 'lazy-loaded' ) && ( isScrolledIntoView( element ) ) ) ) {
				func.call();
				element.addClass( 'lazy-loaded' );
			}
		};

		scrollHandler();
		$window.on( 'scroll', scrollHandler );
	}

	// Initialize scripts that require a loaded page
	$window.on('load', function () {
		// Page loader & Page transition
		if (plugins.preloader.length && !isNoviBuilder) {
			pageTransition({
				target: document.querySelector( '.page' ),
				delay: 0,
				duration: 500,
				classIn: 'fadeIn',
				classOut: 'fadeOut',
				classActive: 'animated',
				conditions: function (event, link) {
					return !/(\#|callto:|tel:|mailto:|:\/\/)/.test(link) && !event.currentTarget.hasAttribute('data-lightgallery');
				},
				onTransitionStart: function ( options ) {
					setTimeout( function () {
						plugins.preloader.removeClass('loaded');
					}, options.duration * .75 );
				},
				onReady: function () {
					plugins.preloader.addClass('loaded');
					windowReady = true;
				}
			});
		}

		// jQuery Count To
		if ( plugins.counter.length ) {
			for ( var i = 0; i < plugins.counter.length; i++ ) {
				var
					counter = $(plugins.counter[i]),
					initCount = function () {
						var counter = $(this);
						if ( !counter.hasClass( "animated-first" ) && isScrolledIntoView( counter ) ) {
							counter.countTo({
								refreshInterval: 40,
								speed: counter.attr("data-speed") || 1000,
								from: 0,
								to: parseInt( counter.text(), 10 )
							});
							counter.addClass('animated-first');
						}
					};

				$.proxy( initCount, counter )();
				$window.on( "scroll", $.proxy( initCount, counter ) );
			}
		}

		// Progress bar
		if ( plugins.progressLinear.length ) {
			for ( var i = 0; i < plugins.progressLinear.length; i++) {
				var
					bar = $(plugins.progressLinear[i]),
					initProgress = function() {
						var
							bar = $(this),
							end = parseInt($(this).find('.progress-value').text(), 10);

						if ( !bar.hasClass( "animated-first" ) && isScrolledIntoView( bar ) ) {
							bar.find('.progress-bar-linear').css({width: end + '%'});
							bar.find('.progress-value').countTo({
								refreshInterval: 40,
								from: 0,
								to: end,
								speed: 1000
							});
							bar.addClass('animated-first');
						}
					};

				$.proxy( initProgress, bar )();
				$window.on( "scroll", $.proxy( initProgress, bar ) );
			}
		}

		// Circle Progress
		if ( plugins.circleProgress.length ) {
			for ( var i = 0; i < plugins.circleProgress.length; i++ ) {
				var circle = $(plugins.circleProgress[i]);

				circle.circleProgress({
					value: circle.attr('data-value'),
					size: circle.attr('data-size') ? circle.attr('data-size') : 175,
					fill: {
						gradient: circle.attr('data-gradient').split(","),
						gradientAngle: Math.PI / 4
					},
					startAngle: -Math.PI / 4 * 2,
					emptyFill: circle.attr('data-empty-fill') ? circle.attr('data-empty-fill') : "rgb(245,245,245)"
				}).on('circle-animation-progress', function (event, progress, stepValue) {
					$(this).find('span').text( String(stepValue.toFixed(2)).replace('0.', '').replace('1.', '1') );
				});

				if ( isScrolledIntoView( circle ) ) circle.addClass('animated-first');

				$window.on( 'scroll', $.proxy( function() {
					var circle = $(this);
					if ( !circle.hasClass( "animated-first" ) && isScrolledIntoView( circle ) ) {
						circle.circleProgress( 'redraw' );
						circle.addClass( 'animated-first' );
					}
				}, circle ) );
			}
		}

		// Isotope
		if ( plugins.isotope.length ) {
			for ( var i = 0; i < plugins.isotope.length; i++ ) {
				var
					wrap = plugins.isotope[ i ],
					filterHandler = function ( event ) {
						event.preventDefault();
						for ( var n = 0; n < this.isoGroup.filters.length; n++ ) this.isoGroup.filters[ n ].classList.remove( 'active' );
						this.classList.add( 'active' );
						this.isoGroup.isotope.arrange( { filter: this.getAttribute( "data-isotope-filter" ) !== '*' ? '[data-filter*="' + this.getAttribute( "data-isotope-filter" ) + '"]' : '*' } );
					},
					resizeHandler = function () {
						this.isoGroup.isotope.layout();
					};

				wrap.isoGroup = {};
				wrap.isoGroup.filters = wrap.querySelectorAll( '[data-isotope-filter]' );
				wrap.isoGroup.node = wrap.querySelector( '.isotope' );
				wrap.isoGroup.layout = wrap.isoGroup.node.getAttribute( 'data-isotope-layout' ) ? wrap.isoGroup.node.getAttribute( 'data-isotope-layout' ) : 'masonry';
				wrap.isoGroup.columnWidth = wrap.isoGroup.node.getAttribute( 'data-column-class' );

				wrap.isoGroup.opts = {
					itemSelector: '.isotope-item',
					layoutMode: wrap.isoGroup.layout,
					filter: '*',
				};

				if ( wrap.isoGroup.columnWidth ) {
					wrap.isoGroup.opts.masonry = {
						columnWidth: wrap.isoGroup.columnWidth
					};
				};

				wrap.isoGroup.isotope = new Isotope( wrap.isoGroup.node, wrap.isoGroup.opts );

				for ( var n = 0; n < wrap.isoGroup.filters.length; n++ ) {
					var filter = wrap.isoGroup.filters[ n ];
					filter.isoGroup = wrap.isoGroup;
					filter.addEventListener( 'click', filterHandler );
				}


				window.addEventListener( 'resize', resizeHandler.bind( wrap ) );
			}
		}

		// Material Parallax
		if ( plugins.materialParallax.length ) {
			if ( !isNoviBuilder && !isIE && !isMobile) {
				plugins.materialParallax.parallax();
			} else {
				for ( var i = 0; i < plugins.materialParallax.length; i++ ) {
					var $parallax = $(plugins.materialParallax[i]);

					$parallax.addClass( 'parallax-disabled' );
					$parallax.css({ "background-image": 'url('+ $parallax.data("parallax-img") +')' });
				}
			}
		}
	});

	// Initialize scripts that require a finished document
	$(function () {
		isNoviBuilder = window.xMode;

		/**
		 * @desc Toggle swiper videos on active slides
		 * @param {object} swiper - swiper slider
		 */
		function toggleSwiperInnerVideos(swiper) {
			var prevSlide = $(swiper.slides[swiper.previousIndex]),
				nextSlide = $(swiper.slides[swiper.activeIndex]),
				videos,
				videoItems = prevSlide.find("video");

			for (var i = 0; i < videoItems.length; i++) {
				videoItems[i].pause();
			}

			videos = nextSlide.find("video");
			if (videos.length) {
				videos.get(0).play();
			}
		}

		/**
		 * @desc Toggle swiper animations on active slides
		 * @param {object} swiper - swiper slider
		 */
		function toggleSwiperCaptionAnimation(swiper) {
			var prevSlide = $(swiper.container).find("[data-caption-animate]"),
				nextSlide = $(swiper.slides[swiper.activeIndex]).find("[data-caption-animate]"),
				delay,
				duration,
				nextSlideItem,
				prevSlideItem;

			for (var i = 0; i < prevSlide.length; i++) {
				prevSlideItem = $(prevSlide[i]);

				prevSlideItem.removeClass("animated")
					.removeClass(prevSlideItem.attr("data-caption-animate"))
					.addClass("not-animated");
			}


			var tempFunction = function (nextSlideItem, duration) {
				return function () {
					nextSlideItem
						.removeClass("not-animated")
						.addClass(nextSlideItem.attr("data-caption-animate"))
						.addClass("animated");
					if (duration) {
						nextSlideItem.css('animation-duration', duration + 'ms');
					}
				};
			};

			for (var i = 0; i < nextSlide.length; i++) {
				nextSlideItem = $(nextSlide[i]);
				delay = nextSlideItem.attr("data-caption-delay");
				duration = nextSlideItem.attr('data-caption-duration');
				if (!isNoviBuilder) {
					if (delay) {
						setTimeout(tempFunction(nextSlideItem, duration), parseInt(delay, 10));
					} else {
						tempFunction(nextSlideItem, duration);
					}

				} else {
					nextSlideItem.removeClass("not-animated")
				}
			}
		}

		/**
		 * @desc Initialize owl carousel plugin
		 * @param {object} c - carousel jQuery object
		 */
		function initOwlCarousel(c) {
			var aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"],
				values = [0, 576, 768, 992, 1200, 1600],
				responsive = {};

			for (var j = 0; j < values.length; j++) {
				responsive[values[j]] = {};
				for (var k = j; k >= -1; k--) {
					if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
						responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"), 10);
					}
					if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
						responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"), 10);
					}
					if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
						responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"), 10);
					}
				}
			}

			// Enable custom pagination
			if (c.attr('data-dots-custom')) {
				c.on("initialized.owl.carousel", function (event) {
					var carousel = $(event.currentTarget),
						customPag = $(carousel.attr("data-dots-custom")),
						active = 0;

					if (carousel.attr('data-active')) {
						active = parseInt(carousel.attr('data-active'), 10);
					}

					carousel.trigger('to.owl.carousel', [active, 300, true]);
					customPag.find("[data-owl-item='" + active + "']").addClass("active");

					customPag.find("[data-owl-item]").on('click', function (e) {
						e.preventDefault();
						carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item"), 10), 300, true]);
					});

					carousel.on("translate.owl.carousel", function (event) {
						customPag.find(".active").removeClass("active");
						customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active")
					});
				});
			}

			c.on("initialized.owl.carousel", function () {
				initLightGalleryItem(c.find('[data-lightgallery="item"]'), 'lightGallery-in-carousel');
			});

			c.owlCarousel({
				autoplay: isNoviBuilder ? false : c.attr("data-autoplay") === "true",
				loop: isNoviBuilder ? false : c.attr("data-loop") !== "false",
				items: 1,
				center: c.attr("data-center") === "true",
				dotsContainer: c.attr("data-pagination-class") || false,
				navContainer: c.attr("data-navigation-class") || false,
				mouseDrag: isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
				nav: c.attr("data-nav") === "true",
				dots: c.attr("data-dots") === "true",
				dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each"), 10) : false,
				animateIn: c.attr('data-animation-in') ? c.attr('data-animation-in') : false,
				animateOut: c.attr('data-animation-out') ? c.attr('data-animation-out') : false,
				responsive: responsive,
				navText: c.attr("data-nav-text") ? $.parseJSON( c.attr("data-nav-text") ) : [],
				navClass: c.attr("data-nav-class") ? $.parseJSON( c.attr("data-nav-class") ) : ['owl-prev', 'owl-next']
			});
		}

		/**
		 * @desc Create live search results
		 * @param {object} options
		 */
		function liveSearch(options) {
			$('#' + options.live).removeClass('cleared').html();
			options.current++;
			options.spin.addClass('loading');
			$.get(handler, {
				s: decodeURI(options.term),
				liveSearch: options.live,
				dataType: "html",
				liveCount: options.liveCount,
				filter: options.filter,
				template: options.template
			}, function (data) {
				options.processed++;
				var live = $('#' + options.live);
				if ((options.processed === options.current) && !live.hasClass('cleared')) {
					live.find('> #search-results').removeClass('active');
					live.html(data);
					setTimeout(function () {
						live.find('> #search-results').addClass('active');
					}, 50);
				}
				options.spin.parents('.rd-search').find('.input-group-addon').removeClass('loading');
			})
		}

		/**
		 * @desc Initialize Google reCaptcha
		 */
		window.onloadCaptchaCallback = function () {
			for (var i = 0; i < plugins.captcha.length; i++) {
				var $capthcaItem = $(plugins.captcha[i]);

				grecaptcha.render(
					$capthcaItem.attr('id'),
					{
						sitekey: $capthcaItem.attr('data-sitekey'),
						size: $capthcaItem.attr('data-size') ? $capthcaItem.attr('data-size') : 'normal',
						theme: $capthcaItem.attr('data-theme') ? $capthcaItem.attr('data-theme') : 'light',
						callback: function (e) {
							$('.recaptcha').trigger('propertychange');
						}
					}
				);
				$capthcaItem.after("<span class='form-validation'></span>");
			}
		};

		/**
		 * @desc Initialize Bootstrap tooltip with required placement
		 * @param {string} tooltipPlacement
		 */
		function initBootstrapTooltip(tooltipPlacement) {
			plugins.bootstrapTooltip.tooltip('dispose');

			if (window.innerWidth < 576) {
				plugins.bootstrapTooltip.tooltip({placement: 'bottom'});
			} else {
				plugins.bootstrapTooltip.tooltip({placement: tooltipPlacement});
			}
		}

		/**
		 * @desc Initialize the gallery with set of images
		 * @param {object} itemsToInit - jQuery object
		 * @param {string} addClass - additional gallery class
		 */
		function initLightGallery(itemsToInit, addClass) {
			if (!isNoviBuilder) {
				$(itemsToInit).lightGallery({
					thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
					selector: "[data-lightgallery='item']",
					autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
					pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
					addClass: addClass,
					mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
					loop: $(itemsToInit).attr("data-lg-loop") !== "false"
				});
			}
		}

		/**
		 * @desc Initialize the gallery with dynamic addition of images
		 * @param {object} itemsToInit - jQuery object
		 * @param {string} addClass - additional gallery class
		 */
		function initDynamicLightGallery(itemsToInit, addClass) {
			if (!isNoviBuilder) {
				$(itemsToInit).on("click", function () {
					$(itemsToInit).lightGallery({
						thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
						selector: "[data-lightgallery='item']",
						autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
						pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
						addClass: addClass,
						mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
						loop: $(itemsToInit).attr("data-lg-loop") !== "false",
						dynamic: true,
						dynamicEl: JSON.parse($(itemsToInit).attr("data-lg-dynamic-elements")) || []
					});
				});
			}
		}

		/**
		 * @desc Initialize the gallery with one image
		 * @param {object} itemToInit - jQuery object
		 * @param {string} addClass - additional gallery class
		 */
		function initLightGalleryItem(itemToInit, addClass) {
			if (!isNoviBuilder) {
				$(itemToInit).lightGallery({
					selector: "this",
					addClass: addClass,
					counter: false,
					youtubePlayerParams: {
						modestbranding: 1,
						showinfo: 0,
						rel: 0,
						controls: 0
					},
					vimeoPlayerParams: {
						byline: 0,
						portrait: 0
					}
				});
			}
		}

		/**
		 * @desc Google map function for getting latitude and longitude
		 */
		function getLatLngObject(str, marker, map, callback) {
			var coordinates = {};
			try {
				coordinates = JSON.parse(str);
				callback(new google.maps.LatLng(
					coordinates.lat,
					coordinates.lng
				), marker, map)
			} catch (e) {
				map.geocoder.geocode({'address': str}, function (results, status) {
					if (status === google.maps.GeocoderStatus.OK) {
						var latitude = results[0].geometry.location.lat();
						var longitude = results[0].geometry.location.lng();

						callback(new google.maps.LatLng(
							parseFloat(latitude),
							parseFloat(longitude)
						), marker, map)
					}
				})
			}
		}

		/**
		 * @desc Initialize Google maps
		 */
		function initMaps() {
			var key;

			for ( var i = 0; i < plugins.maps.length; i++ ) {
				if ( plugins.maps[i].hasAttribute( "data-key" ) ) {
					key = plugins.maps[i].getAttribute( "data-key" );
					break;
				}
			}

			$.getScript('//maps.google.com/maps/api/js?'+ ( key ? 'key='+ key + '&' : '' ) +'sensor=false&libraries=geometry,places&v=quarterly', function () {
				var head = document.getElementsByTagName('head')[0],
					insertBefore = head.insertBefore;

				head.insertBefore = function (newElement, referenceElement) {
					if (newElement.href && newElement.href.indexOf('//fonts.googleapis.com/css?family=Roboto') !== -1 || newElement.innerHTML.indexOf('gm-style') !== -1) {
						return;
					}
					insertBefore.call(head, newElement, referenceElement);
				};
				var geocoder = new google.maps.Geocoder;
				for (var i = 0; i < plugins.maps.length; i++) {
					var zoom = parseInt(plugins.maps[i].getAttribute("data-zoom"), 10) || 11;
					var styles = plugins.maps[i].hasAttribute('data-styles') ? JSON.parse(plugins.maps[i].getAttribute("data-styles")) : [];
					var center = plugins.maps[i].getAttribute("data-center") || "New York";

					// Initialize map
					var map = new google.maps.Map(plugins.maps[i].querySelectorAll(".google-map")[0], {
						zoom: zoom,
						styles: styles,
						scrollwheel: false,
						center: {lat: 0, lng: 0}
					});

					// Add map object to map node
					plugins.maps[i].map = map;
					plugins.maps[i].geocoder = geocoder;
					plugins.maps[i].google = google;

					// Get Center coordinates from attribute
					getLatLngObject(center, null, plugins.maps[i], function (location, markerElement, mapElement) {
						mapElement.map.setCenter(location);
					});

					// Add markers from google-map-markers array
					var markerItems = plugins.maps[i].querySelectorAll(".google-map-markers li");

					if (markerItems.length){
						var markers = [];
						for (var j = 0; j < markerItems.length; j++){
							var markerElement = markerItems[j];
							getLatLngObject(markerElement.getAttribute("data-location"), markerElement, plugins.maps[i], function(location, markerElement, mapElement){
								var icon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
								var activeIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active");
								var info = markerElement.getAttribute("data-description") || "";
								var infoWindow = new google.maps.InfoWindow({
									content: info
								});
								markerElement.infoWindow = infoWindow;
								var markerData = {
									position: location,
									map: mapElement.map
								}
								if (icon){
									markerData.icon = icon;
								}
								var marker = new google.maps.Marker(markerData);
								markerElement.gmarker = marker;
								markers.push({markerElement: markerElement, infoWindow: infoWindow});
								marker.isActive = false;
								// Handle infoWindow close click
								google.maps.event.addListener(infoWindow,'closeclick',(function(markerElement, mapElement){
									var markerIcon = null;
									markerElement.gmarker.isActive = false;
									markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
									markerElement.gmarker.setIcon(markerIcon);
								}).bind(this, markerElement, mapElement));


								// Set marker active on Click and open infoWindow
								google.maps.event.addListener(marker, 'click', (function(markerElement, mapElement) {
									if (markerElement.infoWindow.getContent().length === 0) return;
									var gMarker, currentMarker = markerElement.gmarker, currentInfoWindow;
									for (var k =0; k < markers.length; k++){
										var markerIcon;
										if (markers[k].markerElement === markerElement){
											currentInfoWindow = markers[k].infoWindow;
										}
										gMarker = markers[k].markerElement.gmarker;
										if (gMarker.isActive && markers[k].markerElement !== markerElement){
											gMarker.isActive = false;
											markerIcon = markers[k].markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")
											gMarker.setIcon(markerIcon);
											markers[k].infoWindow.close();
										}
									}

									currentMarker.isActive = !currentMarker.isActive;
									if (currentMarker.isActive) {
										if (markerIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active")){
											currentMarker.setIcon(markerIcon);
										}

										currentInfoWindow.open(map, marker);
									}else{
										if (markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")){
											currentMarker.setIcon(markerIcon);
										}
										currentInfoWindow.close();
									}
								}).bind(this, markerElement, mapElement))
							})
						}
					}
				}
			});
		}

		// Google ReCaptcha
		if (plugins.captcha.length) {
			$.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
		}

		// Additional class on html if mac os.
		if (navigator.platform.match(/(Mac)/i)) {
			$html.addClass("mac-os");
		}

		// Adds some loosing functionality to IE browsers (IE Polyfills)
		if (isIE) {
			if (isIE === 12) $html.addClass("ie-edge");
			if (isIE === 11) $html.addClass("ie-11");
			if (isIE < 10) $html.addClass("lt-ie-10");
			if (isIE < 11) $html.addClass("ie-10");
		}

		// Bootstrap Tooltips
		if (plugins.bootstrapTooltip.length) {
			var tooltipPlacement = plugins.bootstrapTooltip.attr('data-placement');
			initBootstrapTooltip(tooltipPlacement);

			$window.on('resize orientationchange', function () {
				initBootstrapTooltip(tooltipPlacement);
			})
		}

		// Stop vioeo in bootstrapModalDialog
		if (plugins.bootstrapModalDialog.length) {
			for (var i = 0; i < plugins.bootstrapModalDialog.length; i++) {
				var modalItem = $(plugins.bootstrapModalDialog[i]);

				modalItem.on('hidden.bs.modal', $.proxy(function () {
					var activeModal = $(this),
						rdVideoInside = activeModal.find('video'),
						youTubeVideoInside = activeModal.find('iframe');

					if (rdVideoInside.length) {
						rdVideoInside[0].pause();
					}

					if (youTubeVideoInside.length) {
						var videoUrl = youTubeVideoInside.attr('src');

						youTubeVideoInside
							.attr('src', '')
							.attr('src', videoUrl);
					}
				}, modalItem))
			}
		}

		// Popovers
		if (plugins.popover.length) {
			if (window.innerWidth < 767) {
				plugins.popover.attr('data-placement', 'bottom');
				plugins.popover.popover();
			}
			else {
				plugins.popover.popover();
			}
		}

		// Bootstrap Buttons
		if (plugins.statefulButton.length) {
			$(plugins.statefulButton).on('click', function () {
				var statefulButtonLoading = $(this).button('loading');

				setTimeout(function () {
					statefulButtonLoading.button('reset')
				}, 2000);
			})
		}

		// Bootstrap tabs
		if (plugins.bootstrapTabs.length) {
			for (var i = 0; i < plugins.bootstrapTabs.length; i++) {
				var bootstrapTabsItem = $(plugins.bootstrapTabs[i]);

				//If have slick carousel inside tab - resize slick carousel on click
				if (bootstrapTabsItem.find('.slick-slider').length) {
					bootstrapTabsItem.find('.tabs-custom-list > li > a').on('click', $.proxy(function () {
						var $this = $(this);
						var setTimeOutTime = isNoviBuilder ? 1500 : 300;

						setTimeout(function () {
							$this.find('.tab-content .tab-pane.active .slick-slider').slick('setPosition');
						}, setTimeOutTime);
					}, bootstrapTabsItem));
				}
			}
		}

		// Copyright Year (Evaluates correct copyright year)
		if (plugins.copyrightYear.length) {
			plugins.copyrightYear.text(initialDate.getFullYear());
		}

		// Google maps
		if( plugins.maps.length ) {
			lazyInit( plugins.maps, initMaps );
		}

		// Add custom styling options for input[type="radio"]
		if (plugins.radio.length) {
			for (var i = 0; i < plugins.radio.length; i++) {
				$(plugins.radio[i]).addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
			}
		}

		// Add custom styling options for input[type="checkbox"]
		if (plugins.checkbox.length) {
			for (var i = 0; i < plugins.checkbox.length; i++) {
				$(plugins.checkbox[i]).addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
			}
		}

		// UI To Top
		if (isDesktop && !isNoviBuilder) {
			$().UItoTop({
				easingType: 'easeOutQuad',
				containerClass: 'ui-to-top fa fa-angle-up'
			});
		}

		// RD Navbar
		if (plugins.rdNavbar.length) {
			var aliaces, i, j, len, value, values, responsiveNavbar;

			aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"];
			values = [0, 576, 768, 992, 1200, 1600];
			responsiveNavbar = {};

			for (i = j = 0, len = values.length; j < len; i = ++j) {
				value = values[i];
				if (!responsiveNavbar[values[i]]) {
					responsiveNavbar[values[i]] = {};
				}
				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'layout')) {
					responsiveNavbar[values[i]].layout = plugins.rdNavbar.attr('data' + aliaces[i] + 'layout');
				}
				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'device-layout')) {
					responsiveNavbar[values[i]]['deviceLayout'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'device-layout');
				}
				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'hover-on')) {
					responsiveNavbar[values[i]]['focusOnHover'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'hover-on') === 'true';
				}
				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'auto-height')) {
					responsiveNavbar[values[i]]['autoHeight'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'auto-height') === 'true';
				}

				if (isNoviBuilder) {
					responsiveNavbar[values[i]]['stickUp'] = false;
				} else if (plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up')) {
					responsiveNavbar[values[i]]['stickUp'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up') === 'true';
				}

				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset')) {
					responsiveNavbar[values[i]]['stickUpOffset'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset');
				}
			}


			plugins.rdNavbar.RDNavbar({
				anchorNav: !isNoviBuilder,
				stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
				responsive: responsiveNavbar,
				callbacks: {
					onStuck: function () {
						var navbarSearch = this.$element.find('.rd-search input');

						if (navbarSearch) {
							navbarSearch.val('').trigger('propertychange');
						}
					},
					onDropdownOver: function () {
						return !isNoviBuilder;
					},
					onUnstuck: function () {
						if (this.$clone === null)
							return;

						var navbarSearch = this.$clone.find('.rd-search input');

						if (navbarSearch) {
							navbarSearch.val('').trigger('propertychange');
							navbarSearch.trigger('blur');
						}

					}
				}
			});


			if (plugins.rdNavbar.attr("data-body-class")) {
				document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");
			}
		}

		// RD Search
		if (plugins.search.length || plugins.searchResults) {
			var handler = "bat/rd-search.php";
			var defaultTemplate = '<h5 class="search-title"><a target="_top" href="#{href}" class="search-link">#{title}</a></h5>' +
				'<p>...#{token}...</p>' +
				'<p class="match"><em>Terms matched: #{count} - URL: #{href}</em></p>';
			var defaultFilter = '*.html';

			if (plugins.search.length) {
				for (var i = 0; i < plugins.search.length; i++) {
					var searchItem = $(plugins.search[i]),
						options = {
							element: searchItem,
							filter: (searchItem.attr('data-search-filter')) ? searchItem.attr('data-search-filter') : defaultFilter,
							template: (searchItem.attr('data-search-template')) ? searchItem.attr('data-search-template') : defaultTemplate,
							live: (searchItem.attr('data-search-live')) ? searchItem.attr('data-search-live') : false,
							liveCount: (searchItem.attr('data-search-live-count')) ? parseInt(searchItem.attr('data-search-live'), 10) : 4,
							current: 0, processed: 0, timer: {}
						};

					var $toggle = $('.rd-navbar-search-toggle');
					if ($toggle.length) {
						$toggle.on('click', (function (searchItem) {
							return function () {
								if (!($(this).hasClass('active'))) {
									searchItem.find('input').val('').trigger('propertychange');
								}
							}
						})(searchItem));
					}

					if (options.live) {
						var clearHandler = false;

						searchItem.find('input').on("input propertychange", $.proxy(function () {
							this.term = this.element.find('input').val().trim();
							this.spin = this.element.find('.input-group-addon');

							clearTimeout(this.timer);

							if (this.term.length > 2) {
								this.timer = setTimeout(liveSearch(this), 200);

								if (clearHandler === false) {
									clearHandler = true;

									$body.on("click", function (e) {
										if ($(e.toElement).parents('.rd-search').length === 0) {
											$('#rd-search-results-live').addClass('cleared').html('');
										}
									})
								}

							} else if (this.term.length === 0) {
								$('#' + this.live).addClass('cleared').html('');
							}
						}, options, this));
					}

					searchItem.submit($.proxy(function () {
						$('<input />').attr('type', 'hidden')
							.attr('name', "filter")
							.attr('value', this.filter)
							.appendTo(this.element);
						return true;
					}, options, this))
				}
			}

			if (plugins.searchResults.length) {
				var regExp = /\?.*s=([^&]+)\&filter=([^&]+)/g;
				var match = regExp.exec(location.search);

				if (match !== null) {
					$.get(handler, {
						s: decodeURI(match[1]),
						dataType: "html",
						filter: match[2],
						template: defaultTemplate,
						live: ''
					}, function (data) {
						plugins.searchResults.html(data);
					})
				}
			}
		}

		// Add class in viewport
		if (plugins.viewAnimate.length) {
			for (var i = 0; i < plugins.viewAnimate.length; i++) {
				var $view = $(plugins.viewAnimate[i]).not('.active');
				$document.on("scroll", $.proxy(function () {
					if (isScrolledIntoView(this)) {
						this.addClass("active");
					}
				}, $view))
					.trigger("scroll");
			}
		}

		if ( plugins.swiper ) {
			for ( var i = 0; i < plugins.swiper.length; i++ ) {
				var
					sliderMarkup    = plugins.swiper[i],
					autoplayAttr    = sliderMarkup.getAttribute( 'data-autoplay' ) || 5000,
					slides          = sliderMarkup.querySelectorAll( '.swiper-slide' ),
					pagSelector     = sliderMarkup.getAttribute( 'data-pagination' ),
					pagNode         = document.querySelector( pagSelector ) || sliderMarkup.querySelector( '.swiper-pagination' ),
					navNextSelector = sliderMarkup.getAttribute( 'data-next' ),
					navPrevSelector = sliderMarkup.getAttribute( 'data-prev' ),
					navNextNode     = document.querySelector( navNextSelector ) || sliderMarkup.querySelector( '.swiper-button-next' ),
					navPrevNode     = document.querySelector( navPrevSelector ) || sliderMarkup.querySelector( '.swiper-button-prev' ),
					swiper,

					options = {
						loop: sliderMarkup.getAttribute( 'data-loop' ) === 'true' || false,
						effect: sliderMarkup.getAttribute( 'data-effect' ) || 'slide',
						direction: sliderMarkup.getAttribute( 'data-direction' ) || 'horizontal',
						speed: sliderMarkup.getAttribute( 'data-speed' ) ? Number( sliderMarkup.getAttribute( 'data-speed' ) ) : 1000,
						runCallbacksOnInit: false,
						slidesPerView: 'auto'
					};

				if ( Number( autoplayAttr ) ) {
					options.autoplay = {
						delay: Number( autoplayAttr ),
						stopOnLastSlide: false,
						disableOnInteraction: true,
						reverseDirection: false,
					};
				}

				if ( sliderMarkup.getAttribute( 'data-keyboard' ) === 'true' ) {
					options.keyboard = {
						enabled: sliderMarkup.getAttribute( 'data-keyboard' ) === 'true',
						onlyInViewport: true
					};
				}

				if ( sliderMarkup.getAttribute( 'data-mousewheel' ) === 'true' ) {
					options.mousewheel = {
						releaseOnEdges: true,
						sensitivity: .1
					};
				}

				if ( navPrevNode || navNextNode ) {
					options.navigation = {
						nextEl: navNextNode,
						prevEl: navPrevNode
					};
				}

				if ( pagNode ) {
					options.pagination = {
						el: pagNode,
						type: 'bullets',
						clickable: true
					};
				}

				if ( sliderMarkup.querySelector( '.swiper-scrollbar' ) ) {
					options.scrollbar = {
						el: '.swiper-scrollbar',
						hide: true,
						draggable: true
					};
				}

				for ( var s = 0; s < slides.length; s++ ) {
					var
						slide = slides[s],
						url = slide.getAttribute( 'data-slide-bg' );

					if ( url ) slide.style.backgroundImage = 'url('+ url +')';
				}

				swiper = new Swiper ( plugins.swiper[i], options );
			}
		}

		// Owl carousel
		if (plugins.owl.length) {
			for (var i = 0; i < plugins.owl.length; i++) {
				var c = $(plugins.owl[i]);
				plugins.owl[i].owl = c;

				initOwlCarousel(c);
			}
		}

		// WOW
		if ($html.hasClass("wow-animation") && plugins.wow.length && !isNoviBuilder && isDesktop) {
			new WOW().init();
		}

		// RD Input Label
		if (plugins.rdInputLabel.length) {
			plugins.rdInputLabel.RDInputLabel();
		}

		// lightGallery
		if (plugins.lightGallery.length) {
			for (var i = 0; i < plugins.lightGallery.length; i++) {
				initLightGallery(plugins.lightGallery[i]);
			}
		}

		// lightGallery item
		if (plugins.lightGalleryItem.length) {
			// Filter carousel items
			var notCarouselItems = [];

			for (var z = 0; z < plugins.lightGalleryItem.length; z++) {
				if (!$(plugins.lightGalleryItem[z]).parents('.owl-carousel').length &&
					!$(plugins.lightGalleryItem[z]).parents('.swiper-slider').length &&
					!$(plugins.lightGalleryItem[z]).parents('.slick-slider').length) {
					notCarouselItems.push(plugins.lightGalleryItem[z]);
				}
			}

			plugins.lightGalleryItem = notCarouselItems;

			for (var i = 0; i < plugins.lightGalleryItem.length; i++) {
				initLightGalleryItem(plugins.lightGalleryItem[i]);
			}
		}

		// Dynamic lightGallery
		if (plugins.lightDynamicGalleryItem.length) {
			for (var i = 0; i < plugins.lightDynamicGalleryItem.length; i++) {
				initDynamicLightGallery(plugins.lightDynamicGalleryItem[i]);
			}
		}

		// Select2
		if (plugins.selectFilter.length) {
			for (var i = 0; i < plugins.selectFilter.length; i++) {
				var
					select = $(plugins.selectFilter[i]),
					opts = {
						placeholder: select.attr("data-placeholder") ? select.attr("data-placeholder") : false,
						minimumResultsForSearch: select.attr("data-minimum-results-search") ? select.attr("data-minimum-results-search") : 10,
						maximumSelectionSize: 3,
						dropdownParent: $('.page'),
						containerCssClass: select.attr("data-container-class") ? select.attr("data-container-class") : '',
						dropdownCssClass: select.attr("data-dropdown-class") ? select.attr("data-dropdown-class") : '',
					};

				select.select2(opts);
			}
		}

		// Bootstrap Date time picker
		if (plugins.bootstrapDateTimePicker.length) {
			var i;
			for (i = 0; i < plugins.bootstrapDateTimePicker.length; i++) {
				var $dateTimePicker = $(plugins.bootstrapDateTimePicker[i]);
				var options = {};

				options['format'] = 'dddd DD MMMM YYYY - HH:mm';
				if ($dateTimePicker.attr("data-time-picker") === "date") {
					options['format'] = 'MMM Do YY';
					options['minDate'] = new Date();
				} else if ($dateTimePicker.attr("data-time-picker") === "time") {
					options['format'] = 'HH:mm';
				}

				options["time"] = ($dateTimePicker.attr("data-time-picker") !== "date");
				options["date"] = ($dateTimePicker.attr("data-time-picker") !== "time");
				options["shortTime"] = true;

				$dateTimePicker.bootstrapMaterialDatePicker(options);
			}
		}

		// Custom Toggles
		if (plugins.customToggle.length) {
			for (var i = 0; i < plugins.customToggle.length; i++) {
				var $this = $(plugins.customToggle[i]);

				$this.on('click', $.proxy(function (event) {
					event.preventDefault();

					var $ctx = $(this);
					$($ctx.attr('data-custom-toggle')).add(this).toggleClass('active');
				}, $this));

				if ($this.attr("data-custom-toggle-hide-on-blur") === "true") {
					$body.on("click", $this, function (e) {
						if (e.target !== e.data[0]
							&& $(e.data.attr('data-custom-toggle')).find($(e.target)).length
							&& e.data.find($(e.target)).length === 0) {
							$(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
						}
					})
				}

				if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
					$body.on("click", $this, function (e) {
						if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length === 0 && e.data.find($(e.target)).length === 0) {
							$(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
						}
					})
				}
			}
		}

		// TimeCircles
		if (plugins.dateCountdown.length) {
			for ( var i = 0; i < plugins.dateCountdown.length; i++ ) {
				var
					dateCountdownItem = $( plugins.dateCountdown[ i ] ),
					countdownRender = function () {
						dateCountdownItem.TimeCircles( {
							time: { Seconds: { show: !( window.innerWidth < 768 ), } }
						} ).rebuild();
					};

				dateCountdownItem.TimeCircles( {
					color: dateCountdownItem.attr( "data-color" ) ? dateCountdownItem.attr( "data-color" ) : "rgba(247, 247, 247, 1)",
					animation: "smooth",
					bg_width: dateCountdownItem.attr( "data-bg-width" ) ? dateCountdownItem.attr( "data-bg-width" ) : 0.6,
					circle_bg_color: dateCountdownItem.attr( "data-bg" ) ? dateCountdownItem.attr( "data-bg" ) : "rgba(0, 0, 0, 1)",
					fg_width: dateCountdownItem.attr( "data-width" ) ? dateCountdownItem.attr( "data-width" ) : 0.03,
					time: {
						Days: {
							text: "Days",
							show: true,
							color: dateCountdownItem.attr( "data-color" ) ? dateCountdownItem.attr( "data-color" ) : "#f9f9f9"
						},
						Hours: {
							text: "Hours",
							show: true,
							color: dateCountdownItem.attr( "data-color" ) ? dateCountdownItem.attr( "data-color" ) : "#f9f9f9"
						},
						Minutes: {
							text: "Minutes",
							show: true,
							color: dateCountdownItem.attr( "data-color" ) ? dateCountdownItem.attr( "data-color" ) : "#f9f9f9"
						},
						Seconds: {
							text: "Seconds",
							show: false,
							color: dateCountdownItem.attr( "data-color" ) ? dateCountdownItem.attr( "data-color" ) : "#f9f9f9"
						}
					}
				} );

				countdownRender();
				window.addEventListener( 'resize', countdownRender );
			}
		}


	});
}());
