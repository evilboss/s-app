/**
 * Created by gilbertor on 11/5/15.
 */
Meteor.methods({
  sendThankYouEmail: function (doc) {
    // Make this an asynch method - client does not need to wait for email to send
    this.unblock();

    doc.absUrl = Meteor.absoluteUrl();
    doc.logo = Meteor.settings.public.contact.logo;

    if (typeof(doc.logo) == 'undefined') doc.logo = doc.absUrl + 'logo.png';

    html = Spacebars.toHTML(doc, Assets.getText('emailTemplate.html'));
    text = Spacebars.toHTML(doc, Assets.getText('emailTextTemplate.txt'));
    Email.send({
      to: doc.email,
      from: Meteor.settings.public.contact.from,
      subject: Meteor.settings.public.contact.subject,
      text: text,
      html: html
    });
  }
});
