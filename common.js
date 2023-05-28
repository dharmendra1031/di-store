const sg_mail = require('@sendgrid/mail');
require('dotenv/config');
const generateUniqueId = require('generate-unique-id');


sg_mail.setApiKey(process.env.SEND_GRID_APIKEY);


async function send_email(email, subject, message)
{
    return new Promise((resolve,reject)=>{
        const msg = {
            to: email, 
            from: process.env.SEND_GRID_EMAIL,
            subject: subject,
            text: 'Code Lab',
            html: message,
        }
        console.log(msg);
        sg_mail.send(msg)
        .then((data) => {
            console.log(data);
            resolve();
        })
        .catch((error) => {
            console.log(error);
            reject({
                status:500,
                message:"Server Error"
            });
            
        })  
    })
}


async function generate_name()
{
    return new Promise((resolve,rejecgt)=>{
        var temp = generateUniqueId({
            length: 15,
            useLetters: true,
            useNumbers:false
          })
        resolve(temp);
    });
}

module.exports = {
    send_email, generate_name
}