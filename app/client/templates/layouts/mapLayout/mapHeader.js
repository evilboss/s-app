//var savingsImage = 'savings/great.png';
//var savingsImageDep = new Tracker.Dependency;
//var baseTotal = 10;
//var baseTotalDep = new Tracker.Dependency;
//var savingsScore = 0;
//var savingsScoreDep = new Tracker.Dependency;
//var setSavingsImage = function (score) {
//  console.log(score >= 8)
//  if (score >= 8) {
//    savingsImage = 'savings/great.png'
//  } else if (score >= 5) {
//    savingsImage = 'savings/good.png'
//  } else if (score >= 4) {
//    savingsImage = 'savings/fair.png'
//  } else {
//    savingsImage = 'savings/ok.png'
//  }
//  savingsImageDep.changed();
//};
//var incrementBase = function () {
//  baseTotal = baseTotal + 10;
//  baseTotalDep.changed();
//}
//var setSavingsScore = function (score) {
//  savingsScore = score;
//  setSavingsImage(score);
//  savingsScoreDep.changed();
//}
//var getSavingsScore = function () {
//  savingsScoreDep.depend();
//  return savingsScore;
//
//}
//var decrementBase = function () {
//  baseTotal = baseTotal - 10;
//  baseTotalDep.changed();
//}
//var getBaseTotal = function () {
//  baseTotalDep.depend();
//  return baseTotal;
//}
//var getSavingsImageFunction = function () {
//  console.log(savingsImage);
//  getSavingsScore();
//  getBaseTotal();
//  savingsImageDep.depend();
//  return savingsImage;
//}
Template.mapHeader.events({
  'click .contactForm.button': function () {
    if (Session.get('leadId')) {
      window.open(Meteor.absoluteUrl() + 'reports/' + Session.get('leadId'));
    } else {
      $('.contactForm.modal').modal('show');
    }
  },
});
Template.mapHeader.helpers({
  //getSavingsImage: function () {
  //  return getSavingsImageFunction();
  //},
  getEstimatedCost: function () {
    return MapData.findOne().estimatedCost;
  },
  getEstimatedSavings: function () {
    if (Session.get('YearlyCost')) {
      var nightUsage = 75;
      if (Session.get('nightUsage')) {
        nightUsage = Session.get('nightUsage');
      }
      var dailyUsage = Math.round(parseInt(Math.abs(nightUsage - 100)));
      return Math.round(parseInt(Session.get('YearlyCost')) / dailyUsage);
    }
    return 0;
  },
  telLink: function() {
  return Meteor.settings.public.contact.telephone.replace(/\s/g,''); // remove whitespace
},
telephone: function() {
  return Meteor.settings.public.contact.telephone;
}
});
Template.mapHeader.rendered = function () {
  $('.masthead').visibility({
    once: false,
    onBottomPassed: function () {
      $('.fixed.menu').transition('fade in');
    },
    onBottomPassedReverse: function () {
      $('.fixed.menu').transition('fade out');
    }
  });
  $('.ui.sidebar').sidebar('attach events', '.toc.item');
  $('.ui.dropdown').dropdown();
  $('.dropdown').dropdown({});

};
