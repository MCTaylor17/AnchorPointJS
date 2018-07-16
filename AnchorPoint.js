(function ($) {
	var initialized = false;
	$.fn.AnchorPoint = function (args) {
		if (initialized) {
			console.warn("AnchorPoint is already initialized.\n Using settings from the first initialization");
			return false;
		}
		initialized = true;

		// Set Defaults
		var opts = args || {};
		var options = opts;
		options.depth = opts.depth || 0.2;
		options.anchorTimeout = opts.anchorTimeout || 500;
		options.debug = opts.debug || false;
		if (opts.depth === 0) {
			options.depth = 0;
		}

		var $scope = $(this);
		var $anchor;
		var anchorGap;
		var scrollTimeout = false;

		// When resized
		$(window).on("load scroll", function () {
			if (scrollTimeout) {
				clearTimeout(scrollTimeout);
				scrollTimeout = setTimeout(function () {
					$anchor = findAnchor($scope, options);
					anchorGap = $anchor.offset().top - window.scrollY;

					// Show anchor
					if (options.debug) {
						$("[data-AnchorPoint-anchor]").removeAttr("data-AnchorPoint-anchor");
						$anchor.attr("data-AnchorPoint-anchor", true);
					}
				}, options.anchorTimeout);
			} else {
				scrollTimeout = true;
				$anchor = findAnchor($scope, options);
				anchorGap = $anchor.offset().top - window.scrollY;
			}
		});

		$(window).on("resize", function () {
			$(window).scrollTop($anchor.offset().top - anchorGap);
		});

		// Show anchor line
		if (options.debug) {
			var $line = $("<div>");
			var lineAt = $(window).height() * options.depth;
			$line.css({
				position: "fixed",
				top: lineAt,
				left: 0,
				width: "100%",
				height: "1px",
				background: "red"
			});
			$("body").append($line);
			$(window).on("resize", function () {
				var lineAt = $(window).height() * options.depth;
				$line.css("top", lineAt);
			});
		}

		// Allow chaining
		return this;
	};

	function findAnchor($start, options) {
		var $search = $start;
		var $prev = $start;
		var scrollTop = window.scrollY;
		var depthOffset = $(window).height() * options.depth;
		var anchorPoint = scrollTop + depthOffset;
		var $children;
		var $next;
		var hasChildren;
		var hasNext;
		var offsetTop;
		var offsetBottom;
		var isAnchorPointAboveTop;
		var isAnchorPointBelowTop;
		var isAnchorPointAboveBottom;
		var isAnchorPointBelowBottom;
		var isAnchorPointWithin;
		var isQualified;

		while (true) {
			$next = $search.next();
			$children = $search.children();
			hasNext = $next.length;
			hasChildren = $children.length;
			offsetTop = $search.offset().top;
			offsetBottom = offsetTop + $search.outerHeight();
			isQualified = $search.css("position") !== "fixed";
			isAnchorPointAboveTop = anchorPoint < offsetTop;
			isAnchorPointBelowTop = anchorPoint >= offsetTop;
			isAnchorPointAboveBottom = anchorPoint <= offsetBottom;
			isAnchorPointBelowBottom = anchorPoint > offsetBottom;
			isAnchorPointWithin = isAnchorPointBelowTop && isAnchorPointAboveBottom;

			if (!isQualified) {
				if (hasNext) {
					$search = $next;
					continue;
				}
				return $prev;
			}

			if (isAnchorPointWithin) {
				if (hasChildren) {
					$prev = $search;
					$search = $children.first();
					continue;
				} else {
					return $search;
				}
			}

			if (isAnchorPointAboveTop) {
				return $search;
			}

			if (isAnchorPointBelowBottom) {
				if (hasNext) {
					$prev = $search;
					$search = $search.next();
					continue;
				} else {
					return $search;
				}
			}

			// Unable to locate a valid anchor
			return false;
		}
	}
}(jQuery));
