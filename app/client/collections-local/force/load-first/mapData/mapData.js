/**
 * Created by steveovens on 21/12/2015.
 */
MapData = new Mongo.Collection('mapdata', {connection: null});

// create a local persistence observer
var mapdataObserver = new LocalPersist(MapData, 'mapdata',
  {                                     // options are optional!
    maxDocuments: 99,                   // maximum number of line items in cart
    storageFull: function (col, doc) {  // function to handle maximum being exceeded
      col.remove({_id: doc._id});
      alert('Local storage is full.');
    }
  });
