//  var monthlyCost = userProfileManager.getUserProfile().monthlyCost;
//  var monthlyCostDep = new Tracker.Dependency;
var serviceCharge = 1.16 * 365;
var theSlider = null; // Holds NoUiSlider object for tracker autorun update

/*savingImage*/
//var shades = Meteor.settings.public.shades;
//var shade;
//var shadeDep = new Tracker.Dependency;
//
////  var shadesDep = new Tracker.Dependency;
//
//var getShade = function () {
//  shadeDep.depend();
//  return shade;
//};
//var setShade = function (newShade) {
//  shade = newShade;
//  shadeDep.changed();
//};

var getYearlyCost = function () {
  return userProfileManager.getUserProfile().monthlyCost * 12;
};

var getMonthlyCost = function () {
  return userProfileManager.getUserProfile().monthlyCost;
};

var setMonthlyCost = function (newValue) {
  var usageCost = (newValue * 12) - serviceCharge;
  var dailyCost = usageCost / 365;
  var newKwh = Math.max(Math.round(dailyCost / 0.253), 0);

  if (!isKwhSetByUser()) {
    userProfileManager.updateUserProfile({
      monthlyCost: parseInt(newValue), yearlyCost: newValue * 12,
      kwh: newKwh, estimatedKwh: newKwh, isKwhSetByUser: false, isFakeData: false
    });
  } else {
    userProfileManager.updateUserProfile({
      monthlyCost: parseInt(newValue), yearlyCost: newValue * 12, estimatedKwh: newKwh,
      isFakeData: false
    });
  }
};

var setKwh = function (newKwh, isSetByUser) {
  userProfileManager.updateUserProfile({kwh: newKwh, isKwhSetByUser: isSetByUser, isFakeData: false});
};

var isKwhSetByUser = function () {
  var profile = userProfileManager.getUserProfile();
  return (profile && typeof(profile.isKwhSetByUser) != 'undefined') ? profile.isKwhSetByUser : false;
};

var setIsKwhSetByUser = function (flag) {
  userProfileManager.updateUserProfile({isKwhSetByUser: flag});
  setMonthlyCost(getMonthlyCost()); // recalculates monthly cost
};

var getKwh = function () {
  var kwh = userProfileManager.getUserProfile().kwh;
  return (typeof(kwh) != 'undefined') ? parseFloat(kwh) : 21.00; // Default kWh per day usage
};

var getEstimatedKwh = function () {
  var kwh = userProfileManager.getUserProfile().estimatedKwh;
  return (typeof(kwh) != 'undefined') ? parseFloat(kwh) : 21.00; // Default kWh per day usage
};

Template.uiSlider.events({
  'input input[type=range]': function (e, t) {
    var output = t.find('output');
    setMonthlyCost(e.currentTarget.value);
  },
  'keyup #kwh': function (e) {
    if (e.currentTarget.value == '') {
      setIsKwhSetByUser(false);
    } else {
      var newval = parseFloat(e.currentTarget.value);
      if (isNaN(newval)) newval = getKwh();
      newval = Math.max(0, Math.min(150, newval)); //TODO: Make maximum kWh a parameter - hard-coded here
      setKwh(newval, true);
      e.currentTarget.value = newval;
    }
  }
});

Template.uiSlider.onCreated(function () {
  setMonthlyCost(getMonthlyCost());
});

Template.uiSlider.onDestroyed(function () {
});

Template.uiSlider.onRendered(function () {
  setMonthlyCost(getMonthlyCost());

  //setShade(shades[Session.get('shadeSettings')]);
  var range = {
    'min': [0],
    'max': [900]
  };
  theSlider = this.$('.range-slider').noUiSlider({
    range: range,
    tooltips: true,
    connect: 'lower',
    start: getMonthlyCost(),
    step: 25,
    pips: {
      mode: 'values',
      values: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      density: 5,
      stepped: true
    }
  }).on('slide', function (ev, val) {
    // set real values on 'slide' event
    setMonthlyCost(val);
  }).on('change', function (ev, val) {
    setMonthlyCost(val);
  });

  $('.range-slider').noUiSlider_pips({
    mode: 'values',
    values: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    density: 5
  }, true);

  // Autorun - on startup or new address, this makes the slider consistent with displayed monthly cost value
  var handle = this.autorun(function () {
    var monthlyValue = getMonthlyCost();
    if (theSlider != null && theSlider.val() != monthlyValue) {
      theSlider.val(monthlyValue);
      if (isKwhSetByUser()) {
        $('#kwh').val(getKwh());
      }
//      if (typeof(handle) != 'undefined') handle.stop();
    }
  });
});

Template.uiSlider.helpers({
  slider: function () {
    return getMonthlyCost();
  },
  monthlyCostHelper: function () {
    return getMonthlyCost();
  },
  yearlyCostHelper: function () {
    return getYearlyCost();
  },
  killowattPh: function () {
    return getEstimatedKwh().toFixed(2);
  }
  ///*savingImage*/
  //residentialMax: function () {
  //  return 500;
  //},
  //savingsImageHelper: function () {
  //  savingsImageDep.depend();
  //  return getSavingsImage();
  //},
});
