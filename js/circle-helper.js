/*global tau */
/*jslint unparam: true */
(function (tau) {

	// This logic works only on circular device.
	if (tau.support.shape.circle) {
		document.addEventListener("pagebeforeshow", function (event) {
			var page = event.target;
			if (page.id !== "page-snaplistview" && page.id !== "page-swipelist" && page.id !== "page-marquee-list") {
				var list = page.querySelector(".ui-listview");
				if (list) {
					tau.widget.ArcListview(list);
				}
			}
		});
	}
}(tau));
