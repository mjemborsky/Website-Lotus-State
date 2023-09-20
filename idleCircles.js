// WHEN ON PROJECT PAGES OR EXTRA.HTML
// Needs to wait for page to load
// Then it identifies the active svg and current points,
// then identifies the target svg based off the current (projects or extra)
// then WHILE the page is opened and not navigating,
// it should call a function, idleCircles that accepts one svg (target)
// It should animate the r values of the current svg to this new svg positions over 4 seconds, with no ease in or out (linear velocity)
// Then the code should call the function in reverse, so that it animates the circle positions back to the current svg over 4 seconds, same ease

