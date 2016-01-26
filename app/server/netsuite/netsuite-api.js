/**
 * NetSuite API functions
 * Send new leads data to NetSuite for followup
 */
Meteor.startup(function () {
//  netsuiteApiTest();
});

var netsuiteApiTest = function () {
  console.log('Initialising NetSuite API...');
  var url = 'https://rest.netsuite.com/app/site/hosting/restlet.nl?script=70&deploy=1'; // initialize
  url = 'https://rest.netsuite.com/app/site/hosting/restlet.nl?script=71&deploy=1'; // load
  url = 'https://rest.netsuite.com/app/site/hosting/restlet.nl?script=75&deploy=1'; // upsert
  //url = 'https://rest.netsuite.com/app/site/hosting/restlet.nl?script=73&deploy=1'; //search

  var request_list = null;

  // Initialise
  request_list = {
    'record_type': 'lead'
  };

  // Load
  request_list = [
    {
      'record_type': 'lead',
      'internalid': '9314'
    }
  ];


  request_list = {
    "record_data":
    [{
      "record_type": "lead",
      "literal_fields": {
        'firstname': 'Fred',
        'lastname': 'Nurk',
        'email': 'steve+frednurk@steveovens.com',
        'propertytype': 'Not Specified',
        "entitystatus": '6', //{'name': 'LEAD-Unqualified', 'internalid': '6'},
//        "custentity_2663_customer_refund": 'false',
        "customform": '22', //{name: 'MGA Customer Form', internalid: '22'},
        "receivablesaccount": -10, //{name: 'Use System Preference', internalid: '-10'},
//        "isinactive": 'false',
        "isperson": 'T',
//        "custentity_2663_direct_debit": 'false',
        "salesrep": '8813', //{name: 'Maughan, Andrew', internalid: '8813'},
        "emailpreference": 'DEFAULT', //{name: 'Default', internalid: 'DEFAULT'},
        "currency": '1', //{name: 'AUD', internalid: '1'}
        "leadsource": '-6', //{ name: 'Web', internalid: '-6' },
        "weblead": 'Yes',
        "custentity_mga_property_type": '3', //{ name: 'Not Specified', internalid: '3' }
        "comments": 'Comments from a web form go here, right??'
      }
    }]
  };

/*
  request_list = {
      'record_type': 'lead',
      'batch_size': '1000',
      'lower_bound': '1',
      'search_filters': [{
        'name':     'email',
        'value':    'steve@steveovens.com',
        'operator': 'is'
      }],
      'search_columns': [{
        'name': 'email'
      }]
  };
*/
  HTTP.call('POST', url, {
    headers: {"Authorization": "NLAuth nlauth_account=4131425,nlauth_email=andrew@webmogul.com.au,nlauth_signature=HEm#926as,nlauth_role=26"},
    data: request_list
  }, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log(response); // from initialize
      console.log(response.data); // from load
//      console.log(response.data.result[0].result); // from insert
      console.log(response.data.result.length);
      if (response.data.result.length) console.log(response.data.result[0].id);
      /*
       This will return the HTTP response object that looks something like this:
       {
       content: "String of content...",
       data: {
       "id": 101,
       "title": "Title of our new post",
       "body": "Body of our new post",
       "userId": 1337
       },
       headers: {  Object containing HTTP response headers }
       statusCode: 201
       }
       */
    }
  });
};