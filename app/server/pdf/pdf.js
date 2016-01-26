/**
 * Created by gilbertor on 10/29/15.
 */
Meteor.startup(function () {

});

function createSamplePDF() { // Move out of startup per code review - this is just sample code - not used!!
  var doc = new PDFDocument({size: 'A4', margin: 0});
  var imageDir = process.env.PWD + '/public/assets/report/';

  /*page 1*/
  doc.fontSize(12)
    //TODO: EXAMPLE OF Loading Images
    .image(imageDir + 'logo.png', 100, 100)
    .moveDown()
    .fillColor('#042D58')
    .fontSize(20)
    .text('POWER COST SAVING EXPERTS!!', 20, 300, {align: 'center'})
    .moveDown()
    /*TODO @ralphe: add propeties before text.syntax daisychain pages*/
    .fillColor('#000000')
    .fontSize(20)
    .text('Your customised solar report', {align: 'center'});

  //Footer
  doc.image(imageDir + 'logo.png', 50, 770, {width: 75, height: 30})
    .fillColor('#042D58')
    .fontSize(10)
    .text("POWER COST SAVING EXPERTS", 123, 780)
    .fillColor('#000000')
    .fontSize(7)
    .text("Report:#1234567", 500, 780);
  //footer end

  /*page 1 end*/
  /*page 2*/

  doc.addPage({margin: 50})
    .fillColor('#7F7F7F')
    .font('Times-Roman', 13)
    .text('Join The Australian Solar Revolution', {
      align: 'center',
      indent: 1,
      ellipsis: true,
    })
    .fillColor('#00000')
    .text('Now is the right time to go solar!', {
      align: 'center',
      indent: 1,
      ellipsis: true
    })
    .moveDown()
    .image(imageDir + 'page2-img1.png', {width: 500, height: 130})
    .image(imageDir + 'page2-img2.png', {width: 500, height: 100})
    .moveDown()
    .image(imageDir + 'page2-img3.png',
      {
        width: 100,
        height: 100,
      })
    .fontSize(28)
    .text('Over 50% of households', 250, 340)

    .fontSize(16)
    .text('…expected to have solar plus battery systems by 2025', 300, 380)
  doc.moveDown()

    .fontSize(20)
    .text('Solar Power Increases The Value Of Your Home', 50, 450, {
      align: 'center'
    })
    .fontSize(16)
    .moveDown()
    .text('78% of survey respondents believe solar adds $10k value to your home. Solar plus battery adds an estimated $30k to the value of your home.')

    .moveDown()
    .image(imageDir + 'page2-img4.png', 150, 550, {width: 280, height: 100})
    .moveDown()
//Footer
  doc.image(imageDir + 'logo.png', 50, 720, {width: 75, height: 30})
    .fillColor('#042D58')
    .fontSize(10)
    .text("POWER COST SAVING EXPERTS", 130, 730)
    .fillColor('#000000')
    .fontSize(7)
    .text("Report:#1234567", 500, 730);
  //footer end
  /*page 2 end*/
  /*page 3*/
  doc.addPage({margin: 50})
    .fillColor('#7F7F7F')
    .font('Times-Roman', 20)
    .text('Your Solar System - Indicative Proposa')
    .fillColor('#00000')
    .font('Times-Roman', 20)
    .text('How much solar power can your roof generate?', {align: 'center'})

  //Footer
  doc.image(imageDir + 'logo.png', 50, 720, {width: 75, height: 30})
    .fillColor('#042D58')
    .fontSize(10)
    .text("POWER COST SAVING EXPERTS", 130, 730)
    .fillColor('#000000')
    .fontSize(7)
    .text("Report:#1234567", 500, 730);
  //footer end
  /*page 3 end*/

  doc.write(process.env.PWD + '/public/report.pdf');
}