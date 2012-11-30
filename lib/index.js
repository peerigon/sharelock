"use strict"; // run code in ES5 strict mode

var Crypto = require("./cryptojs/aes.js"),
    $ = require("../components/jquery/jquery.js");

window.sharelock = {
    addBodyEvents: addBodyEvents,
    encryptMessage: encryptMessage,
    decryptMessage: decryptMessage
};

addBodyEvents();

function encryptMessage(msg) {
    try {
        return Crypto.AES.encrypt(msg, "Super secure password").toString();
    } catch(err) {
        return null;
    }
}

function decryptMessage(encryptedMsg) {
    try {
        return Crypto.AES.decrypt(encryptedMsg, "Super secure password").toString(Crypto.enc.Utf8);
    } catch (err) {
        return null;
    }
}

function decryptTextArea(textArea) {
    var encryptedMsg;

    console.log("decrypt textarea");
    encryptedMsg = textArea.value;
    if (encryptedMsg) {
        textArea.value = decryptMessage(encryptedMsg);
    }
}

function decryptElement(element) {
    var encryptedMsg,
        msg;

    console.log("decrypt span");
    encryptedMsg = element.innerText;
    msg = decryptMessage(encryptedMsg);
    if (msg) {
        element.innerText = msg;
    }
}

function encryptTextArea(textArea) {
    var msg,
        input;

    console.log("encrypt textarea");
    msg = textArea.value;
    if (msg) {
        textArea.value = encryptMessage(textArea.value);
        input = getInputElementFromTextArea(textArea);
        if (input) {
            input.value = textArea.value;
        }
    }
}


function addBodyEvents() {
    document.body.addEventListener("mouseout", function onMouseOut(e) {
        var fromElement = e.fromElement || e.relatedTarget,
            toElement = e.toElement || e.relatedTarget;

        if (fromElement && fromElement.tagName === "TEXTAREA") {
            encryptTextArea(fromElement);
        } else if (toElement && toElement.tagName === "TEXTAREA") {
            decryptTextArea(toElement);
        } else if(toElement) {
            decryptElement(toElement);
        }
    });
}

function getInputElementFromTextArea(element) {
    var $element = $(element),
        name = $element.attr("name"),
        parentForm = $(element).parents("form");

    if (parentForm.length === 1) {
        return parentForm.find("input[name='" + name.replace(/_text$/, "") + "']")[0];
    }

    return null;
}

