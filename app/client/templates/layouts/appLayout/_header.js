Template._header.events({
    'click a[data-action=logout]': function (e) {
        e.preventDefault();
        AccountsTemplates.logout();
    }
});
Template._header.rendered = function () {

    $('.masthead')
        .visibility({
            once: false,
            onBottomPassed: function () {
                $('.fixed.menu').transition('fade in');
            },
            onBottomPassedReverse: function () {
                $('.fixed.menu').transition('fade out');
            }
        });
    // create sidebar and attach to menu open
    $('.ui.sidebar')
        .sidebar('attach events', '.toc.item');
    $('.ui.dropdown')
        .dropdown();
    $('.dropdown').dropdown({});
};