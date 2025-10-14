const utilities = require("../utilities");
const messageModel = require("../models/message-model");

const messageController = {};

messageController.showBoard = async function(req, res) {
  let nav = await utilities.getNav();
  const messages = await messageModel.getAllMessages();
  res.render("messages/board", {
    title: "Message Board",
    nav,
    messages,
    flash: req.flash("notice")
  });
};

messageController.postMessage = async function(req, res) {
  let nav = await utilities.getNav();
  const { message_text } = req.body;
  const account_id = res.locals.accountData.account_id;
  if (!message_text || message_text.trim().length === 0) {
    req.flash("notice", "Message cannot be empty.");
    return res.redirect("/messages");
  }
  await messageModel.addMessage(account_id, message_text.trim());
  res.redirect("/messages");
};

module.exports = messageController;