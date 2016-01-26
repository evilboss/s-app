Leads = new Mongo.Collection('leads');


Leads.attachSchema(new SimpleSchema({
        firstname: {
            type: String,
            label: "First Name",
            max: 200
        },
        lastname: {
            type: String,
            label: "Last Name",
            max: 200
        },
        email: {
            optional: false,
            type: String,
            regEx: SimpleSchema.RegEx.Email
        },
        phone: {
            optional: true,
            type: String,
            label: 'Phone #',
            regEx: /^[0-9]{10}$/
        },
        address: {
            type: String,
            optional: true
        },
        bounds: {
            type: String,
            optional: true
        },
        isPassedToNetsuite: {
            type: Boolean,
            optional: true,
            defaultValue: false
        }
    }
));

Leads.after.insert(function (id, doc) {
    if (Meteor.isClient) {
        var currentMap = MapData.findOne();
        MapData.update({_id: currentMap._id}, {
            $set: {
                mapCoordinates: doc,
            }
        });

        Meteor.call('saveLeadData', doc, MapData.findOne());

        // collection is shared - make sure we only send ONE email - call from Client so non-blocking
        Meteor.call('sendThankYouEmail', doc);
    }
});


Leads.allow({
    insert: function (userId, doc) {
        return true;
    },
    update: function (userId, doc, fieldNames, modifier) {
        return true;
    },
    remove: function (userId, doc) {
        return false;
    }
});

Leads.deny({
    insert: function (userId, doc) {
        return false;
    },

    update: function (userId, doc, fieldNames, modifier) {
        return false;
    },

    remove: function (userId, doc) {
        return true;
    }
});
