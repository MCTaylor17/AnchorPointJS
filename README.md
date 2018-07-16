# AnchorPointJS

AnchorPointJS is a simple jQuery plugin for holding a webpage in-place while resizing so that the user never loses orientation.

## The Problem
Whenever a webpage is resized, all of the content reflows to fit the new shape of the page.  Modern web design best practices allow a web page to shrink or grow to almost any size.  Unfortunately, when the content reflows, the browsers simply hold the scroll-bar location at a consistent distance from the top of the page.

The user will typically experience this as content drifting through their viewport.  The problem is compounded by lengthy pages with responsive images.  Furthermore, this effect also occurs when the user isn't looking, for example resizing a window while looking a different tab.

Below is an example of a Wikipedia page starting at one position and ending elsewhere after resizing a few times.

![Before AnchorPointJS](assets/example-before.png)

## The Solution
AnchorPointJS solves the above problem by "anchoring" to an element within the user's expected reading position on the page.  As they scroll, the anchor changes elements accordingly.  When the window is resized, AnchorPointJS will continuously update the scroll position to effectively hold the anchored-element in place on the page.

Below is the same example from above, but no matter how much the page is resized, it will always be anchored to the nearest element to the red line.

![Image of Yaktocat](assets/example-after.png)

## Usage
Simply add AnchorPointJS to your webpage after jQuery and invoke it on the main contents of your page.

```html
<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
<script src="./path/to/AnchorPoint.js"></script>
<script>
$("#content").AnchorPoint();
</script>
```

### Options
An optional JavaScript object can be passed as a parameter during the invokation.  jOptions include:

* **anchorTimeout (integer):** - Defaults to `500` milliseconds.  Due to the number of scroll events, AnchorPoint uses a debouncing function to delay searching for a new anchor after scrolling has stopped.  This can be increased or decreased to optimize between fast anchoring and overall code performance.
* **depth (float):** - Defaults to `0.2`.  How far down the screen AnchorPointJS will begin looking for an anchor.  Set to anything between `0` and `1` where `0` is the very top and `1` is the very bottom.
* **debug (boolean):** - Defaults to `false`. When set to true, it shows a horizontal line representing the depth of the anchoring point.

```js
let AnchorPointOptions = {
	anchorTimeout: 200,
	depth: 0.2,
	debug: true
}
$("body").AnchorPoint(AnchorPointOptions);
```
