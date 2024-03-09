const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const inlineCss = require('inline-css');
require('dotenv').config();

const app = express();
var port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

app.post('/sendEmail', async (req, res) => {
  const { email, orderData , subject } = req.body;

  try {
    const htmlContent =  `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
        <meta name="x-apple-disable-message-reformatting"> <!-- Disable auto-scale in iOS 10 Mail entirely -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <style>
            *{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%;
            }
            body{
                width: 100%;
                height: auto;
                overflow-x: hidden !important;
                background-color: #f1f1f1;
            }
            .email-container{
                background-color: white;
                padding: 15px;
                overflow: hidden !important;
            }
            .header{
                padding: 10px;
            }
            .header a.logo{
                width: 250px;
                display: flex;
            }
            .header .logo img{
                width: 100%;
            }
            
            #product{
                display: flex;
                align-items: center;
                gap:  30px;
            }
            table{
                overflow: auto !important;
            }
            .email-footer{
                padding: 1.5em;
                border-top: 1px solid rgba(0,0,0,.05);
                color: rgba(0,0,0,.5);
                background: #f7fafa;
            }
            .email-footer .heading{
                color: #000;
                font-size: 20px;
            }
            .email-footer ul{
                margin: 0;
                padding: 0;
            }
            .email-footer ul li{
                list-style: none;
                margin-bottom: 10px;
            }
            .email-footer ul li a{
                color: rgba(0,0,0,1);
            }
            
            @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
                div .email-container {
                    min-width: 320px !important;
                }
            }
            
            @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
                div .email-container {
                    min-width: 375px !important;
                }
            }
            
            @media only screen and (min-device-width: 414px) {
                div .email-container {
                    min-width: 414px !important;
                }
            }
                    </style>
    </head>
    <body>
     
        <div style="max-width: 900px; margin: 0 auto;" class="email-container">
            <div class="row">
                <div class="col-12">
                    <div class="header">
                        <a href="#" class="logo">
                            <img src="https://ichosendroppoint.com/static/media/CDP_green.8e056bc2306d56329cbc.png" alt="">
                        </a>
                        <div class="text mt-5" style="padding: 1em;">
                            <h3 class="mb-3">${orderData.customer.Fullname}, your order is ${orderData.status}!</h3>
                            <p style="font-size: 22px;">Check your order summary to confirm.</p> 
                            <h5 class="text-muted">Order ID: ${orderData.invoice.OrderID}</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                            <tr>
                                <th>Items</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                            </tr>
                            </thead>
                            <tbody>
                            ${orderData.items.map(item =>
                              `
                            <tr>
                           <td id="product">
                                  <span>${item.name}</span>
                                </td>
                                <td valign="middle">${item.quantity}</td>

                                <td valign="middle">₱${item.TotalPrice}</td>
                            </tr>
                            `)
                          }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div> 
    
            <div class="row">
                <div class="col-12 col-md-6">
                    <h5></h5>
                    <div class="table-responsive" style="padding: 1.5em;">
                      <table class="table">
                        <tr>
                          <th>Subtotal:</th>
                          <td>₱${orderData.invoice.AmountDue.Subtotal}</td>
                        </tr>
                        <tr>
                          <th>Shipping:</th>
                          <td>₱${orderData.invoice.AmountDue.Shipping}</td>
                        </tr>
                        <tr>
                          <th>Total:</th>
                          <td><strong>₱${orderData.invoice.AmountDue.Total}</strong></td>
                        </tr>
                      </table>
                    </div>
                </div>
            </div>
    
            <div class="row email-footer">
                <div class="col-12 col-lg-6">
                    <h3 class="heading">Contact Info</h3>
                    <ul>
                        <li><span class="text">Unit B-02 Lower 2nd Floor St. Francis Square Building Julia Vargas Avenue cor. Bank Drive Ortigas Center Mandaluyong City.</span></li>
                        <li><a href=""><span class="text">iamchoseninternational@gmail.com</span></a></li>
                        <li><span class="text">(02) – 7006-8924</span></a></li>
                    </ul>
                </div>
                <div class="col-12 col-lg-6">
                    <h3 class="heading">Useful Links</h3>
                    <ul>
                        <li><a href="https://ichosendroppoint.com/">Home</a></li>
                        <li><a href="https://ichosendroppoint.com/about">About Us</a></li>
                        <li><a href="https://ichosendroppoint.com/products">Products</a></li>
                    </ul>
                </div>
            </div>
        </div>
            
    </body>
    </html>
    `
    const inlineCssOptions = {
        url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',  
      };
      const inlineHtml = await inlineCss(htmlContent, inlineCssOptions);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'iamchosendroppoint@gmail.com',
        pass: 'yueh qywn hkwo kjmp',
      },
    });

    const mailOptions = {
      from: 'iamchosendroppoint@gmail.com',
      to: email,
      subject: subject,
      html:inlineHtml,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/sendEmailPackage', async (req, res) => {
  const { email,products, orderData , subject } = req.body;

  try {
    const htmlContent =  `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
        <meta name="x-apple-disable-message-reformatting"> <!-- Disable auto-scale in iOS 10 Mail entirely -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <style>
            *{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%;
            }
            body{
                width: 100%;
                height: auto;
                overflow-x: hidden !important;
                background-color: #f1f1f1;
            }
            .email-container{
                background-color: white;
                padding: 15px;
                overflow: hidden !important;
            }
            .header{
                padding: 10px;
            }
            .header a.logo{
                width: 250px;
                display: flex;
            }
            .header .logo img{
                width: 100%;
            }
            
            #product{
                display: flex;
                align-items: center;
                gap:  30px;
            }
            table{
                overflow: auto !important;
            }
            .email-footer{
                padding: 1.5em;
                border-top: 1px solid rgba(0,0,0,.05);
                color: rgba(0,0,0,.5);
                background: #f7fafa;
            }
            .email-footer .heading{
                color: #000;
                font-size: 20px;
            }
            .email-footer ul{
                margin: 0;
                padding: 0;
            }
            .email-footer ul li{
                list-style: none;
                margin-bottom: 10px;
            }
            .email-footer ul li a{
                color: rgba(0,0,0,1);
            }
            
            @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
                div .email-container {
                    min-width: 320px !important;
                }
            }
            
            @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
                div .email-container {
                    min-width: 375px !important;
                }
            }
            
            @media only screen and (min-device-width: 414px) {
                div .email-container {
                    min-width: 414px !important;
                }
            }
                    </style>
    </head>
    <body>
     
        <div style="max-width: 900px; margin: 0 auto;" class="email-container">
            <div class="row">
                <div class="col-12">
                    <div class="header">
                        <a href="#" class="logo">
                            <img src="https://ichosendroppoint.com/static/media/CDP_green.8e056bc2306d56329cbc.png" alt="">
                        </a>
                        <div class="text mt-5" style="padding: 1em;">
                            <h3 class="mb-3">${orderData.customer.Fullname}, your order is ${orderData.status}!</h3>
                            <p style="font-size: 22px;">Check your order summary to confirm.</p> 
                            <h5 class="text-muted">Order ID: ${orderData.invoice.OrderID}</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="table-responsive">
                      <h3 class="mb-3">Package: ${orderData.package}</h3>
                        <table class="table table-striped">
                            <thead>
                            <tr>
                                <th>Items</th>
                                <th>Quantity</th>
                            </tr>
                            </thead>
                            <tbody>
                            ${products.map(item =>
                              `
                            <tr>
                           <td id="product">
                                  <span>${item.name}</span>
                                </td>
                                <td valign="middle">${item.quantity}</td>
                            </tr>
                            `)
                          }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div> 
    
            <div class="row">
                <div class="col-12 col-md-6">
                    <h5></h5>
                    <div class="table-responsive" style="padding: 1.5em;">
                      <table class="table">
                        <tr>
                          <th>Subtotal:</th>
                          <td>₱${orderData.invoice.AmountDue.Subtotal}</td>
                        </tr>
                        <tr>
                          <th>Shipping:</th>
                          <td>₱${orderData.invoice.AmountDue.Shipping}</td>
                        </tr>
                        <tr>
                          <th>Total:</th>
                          <td><strong>₱${orderData.invoice.AmountDue.Total}</strong></td>
                        </tr>
                      </table>
                    </div>
                </div>
            </div>
    
            <div class="row email-footer">
                <div class="col-12 col-lg-6">
                    <h3 class="heading">Contact Info</h3>
                    <ul>
                        <li><span class="text">Unit B-02 Lower 2nd Floor St. Francis Square Building Julia Vargas Avenue cor. Bank Drive Ortigas Center Mandaluyong City.</span></li>
                        <li><a href=""><span class="text">iamchoseninternational@gmail.com</span></a></li>
                        <li><span class="text">(02) – 7006-8924</span></a></li>
                    </ul>
                </div>
                <div class="col-12 col-lg-6">
                    <h3 class="heading">Useful Links</h3>
                    <ul>
                        <li><a href="https://ichosendroppoint.com/">Home</a></li>
                        <li><a href="https://ichosendroppoint.com/about">About Us</a></li>
                        <li><a href="https://ichosendroppoint.com/products">Products</a></li>
                    </ul>
                </div>
            </div>
        </div>
            
    </body>
    </html>
    `
    const inlineCssOptions = {
        url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',  
      };
      const inlineHtml = await inlineCss(htmlContent, inlineCssOptions);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'iamchosendroppoint@gmail.com',
        pass: 'yueh qywn hkwo kjmp',
      },
    });

    const mailOptions = {
      from: 'iamchosendroppoint@gmail.com',
      to: email,
      subject: subject,
      html:inlineHtml,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/approve', async (req, res) => {
  const { email, selectedOrder , subject } = req.body;

  try {
    const htmlContent =  `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
        <meta name="x-apple-disable-message-reformatting"> <!-- Disable auto-scale in iOS 10 Mail entirely -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <style>
            *{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%;
            }
            body{
                width: 100%;
                height: auto;
                overflow-x: hidden !important;
                background-color: #f1f1f1;
            }
            .email-container{
                background-color: white;
                padding: 15px;
                overflow: hidden !important;
            }
            .header{
                padding: 10px;
            }
            .header a.logo{
                width: 250px;
                display: flex;
            }
            .header .logo img{
                width: 100%;
            }
            
            #product{
                display: flex;
                align-items: center;
                gap:  30px;
            }
            table{
                overflow: auto !important;
            }
            .email-footer{
                padding: 1.5em;
                border-top: 1px solid rgba(0,0,0,.05);
                color: rgba(0,0,0,.5);
                background: #f7fafa;
            }
            .email-footer .heading{
                color: #000;
                font-size: 20px;
            }
            .email-footer ul{
                margin: 0;
                padding: 0;
            }
            .email-footer ul li{
                list-style: none;
                margin-bottom: 10px;
            }
            .email-footer ul li a{
                color: rgba(0,0,0,1);
            }
            
            @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
                div .email-container {
                    min-width: 320px !important;
                }
            }
            
            @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
                div .email-container {
                    min-width: 375px !important;
                }
            }
            
            @media only screen and (min-device-width: 414px) {
                div .email-container {
                    min-width: 414px !important;
                }
            }
                    </style>
    </head>
    <body>
     
        <div style="max-width: 900px; margin: 0 auto;" class="email-container">
            <div class="row">
                <div class="col-12">
                    <div class="header">
                        <a href="#" class="logo">
                            <img src="https://ichosendroppoint.com/static/media/CDP_green.8e056bc2306d56329cbc.png" alt="">
                        </a>
                        <div class="text mt-5" style="padding: 1em;">
                            <h3 class="mb-3">${selectedOrder.buyerName}, your order is APPROVED!</h3>
                            <h5 class="text-muted">Order ID: ${selectedOrder.orderID}</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12" >
                    YOUR ORDER HAS BEEN APPROVED!
                </div>
            </div> 
            <div class="row email-footer">
                <div class="col-12 col-lg-6">
                    <h3 class="heading">Contact Info</h3>
                    <ul>
                        <li><span class="text">Unit B-02 Lower 2nd Floor St. Francis Square Building Julia Vargas Avenue cor. Bank Drive Ortigas Center Mandaluyong City.</span></li>
                        <li><a href=""><span class="text">iamchoseninternational@gmail.com</span></a></li>
                        <li><span class="text">(02) – 7006-8924</span></a></li>
                    </ul>
                </div>
                <div class="col-12 col-lg-6">
                    <h3 class="heading">Useful Links</h3>
                    <ul>
                        <li><a href="https://ichosendroppoint.com/">Home</a></li>
                        <li><a href="https://ichosendroppoint.com/about">About Us</a></li>
                        <li><a href="https://ichosendroppoint.com/products">Products</a></li>
                    </ul>
                </div>
            </div>
        </div>
            
    </body>
    </html>
    `
    const inlineCssOptions = {
        url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',  
      };
      const inlineHtml = await inlineCss(htmlContent, inlineCssOptions);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'iamchosendroppoint@gmail.com',
        pass: 'yueh qywn hkwo kjmp',
      },
    });

    const mailOptions = {
      from: 'iamchosendroppoint@gmail.com',
      to: email,
      subject: subject,
      html:inlineHtml,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/decline', async (req, res) => {
  const { email, record , subject } = req.body;

  try {
    const htmlContent =  `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
        <meta name="x-apple-disable-message-reformatting"> <!-- Disable auto-scale in iOS 10 Mail entirely -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <style>
            *{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%;
            }
            body{
                width: 100%;
                height: auto;
                overflow-x: hidden !important;
                background-color: #f1f1f1;
            }
            .email-container{
                background-color: white;
                padding: 15px;
                overflow: hidden !important;
            }
            .header{
                padding: 10px;
            }
            .header a.logo{
                width: 250px;
                display: flex;
            }
            .header .logo img{
                width: 100%;
            }
            
            #product{
                display: flex;
                align-items: center;
                gap:  30px;
            }
            table{
                overflow: auto !important;
            }
            .email-footer{
                padding: 1.5em;
                border-top: 1px solid rgba(0,0,0,.05);
                color: rgba(0,0,0,.5);
                background: #f7fafa;
            }
            .email-footer .heading{
                color: #000;
                font-size: 20px;
            }
            .email-footer ul{
                margin: 0;
                padding: 0;
            }
            .email-footer ul li{
                list-style: none;
                margin-bottom: 10px;
            }
            .email-footer ul li a{
                color: rgba(0,0,0,1);
            }
            
            @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
                div .email-container {
                    min-width: 320px !important;
                }
            }
            
            @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
                div .email-container {
                    min-width: 375px !important;
                }
            }
            
            @media only screen and (min-device-width: 414px) {
                div .email-container {
                    min-width: 414px !important;
                }
            }
                    </style>
    </head>
    <body>
     
        <div style="max-width: 900px; margin: 0 auto;" class="email-container">
            <div class="row">
                <div class="col-12">
                    <div class="header">
                        <a href="#" class="logo">
                            <img src="https://ichosendroppoint.com/static/media/CDP_green.8e056bc2306d56329cbc.png" alt="">
                        </a>
                        <div class="text mt-5" style="padding: 1em;">
                            <h3 class="mb-3">${record.buyerName}, your order is DECLINED!</h3>
                            <h5 class="text-muted">Order ID: ${record.orderID}</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12" >
                    YOUR ORDER HAS BEEN DECLINED!
                </div>
            </div> 
            <div class="row email-footer">
                <div class="col-12 col-lg-6">
                    <h3 class="heading">Contact Info</h3>
                    <ul>
                        <li><span class="text">Unit B-02 Lower 2nd Floor St. Francis Square Building Julia Vargas Avenue cor. Bank Drive Ortigas Center Mandaluyong City.</span></li>
                        <li><a href=""><span class="text">iamchoseninternational@gmail.com</span></a></li>
                        <li><span class="text">(02) – 7006-8924</span></a></li>
                    </ul>
                </div>
                <div class="col-12 col-lg-6">
                    <h3 class="heading">Useful Links</h3>
                    <ul>
                        <li><a href="https://ichosendroppoint.com/">Home</a></li>
                        <li><a href="https://ichosendroppoint.com/about">About Us</a></li>
                        <li><a href="https://ichosendroppoint.com/products">Products</a></li>
                    </ul>
                </div>
            </div>
        </div>
            
    </body>
    </html>
    `
    const inlineCssOptions = {
        url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',  
      };
      const inlineHtml = await inlineCss(htmlContent, inlineCssOptions);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'iamchosendroppoint@gmail.com',
        pass: 'yueh qywn hkwo kjmp',
      },
    });

    const mailOptions = {
      from: 'iamchosendroppoint@gmail.com',
      to: email,
      subject: subject,
      html:inlineHtml,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/return', async (req, res) => {
  const { email, selectedOrder , subject } = req.body;

  try {
    const htmlContent =  `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
        <meta name="x-apple-disable-message-reformatting"> <!-- Disable auto-scale in iOS 10 Mail entirely -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <style>
            *{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%;
            }
            body{
                width: 100%;
                height: auto;
                overflow-x: hidden !important;
                background-color: #f1f1f1;
            }
            .email-container{
                background-color: white;
                padding: 15px;
                overflow: hidden !important;
            }
            .header{
                padding: 10px;
            }
            .header a.logo{
                width: 250px;
                display: flex;
            }
            .header .logo img{
                width: 100%;
            }
            
            #product{
                display: flex;
                align-items: center;
                gap:  30px;
            }
            table{
                overflow: auto !important;
            }
            .email-footer{
                padding: 1.5em;
                border-top: 1px solid rgba(0,0,0,.05);
                color: rgba(0,0,0,.5);
                background: #f7fafa;
            }
            .email-footer .heading{
                color: #000;
                font-size: 20px;
            }
            .email-footer ul{
                margin: 0;
                padding: 0;
            }
            .email-footer ul li{
                list-style: none;
                margin-bottom: 10px;
            }
            .email-footer ul li a{
                color: rgba(0,0,0,1);
            }
            
            @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
                div .email-container {
                    min-width: 320px !important;
                }
            }
            
            @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
                div .email-container {
                    min-width: 375px !important;
                }
            }
            
            @media only screen and (min-device-width: 414px) {
                div .email-container {
                    min-width: 414px !important;
                }
            }
                    </style>
    </head>
    <body>
     
        <div style="max-width: 900px; margin: 0 auto;" class="email-container">
            <div class="row">
                <div class="col-12">
                    <div class="header">
                        <a href="#" class="logo">
                            <img src="https://ichosendroppoint.com/static/media/CDP_green.8e056bc2306d56329cbc.png" alt="">
                        </a>
                        <div class="text mt-5" style="padding: 1em;">
                            <h3 class="mb-3">${selectedOrder.buyerName},</h3>
                            <h5 class="text-muted">Order ID: ${selectedOrder.orderID} has been RETURNED</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12" >
                    YOUR ORDER HAS BEEN RETURNED!
                </div>
            </div> 
            <div class="row email-footer">
                <div class="col-12 col-lg-6">
                    <h3 class="heading">Contact Info</h3>
                    <ul>
                        <li><span class="text">Unit B-02 Lower 2nd Floor St. Francis Square Building Julia Vargas Avenue cor. Bank Drive Ortigas Center Mandaluyong City.</span></li>
                        <li><a href=""><span class="text">iamchoseninternational@gmail.com</span></a></li>
                        <li><span class="text">(02) – 7006-8924</span></a></li>
                    </ul>
                </div>
                <div class="col-12 col-lg-6">
                    <h3 class="heading">Useful Links</h3>
                    <ul>
                        <li><a href="https://ichosendroppoint.com/">Home</a></li>
                        <li><a href="https://ichosendroppoint.com/about">About Us</a></li>
                        <li><a href="https://ichosendroppoint.com/products">Products</a></li>
                    </ul>
                </div>
            </div>
        </div>
            
    </body>
    </html>
    `
    const inlineCssOptions = {
        url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',  
      };
      const inlineHtml = await inlineCss(htmlContent, inlineCssOptions);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'iamchosendroppoint@gmail.com',
        pass: 'yueh qywn hkwo kjmp',
      },
    });

    const mailOptions = {
      from: 'iamchosendroppoint@gmail.com',
      to: email,
      subject: subject,
      html:inlineHtml,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/cancelled', async (req, res) => {
  const { email, selectedOrder , subject } = req.body;

  try {
    const htmlContent =  `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
        <meta name="x-apple-disable-message-reformatting"> <!-- Disable auto-scale in iOS 10 Mail entirely -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <style>
            *{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%;
            }
            body{
                width: 100%;
                height: auto;
                overflow-x: hidden !important;
                background-color: #f1f1f1;
            }
            .email-container{
                background-color: white;
                padding: 15px;
                overflow: hidden !important;
            }
            .header{
                padding: 10px;
            }
            .header a.logo{
                width: 250px;
                display: flex;
            }
            .header .logo img{
                width: 100%;
            }
            
            #product{
                display: flex;
                align-items: center;
                gap:  30px;
            }
            table{
                overflow: auto !important;
            }
            .email-footer{
                padding: 1.5em;
                border-top: 1px solid rgba(0,0,0,.05);
                color: rgba(0,0,0,.5);
                background: #f7fafa;
            }
            .email-footer .heading{
                color: #000;
                font-size: 20px;
            }
            .email-footer ul{
                margin: 0;
                padding: 0;
            }
            .email-footer ul li{
                list-style: none;
                margin-bottom: 10px;
            }
            .email-footer ul li a{
                color: rgba(0,0,0,1);
            }
            
            @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
                div .email-container {
                    min-width: 320px !important;
                }
            }
            
            @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
                div .email-container {
                    min-width: 375px !important;
                }
            }
            
            @media only screen and (min-device-width: 414px) {
                div .email-container {
                    min-width: 414px !important;
                }
            }
                    </style>
    </head>
    <body>
     
        <div style="max-width: 900px; margin: 0 auto;" class="email-container">
            <div class="row">
                <div class="col-12">
                    <div class="header">
                        <a href="#" class="logo">
                            <img src="https://ichosendroppoint.com/static/media/CDP_green.8e056bc2306d56329cbc.png" alt="">
                        </a>
                        <div class="text mt-5" style="padding: 1em;">
                            <h3 class="mb-3">${selectedOrder.buyerName},</h3>
                            <h5 class="text-muted">Order ID: ${selectedOrder.orderID} has been CANCELLED</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12" >
                    YOUR ORDER HAS BEEN CANCELLED!
                </div>
            </div> 
            <div class="row email-footer">
                <div class="col-12 col-lg-6">
                    <h3 class="heading">Contact Info</h3>
                    <ul>
                        <li><span class="text">Unit B-02 Lower 2nd Floor St. Francis Square Building Julia Vargas Avenue cor. Bank Drive Ortigas Center Mandaluyong City.</span></li>
                        <li><a href=""><span class="text">iamchoseninternational@gmail.com</span></a></li>
                        <li><span class="text">(02) – 7006-8924</span></a></li>
                    </ul>
                </div>
                <div class="col-12 col-lg-6">
                    <h3 class="heading">Useful Links</h3>
                    <ul>
                        <li><a href="https://ichosendroppoint.com/">Home</a></li>
                        <li><a href="https://ichosendroppoint.com/about">About Us</a></li>
                        <li><a href="https://ichosendroppoint.com/products">Products</a></li>
                    </ul>
                </div>
            </div>
        </div>
            
    </body>
    </html>
    `
    const inlineCssOptions = {
        url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',  
      };
      const inlineHtml = await inlineCss(htmlContent, inlineCssOptions);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'iamchosendroppoint@gmail.com',
        pass: 'yueh qywn hkwo kjmp',
      },
    });

    const mailOptions = {
      from: 'iamchosendroppoint@gmail.com',
      to: email,
      subject: subject,
      html:inlineHtml,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/complete', async (req, res) => {
  const { email, selectedOrder , subject } = req.body;

  try {
    const htmlContent =  `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
        <meta name="x-apple-disable-message-reformatting"> <!-- Disable auto-scale in iOS 10 Mail entirely -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <style>
            *{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%;
            }
            body{
                width: 100%;
                height: auto;
                overflow-x: hidden !important;
                background-color: #f1f1f1;
            }
            .email-container{
                background-color: white;
                padding: 15px;
                overflow: hidden !important;
            }
            .header{
                padding: 10px;
            }
            .header a.logo{
                width: 250px;
                display: flex;
            }
            .header .logo img{
                width: 100%;
            }
            
            #product{
                display: flex;
                align-items: center;
                gap:  30px;
            }
            table{
                overflow: auto !important;
            }
            .email-footer{
                padding: 1.5em;
                border-top: 1px solid rgba(0,0,0,.05);
                color: rgba(0,0,0,.5);
                background: #f7fafa;
            }
            .email-footer .heading{
                color: #000;
                font-size: 20px;
            }
            .email-footer ul{
                margin: 0;
                padding: 0;
            }
            .email-footer ul li{
                list-style: none;
                margin-bottom: 10px;
            }
            .email-footer ul li a{
                color: rgba(0,0,0,1);
            }
            
            @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
                div .email-container {
                    min-width: 320px !important;
                }
            }
            
            @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
                div .email-container {
                    min-width: 375px !important;
                }
            }
            
            @media only screen and (min-device-width: 414px) {
                div .email-container {
                    min-width: 414px !important;
                }
            }
                    </style>
    </head>
    <body>
     
        <div style="max-width: 900px; margin: 0 auto;" class="email-container">
            <div class="row">
                <div class="col-12">
                    <div class="header">
                        <a href="#" class="logo">
                            <img src="https://ichosendroppoint.com/static/media/CDP_green.8e056bc2306d56329cbc.png" alt="">
                        </a>
                        <div class="text mt-5" style="padding: 1em;">
                            <h3 class="mb-3">Thank you for your order,${selectedOrder.buyerName}!</h3>
                            <h5 class="text-muted">Order ID: ${selectedOrder.orderID} has been COMPLETED</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    YOUR ORDER HAS BEEN COMPLETED!
                </div>
            </div> 
            <div class="row email-footer">
                <div class="col-12 col-lg-6">
                    <h3 class="heading">Contact Info</h3>
                    <ul>
                        <li><span class="text">Unit B-02 Lower 2nd Floor St. Francis Square Building Julia Vargas Avenue cor. Bank Drive Ortigas Center Mandaluyong City.</span></li>
                        <li><a href=""><span class="text">iamchoseninternational@gmail.com</span></a></li>
                        <li><span class="text">(02) – 7006-8924</span></a></li>
                    </ul>
                </div>
                <div class="col-12 col-lg-6">
                    <h3 class="heading">Useful Links</h3>
                    <ul>
                        <li><a href="https://ichosendroppoint.com/">Home</a></li>
                        <li><a href="https://ichosendroppoint.com/about">About Us</a></li>
                        <li><a href="https://ichosendroppoint.com/products">Products</a></li>
                    </ul>
                </div>
            </div>
        </div>
            
    </body>
    </html>
    `
    const inlineCssOptions = {
        url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',  
      };
      const inlineHtml = await inlineCss(htmlContent, inlineCssOptions);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'iamchosendroppoint@gmail.com',
        pass: 'yueh qywn hkwo kjmp',
      },
    });

    const mailOptions = {
      from: 'iamchosendroppoint@gmail.com',
      to: email,
      subject: subject,
      html:inlineHtml,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/register', async (req, res) => {
  const { email, addForm , subject } = req.body;

  try {
    const htmlContent =  `<!doctype html>
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <style media="all" type="text/css">
        
        body {
          font-family: Helvetica, sans-serif;
          -webkit-font-smoothing: antialiased;
          font-size: 16px;
          line-height: 1.3;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
        }
        
        table {
          border-collapse: separate;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          width: 100%;
        }
        
        table td {
          font-family: Helvetica, sans-serif;
          font-size: 16px;
          vertical-align: top;
        }
        
        body {
          background-color: #f4f5f6;
          margin: 0;
          padding: 0;
        }
        
        .body {
          background-color: #f4f5f6;
          width: 100%;
        }
        
        .container {
          margin: 0 auto !important;
          max-width: 600px;
          padding: 0;
          padding-top: 24px;
          width: 600px;
        }
        
        .content {
          box-sizing: border-box;
          display: block;
          margin: 0 auto;
          max-width: 600px;
          padding: 0;
        }
        
        .main {
          background: #ffffff;
          border: 1px solid #eaebed;
          border-radius: 16px;
          width: 100%;
        }
        
        .wrapper {
          box-sizing: border-box;
          padding: 24px;
        }
        
        .footer {
          clear: both;
          padding-top: 24px;
          text-align: center;
          width: 100%;
        }
        
        .footer td,
        .footer p,
        .footer span,
        .footer a {
          color: #9a9ea6;
          font-size: 16px;
          text-align: center;
        }
        
        p {
          font-family: Helvetica, sans-serif;
          font-size: 16px;
          font-weight: normal;
          margin: 0;
          margin-bottom: 16px;
        }
        
        a {
          color: #0867ec;
          text-decoration: underline;
        }
        
        .btn {
          box-sizing: border-box;
          min-width: 100% !important;
          width: 100%;
        }
        
        .btn > tbody > tr > td {
          padding-bottom: 16px;
        }
        
        .btn table {
          width: auto;
        }
        
        .btn table td {
          background-color: #ffffff;
          border-radius: 4px;
          text-align: center;
        }
        
        .last {
          margin-bottom: 0;
        }
        
        .first {
          margin-top: 0;
        }
        
        .align-center {
          text-align: center;
        }
        
        .align-right {
          text-align: right;
        }
        
        .align-left {
          text-align: left;
        }
        
        .text-link {
          color: #0867ec !important;
          text-decoration: underline !important;
        }
        
        .clear {
          clear: both;
        }
        
        .mt0 {
          margin-top: 0;
        }
        
        .mb0 {
          margin-bottom: 0;
        }
        
        .preheader {
          color: transparent;
          display: none;
          height: 0;
          max-height: 0;
          max-width: 0;
          opacity: 0;
          overflow: hidden;
          mso-hide: all;
          visibility: hidden;
          width: 0;
        }
        
        .powered-by a {
          text-decoration: none;
        }
        
        @media only screen and (max-width: 640px) {
          .main p,
          .main td,
          .main span {
            font-size: 16px !important;
          }
          .wrapper {
            padding: 8px !important;
          }
          .content {
            padding: 0 !important;
          }
          .container {
            padding: 0 !important;
            padding-top: 8px !important;
            width: 100% !important;
          }
          .main {
            border-left-width: 0 !important;
            border-radius: 0 !important;
            border-right-width: 0 !important;
          }
          .btn table {
            max-width: 100% !important;
            width: 100% !important;
          }
          .btn a {
            font-size: 16px !important;
            max-width: 100% !important;
            width: 100% !important;
          }
        }
        
        @media all {
          .ExternalClass {
            width: 100%;
          }
          .ExternalClass,
          .ExternalClass p,
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td,
          .ExternalClass div {
            line-height: 100%;
          }
          .apple-link a {
            color: inherit !important;
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            text-decoration: none !important;
          }
          #MessageViewBody a {
            color: inherit;
            text-decoration: none;
            font-size: inherit;
            font-family: inherit;
            font-weight: inherit;
            line-height: inherit;
          }
        }
        .logo-holder{
          padding: 15px;
        }
        </style>
      </head>
      <body>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
          <tr>
            <td>&nbsp;</td>
            <td class="container">
              <div class="content">
    
                <!-- START CENTERED WHITE CONTAINER -->
                <span class="preheader">This is preheader text. Some clients will show this text as a preview.</span>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="main">
    
                  <!-- START MAIN CONTENT AREA -->
                  <tr>
                    <td class="logo-holder">
                      <img src="https://ichosendroppoint.com/static/media/CDP_green.8e056bc2306d56329cbc.png" alt="" width="256" />
                    </td>
                  </tr>
                  <tr>
                    <td class="wrapper">
                      <p>Hi ${addForm.firstname},</p>
                      <p>
                        Welcome to Chosen Drop Point. Your account has been created successfully. Kindly await APPROVAL for your account</p><br/>
                       <p>Your  Account Details are as follows : </p>
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                        <tbody>
                          <tr>
                            <td>First Name: </td>
                            <td>${addForm.firstname}</td>
                          </tr>
                          <tr>
                            <td>Middle Name: </td>
                            <td>${addForm.middlename}</td>
                          </tr>
                          <tr>
                            <td>Last Name: </td>
                            <td>${addForm.lastname}</td>
                          </tr>
                          <tr>
                            <td>Email Address: </td>
                            <td>${addForm.email}</td>
                          </tr>
                        </tbody>
                      </table>
                      <br/><br/>
                      <p>We are happy to work with you. Please feel free to contact us if you have any questions or need assistance!</p>
                      <p>Thank you!</p>
                    </td>
                  </tr>
    
                  <!-- END MAIN CONTENT AREA -->
                  </table>
    
                <!-- START FOOTER -->
                <div class="footer">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td class="content-block">
                        <span class="apple-link">Unit B-02 Lower 2nd Floor St. Francis Square Building Julia Vargas Avenue cor. Bank Drive Ortigas Center Mandaluyong City.</span>
                        <br><br/> Do you have questions? <br/>
                        Email us @ 
                        <a href="https://https://ichosendroppoint.com/contact%20Us" target="_blank">iamchoseninternational@gmail.com</a> <br>(02) – 7006-8924
                      </td>
                    </tr>
                  </table>
                </div>
    
                <!-- END FOOTER -->
                
    <!-- END CENTERED WHITE CONTAINER --></div>
            </td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </body>
    </html>
    `

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'iamchosendroppoint@gmail.com',
        pass: 'yueh qywn hkwo kjmp',
      },
    });

    const mailOptions = {
      from: 'iamchosendroppoint@gmail.com',
      to: email,
      subject: subject,
      html:htmlContent,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/userapprove', async (req, res) => {
  const { email, newFormData , subject } = req.body;

  try {
    const htmlContent =  `<!doctype html>
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <style media="all" type="text/css">
        
        body {
          font-family: Helvetica, sans-serif;
          -webkit-font-smoothing: antialiased;
          font-size: 16px;
          line-height: 1.3;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
        }
        
        table {
          border-collapse: separate;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          width: 100%;
        }
        
        table td {
          font-family: Helvetica, sans-serif;
          font-size: 16px;
          vertical-align: top;
        }
        
        body {
          background-color: #f4f5f6;
          margin: 0;
          padding: 0;
        }
        
        .body {
          background-color: #f4f5f6;
          width: 100%;
        }
        
        .container {
          margin: 0 auto !important;
          max-width: 600px;
          padding: 0;
          padding-top: 24px;
          width: 600px;
        }
        
        .content {
          box-sizing: border-box;
          display: block;
          margin: 0 auto;
          max-width: 600px;
          padding: 0;
        }
        
        .main {
          background: #ffffff;
          border: 1px solid #eaebed;
          border-radius: 16px;
          width: 100%;
        }
        
        .wrapper {
          box-sizing: border-box;
          padding: 24px;
        }
        
        .footer {
          clear: both;
          padding-top: 24px;
          text-align: center;
          width: 100%;
        }
        
        .footer td,
        .footer p,
        .footer span,
        .footer a {
          color: #9a9ea6;
          font-size: 16px;
          text-align: center;
        }
        
        p {
          font-family: Helvetica, sans-serif;
          font-size: 16px;
          font-weight: normal;
          margin: 0;
          margin-bottom: 16px;
        }
        
        a {
          color: #0867ec;
          text-decoration: underline;
        }
        
        .btn {
          box-sizing: border-box;
          min-width: 100% !important;
          width: 100%;
        }
        
        .btn > tbody > tr > td {
          padding-bottom: 16px;
        }
        
        .btn table {
          width: auto;
        }
        
        .btn table td {
          background-color: #ffffff;
          border-radius: 4px;
          text-align: center;
        }
        
        .btn a {
          background-color: #ffffff;
          border: solid 2px #0867ec;
          border-radius: 4px;
          box-sizing: border-box;
          color: #0867ec;
          cursor: pointer;
          display: inline-block;
          font-size: 16px;
          font-weight: bold;
          margin: 0;
          padding: 12px 24px;
          text-decoration: none;
          text-transform: capitalize;
        }
        
        .btn-primary table td {
          background-color: #0867ec;
        }
        
        .btn-primary a {
          background-color: #0867ec;
          border-color: #0867ec;
          color: #ffffff;
        }
        
        @media all {
          .btn-primary table td:hover {
            background-color: #08ec67 !important;
          }
          .btn-primary a:hover {
            background-color: #08ec67 !important;
            border-color: #1b9403 !important;
          }
        }
        
        .last {
          margin-bottom: 0;
        }
        
        .first {
          margin-top: 0;
        }
        
        .align-center {
          text-align: center;
        }
        
        .align-right {
          text-align: right;
        }
        
        .align-left {
          text-align: left;
        }
        
        .text-link {
          color: #0867ec !important;
          text-decoration: underline !important;
        }
        
        .clear {
          clear: both;
        }
        
        .mt0 {
          margin-top: 0;
        }
        
        .mb0 {
          margin-bottom: 0;
        }
        
        .preheader {
          color: transparent;
          display: none;
          height: 0;
          max-height: 0;
          max-width: 0;
          opacity: 0;
          overflow: hidden;
          mso-hide: all;
          visibility: hidden;
          width: 0;
        }
        
        .powered-by a {
          text-decoration: none;
        }
        
        @media only screen and (max-width: 640px) {
          .main p,
          .main td,
          .main span {
            font-size: 16px !important;
          }
          .wrapper {
            padding: 8px !important;
          }
          .content {
            padding: 0 !important;
          }
          .container {
            padding: 0 !important;
            padding-top: 8px !important;
            width: 100% !important;
          }
          .main {
            border-left-width: 0 !important;
            border-radius: 0 !important;
            border-right-width: 0 !important;
          }
          .btn table {
            max-width: 100% !important;
            width: 100% !important;
          }
          .btn a {
            font-size: 16px !important;
            max-width: 100% !important;
            width: 100% !important;
          }
        }
        
        @media all {
          .ExternalClass {
            width: 100%;
          }
          .ExternalClass,
          .ExternalClass p,
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td,
          .ExternalClass div {
            line-height: 100%;
          }
          .apple-link a {
            color: inherit !important;
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            text-decoration: none !important;
          }
          #MessageViewBody a {
            color: inherit;
            text-decoration: none;
            font-size: inherit;
            font-family: inherit;
            font-weight: inherit;
            line-height: inherit;
          }
        }
        .logo-holder{
          padding: 15px;
        }
        </style>
      </head>
      <body>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
          <tr>
            <td>&nbsp;</td>
            <td class="container">
              <div class="content">
    
                <!-- START CENTERED WHITE CONTAINER -->
                <span class="preheader">This is preheader text. Some clients will show this text as a preview.</span>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="main">
    
                   <!-- START MAIN CONTENT AREA -->
                   <tr>
                    <td class="logo-holder">
                    <img src="https://ichosendroppoint.com/static/media/CDP_green.8e056bc2306d56329cbc.png" alt="" width="256" />
                    </td>
                  </tr>
                  <tr>
                    <td class="wrapper">
                      <p>Hi ${newFormData.firstname},</p>
                      <p>Welcome to Chosen Drop Point,</p>
                      <p>
                        Congratulations! Your account has been successfully processed for approval, and you can now proceed to log in.</p>
                        <p>You have Free 1 Month Subcription!</p><br/>
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                        <tbody>
                          <tr>
                            <td align="left">
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                <tbody>
                                  
                                  <tr>
                                    <td> <a href="https://ichosendroppoint.com/login" target="_blank">LOG IN HERE</a> </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
    
                  <!-- END MAIN CONTENT AREA -->
                  </table>
    
                <!-- START FOOTER -->
                <div class="footer">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td class="content-block">
                        <span class="apple-link">Unit B-02 Lower 2nd Floor St. Francis Square Building Julia Vargas Avenue cor. Bank Drive Ortigas Center Mandaluyong City.</span>
                        <br><br/> Do you have questions? <br/>
                        Email us @ 
                        <a href="https://https://ichosendroppoint.com/contact%20Us" target="_blank">iamchoseninternational@gmail.com</a> <br>(02) – 7006-8924
                      </td>
                    </tr>
                  </table>
                </div>
    
                <!-- END FOOTER -->
                
    <!-- END CENTERED WHITE CONTAINER --></div>
            </td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </body>
    </html>
    `;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'iamchosendroppoint@gmail.com',
        pass: 'yueh qywn hkwo kjmp',
      },
    });

    const mailOptions = {
      from: 'iamchosendroppoint@gmail.com',
      to: email,
      subject: subject,
      html:htmlContent,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});
app.post('/cashbondReq', async (req, res) => {
  const { email, cashBondData , subject } = req.body;

  try {
    const htmlContent =  `
    <!doctype html>
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <style media="all" type="text/css">
        
        body {
          font-family: Helvetica, sans-serif;
          -webkit-font-smoothing: antialiased;
          font-size: 16px;
          line-height: 1.3;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
        }
        
        table {
          border-collapse: separate;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          width: 100%;
        }
        
        table td {
          font-family: Helvetica, sans-serif;
          font-size: 16px;
          vertical-align: top;
        }
        
        body {
          background-color: #f4f5f6;
          margin: 0;
          padding: 0;
        }
        
        .body {
          background-color: #f4f5f6;
          width: 100%;
        }
        
        .container {
          margin: 0 auto !important;
          max-width: 600px;
          padding: 0;
          padding-top: 24px;
          width: 600px;
        }
        
        .content {
          box-sizing: border-box;
          display: block;
          margin: 0 auto;
          max-width: 600px;
          padding: 0;
        }
        
        .main {
          background: #ffffff;
          border: 1px solid #eaebed;
          border-radius: 16px;
          width: 100%;
        }
        
        .wrapper {
          box-sizing: border-box;
          padding: 24px;
        }
        
        .footer {
          clear: both;
          padding-top: 24px;
          text-align: center;
          width: 100%;
        }
        
        .footer td,
        .footer p,
        .footer span,
        .footer a {
          color: #9a9ea6;
          font-size: 16px;
          text-align: center;
        }
        
        p {
          font-family: Helvetica, sans-serif;
          font-size: 16px;
          font-weight: normal;
          margin: 0;
          margin-bottom: 16px;
        }
        
        .btn {
          box-sizing: border-box;
          min-width: 100% !important;
          width: 100%;
        }
        
        .btn > tbody > tr > td {
          padding-bottom: 16px;
        }
        
        .btn table {
          width: auto;
        }
        
        .btn table td {
          background-color: #ffffff;
          border-radius: 4px;
          text-align: center;
        }
    
        .last {
          margin-bottom: 0;
        }
        
        .first {
          margin-top: 0;
        }
        
        .align-center {
          text-align: center;
        }
        
        .align-right {
          text-align: right;
        }
        
        .align-left {
          text-align: left;
        }
        
        .text-link {
          color: #0867ec !important;
          text-decoration: underline !important;
        }
        
        .clear {
          clear: both;
        }
        
        .mt0 {
          margin-top: 0;
        }
        
        .mb0 {
          margin-bottom: 0;
        }
        
        .preheader {
          color: transparent;
          display: none;
          height: 0;
          max-height: 0;
          max-width: 0;
          opacity: 0;
          overflow: hidden;
          mso-hide: all;
          visibility: hidden;
          width: 0;
        }
        
        .powered-by a {
          text-decoration: none;
        }
        p.text-info{
          margin-bottom: 2px;
        }
        
        @media only screen and (max-width: 640px) {
          .main p,
          .main td,
          .main span {
            font-size: 16px !important;
          }
          .wrapper {
            padding: 8px !important;
          }
          .content {
            padding: 0 !important;
          }
          .container {
            padding: 0 !important;
            padding-top: 8px !important;
            width: 100% !important;
          }
          .main {
            border-left-width: 0 !important;
            border-radius: 0 !important;
            border-right-width: 0 !important;
          }
          .btn table {
            max-width: 100% !important;
            width: 100% !important;
          }
          .btn a {
            font-size: 16px !important;
            max-width: 100% !important;
            width: 100% !important;
          }
        }
        
        @media all {
          .ExternalClass {
            width: 100%;
          }
          .ExternalClass,
          .ExternalClass p,
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td,
          .ExternalClass div {
            line-height: 100%;
          }
          .apple-link a {
            color: inherit !important;
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            text-decoration: none !important;
          }
          #MessageViewBody a {
            color: inherit;
            text-decoration: none;
            font-size: inherit;
            font-family: inherit;
            font-weight: inherit;
            line-height: inherit;
          }
        }
        .logo-holder{
          padding: 15px;
        }
        </style>
      </head>
      <body>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
          <tr>
            <td>&nbsp;</td>
            <td class="container">
              <div class="content">
    
                <!-- START CENTERED WHITE CONTAINER -->
                <span class="preheader">This is preheader text. Some clients will show this text as a preview.</span>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="main">
    
                  <!-- START MAIN CONTENT AREA -->
                  <tr>
                    <td class="logo-holder">
                      <img src="https://ichosendroppoint.com/static/media/CDP_green.8e056bc2306d56329cbc.png" alt="" width="256" />
                    </td>
                  </tr>
                  <tr>
                    <td class="wrapper">
                      <p>Hi ${cashBondData.sender},</p>
                      <p>
                        Your Cash-bond request has been sent. Kindly await approval for your request.</p><br/>
                       <p>Your Cash Bond Request Details are as follows : </p>
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tbody>
                          <tr>
                            <td>Date: </td>
                            <td>${cashBondData.date}</td>
                          </tr>
                          <tr>
                            <td>Amount: </td>
                            <td>${parseFloat(cashBondData.amount).toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td>Member Name: </td>
                            <td>${cashBondData.sender}</td>
                          </tr>
                          <tr>
                            <td>Phone Number: </td>
                            <td>${cashBondData.phone}</td>
                          </tr>
                        </tbody>
                      </table>
                      <br/><br/>
                      <p>Before the approval of your request, please sent us your proof of payment here.</p>
                      <p>Thank you!</p>
                      <br/>
                      <!-- Payment Instructions Section -->
                      <div style="border: 1px solid #eaebed; border-radius: 8px; padding: 16px; margin-top: 16px;">
                        <h4>Payment Options:</h4>
                        <p>
    
                        <!-- BDO Account -->
                        <p><strong>BDO Account:</strong></p>
                        <p class="text-info">Account Name: I AM CHOSEN INTERNATIONAL</p>
                        <p>Account Number: 006930154740</p>
    
                        <!-- BPI Account -->
                        <p><strong>BPI Account:</strong></p>
                        <p class="text-info">Account Name: I AM CHOSEN INTERNATIONAL</p>
                        <p>Account Number: 4229-2502-12</p>
    
                        <!-- GCASH Account -->
                        <p><strong>GCASH:</strong></p>
                        <p>GCASH Number: 09475047299</p>
                      </div>
                      <br/>
                      <p>Please ensure to include your unique transaction reference when making the payment. Once the payment is complete, kindly submit the proof of payment for a prompt review for approval of your Cash-bond request.</p>
                      <p>Thank you for your cooperation and trust in CHOSEN DROP POINT.</p>
                    </td>
                  </tr>
    
                  <!-- END MAIN CONTENT AREA -->
                  </table>
    
                <!-- START FOOTER -->
                <div class="footer">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td class="content-block">
                        <span class="apple-link">Unit B-02 Lower 2nd Floor St. Francis Square Building Julia Vargas Avenue cor. Bank Drive Ortigas Center Mandaluyong City.</span>
                        <br><br/> Do you have questions? <br/>
                        Email us @ 
                        <a href="https://https://ichosendroppoint.com/contact%20Us" target="_blank">iamchoseninternational@gmail.com</a> <br>(02) – 7006-8924
                      </td>
                    </tr>
                  </table>
                </div>
    
                <!-- END FOOTER -->
                
    <!-- END CENTERED WHITE CONTAINER --></div>
            </td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </body>
    </html>
    `;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'iamchosendroppoint@gmail.com',
        pass: 'yueh qywn hkwo kjmp',
      },
    });

    const mailOptions = {
      from: 'iamchosendroppoint@gmail.com',
      to: email,
      subject: subject,
      html:htmlContent,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/cashoutReq', async (req, res) => {
  const { email, RequestData , subject } = req.body;

  try {
    const htmlContent =  `<!doctype html>
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <style media="all" type="text/css">
        
        body {
          font-family: Helvetica, sans-serif;
          -webkit-font-smoothing: antialiased;
          font-size: 16px;
          line-height: 1.3;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
        }
        
        table {
          border-collapse: separate;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          width: 100%;
        }
        
        table td {
          font-family: Helvetica, sans-serif;
          font-size: 16px;
          vertical-align: top;
        }
        
        body {
          background-color: #f4f5f6;
          margin: 0;
          padding: 0;
        }
        
        .body {
          background-color: #f4f5f6;
          width: 100%;
        }
        
        .container {
          margin: 0 auto !important;
          max-width: 600px;
          padding: 0;
          padding-top: 24px;
          width: 600px;
        }
        
        .content {
          box-sizing: border-box;
          display: block;
          margin: 0 auto;
          max-width: 600px;
          padding: 0;
        }
        
        .main {
          background: #ffffff;
          border: 1px solid #eaebed;
          border-radius: 16px;
          width: 100%;
        }
        
        .wrapper {
          box-sizing: border-box;
          padding: 24px;
        }
        
        .footer {
          clear: both;
          padding-top: 24px;
          text-align: center;
          width: 100%;
        }
        
        .footer td,
        .footer p,
        .footer span,
        .footer a {
          color: #9a9ea6;
          font-size: 16px;
          text-align: center;
        }
        
        p {
          font-family: Helvetica, sans-serif;
          font-size: 16px;
          font-weight: normal;
          margin: 0;
          margin-bottom: 16px;
        }
        
        .btn {
          box-sizing: border-box;
          min-width: 100% !important;
          width: 100%;
        }
        
        .btn > tbody > tr > td {
          padding-bottom: 16px;
        }
        
        .btn table {
          width: auto;
        }
        
        .btn table td {
          background-color: #ffffff;
          border-radius: 4px;
          text-align: center;
        }
    
        .last {
          margin-bottom: 0;
        }
        
        .first {
          margin-top: 0;
        }
        
        .align-center {
          text-align: center;
        }
        
        .align-right {
          text-align: right;
        }
        
        .align-left {
          text-align: left;
        }
        
        .text-link {
          color: #0867ec !important;
          text-decoration: underline !important;
        }
        
        .clear {
          clear: both;
        }
        
        .mt0 {
          margin-top: 0;
        }
        
        .mb0 {
          margin-bottom: 0;
        }
        
        .preheader {
          color: transparent;
          display: none;
          height: 0;
          max-height: 0;
          max-width: 0;
          opacity: 0;
          overflow: hidden;
          mso-hide: all;
          visibility: hidden;
          width: 0;
        }
        
        .powered-by a {
          text-decoration: none;
        }
        
        @media only screen and (max-width: 640px) {
          .main p,
          .main td,
          .main span {
            font-size: 16px !important;
          }
          .wrapper {
            padding: 8px !important;
          }
          .content {
            padding: 0 !important;
          }
          .container {
            padding: 0 !important;
            padding-top: 8px !important;
            width: 100% !important;
          }
          .main {
            border-left-width: 0 !important;
            border-radius: 0 !important;
            border-right-width: 0 !important;
          }
          .btn table {
            max-width: 100% !important;
            width: 100% !important;
          }
          .btn a {
            font-size: 16px !important;
            max-width: 100% !important;
            width: 100% !important;
          }
        }
        
        @media all {
          .ExternalClass {
            width: 100%;
          }
          .ExternalClass,
          .ExternalClass p,
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td,
          .ExternalClass div {
            line-height: 100%;
          }
          .apple-link a {
            color: inherit !important;
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            text-decoration: none !important;
          }
          #MessageViewBody a {
            color: inherit;
            text-decoration: none;
            font-size: inherit;
            font-family: inherit;
            font-weight: inherit;
            line-height: inherit;
          }
        }
        .logo-holder{
          padding: 15px;
        }
        </style>
      </head>
      <body>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
          <tr>
            <td>&nbsp;</td>
            <td class="container">
              <div class="content">
    
                <!-- START CENTERED WHITE CONTAINER -->
                <span class="preheader">This is preheader text. Some clients will show this text as a preview.</span>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="main">
    
                  <!-- START MAIN CONTENT AREA -->
                  <tr>
                    <td class="logo-holder">
                      <img src="https://ichosendroppoint.com/static/media/CDP_green.8e056bc2306d56329cbc.png" alt="" width="256" />
                    </td>
                  </tr>
                  <tr>
                    <td class="wrapper">
                      <p>Hi ${RequestData.sender},</p>
                      <p>
                        Your Cashout Request has been sent. Kindly await approval for your request.</p><br/>
                       <p>Your Cashout Request Details are as follows : </p>
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tbody>
                          <tr>
                            <td>Amount: </td>
                            <td>${parseFloat(RequestData.amount).toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td>Account Name: </td>
                            <td>${RequestData.sender} </td>
                          </tr>
                          <tr>
                            <td>Method: </td>
                            <td>${RequestData.Method}</td>
                          </tr>
                          <tr>
                            <td>Additional Info: </td>
                            <td>${RequestData.additionalInfo}</td>
                          </tr>
                        </tbody>
                      </table>
                      <br/><br/>
                      <p>We are happy to work with you. Please feel free to contact us if you have any questions or need assistance!</p>
                      <p>Thank you!</p>
                    </td>
                  </tr>
    
                  <!-- END MAIN CONTENT AREA -->
                  </table>
    
                <!-- START FOOTER -->
                <div class="footer">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td class="content-block">
                        <span class="apple-link">Unit B-02 Lower 2nd Floor St. Francis Square Building Julia Vargas Avenue cor. Bank Drive Ortigas Center Mandaluyong City.</span>
                        <br><br/> Do you have questions? <br/>
                        Email us @ 
                        <a href="https://https://ichosendroppoint.com/contact%20Us" target="_blank">iamchoseninternational@gmail.com</a> <br>(02) – 7006-8924
                      </td>
                    </tr>
                  </table>
                </div>
    
                <!-- END FOOTER -->
                
    <!-- END CENTERED WHITE CONTAINER --></div>
            </td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </body>
    </html>
    `;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'iamchosendroppoint@gmail.com',
        pass: 'yueh qywn hkwo kjmp',
      },
    });

    const mailOptions = {
      from: 'iamchosendroppoint@gmail.com',
      to: email,
      subject: subject,
      html:htmlContent,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/subscribe', async (req, res) => {
  const { email, newFormData, renewalOption , subject } = req.body;
  const SubscriptionRange = () => {
    if(renewalOption == 1) {
      return renewalOption + 'month'
    }
    return renewalOption + 'months'
  }
  try {
    const htmlContent =  `<!doctype html>
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <style media="all" type="text/css">
        
        body {
          font-family: Helvetica, sans-serif;
          -webkit-font-smoothing: antialiased;
          font-size: 16px;
          line-height: 1.3;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
        }
        
        table {
          border-collapse: separate;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          width: 100%;
        }
        
        table td {
          font-family: Helvetica, sans-serif;
          font-size: 16px;
          vertical-align: top;
        }
        
        body {
          background-color: #f4f5f6;
          margin: 0;
          padding: 0;
        }
        
        .body {
          background-color: #f4f5f6;
          width: 100%;
        }
        
        .container {
          margin: 0 auto !important;
          max-width: 600px;
          padding: 0;
          padding-top: 24px;
          width: 600px;
        }
        
        .content {
          box-sizing: border-box;
          display: block;
          margin: 0 auto;
          max-width: 600px;
          padding: 0;
        }
        
        .main {
          background: #ffffff;
          border: 1px solid #eaebed;
          border-radius: 16px;
          width: 100%;
        }
        
        .wrapper {
          box-sizing: border-box;
          padding: 24px;
        }
        
        .footer {
          clear: both;
          padding-top: 24px;
          text-align: center;
          width: 100%;
        }
        
        .footer td,
        .footer p,
        .footer span,
        .footer a {
          color: #9a9ea6;
          font-size: 16px;
          text-align: center;
        }
        
        p {
          font-family: Helvetica, sans-serif;
          font-size: 16px;
          font-weight: normal;
          margin: 0;
          margin-bottom: 16px;
        }
        
        .btn {
          box-sizing: border-box;
          min-width: 100% !important;
          width: 100%;
        }
        
        .btn > tbody > tr > td {
          padding-bottom: 16px;
        }
        
        .btn table {
          width: auto;
        }
        
        .btn table td {
          background-color: #ffffff;
          border-radius: 4px;
          text-align: center;
        }
    
        .last {
          margin-bottom: 0;
        }
        
        .first {
          margin-top: 0;
        }
        
        .align-center {
          text-align: center;
        }
        
        .align-right {
          text-align: right;
        }
        
        .align-left {
          text-align: left;
        }
        
        .text-link {
          color: #0867ec !important;
          text-decoration: underline !important;
        }
        
        .clear {
          clear: both;
        }
        
        .mt0 {
          margin-top: 0;
        }
        
        .mb0 {
          margin-bottom: 0;
        }
        
        .preheader {
          color: transparent;
          display: none;
          height: 0;
          max-height: 0;
          max-width: 0;
          opacity: 0;
          overflow: hidden;
          mso-hide: all;
          visibility: hidden;
          width: 0;
        }
        
        .powered-by a {
          text-decoration: none;
        }
    
        .button{
          background: #0867ec;
          margin-left: 20px;
          margin-bottom: 20px;
          max-width: 150px;
          padding: 10px;
          text-align: center;
          cursor: pointer;
          border-radius: 5px;
          border: 1px solid #0551bd;
        }
        .button:hover{
          background: #05c225;
          border: 1px solid #05bd33;
        }
        .button a{
          text-decoration: none;
          color: #ffffff;
          text-align: center;
        }
        
        @media only screen and (max-width: 640px) {
          .main p,
          .main td,
          .main span {
            font-size: 16px !important;
          }
          .wrapper {
            padding: 8px !important;
          }
          .content {
            padding: 0 !important;
          }
          .container {
            padding: 0 !important;
            padding-top: 8px !important;
            width: 100% !important;
          }
          .main {
            border-left-width: 0 !important;
            border-radius: 0 !important;
            border-right-width: 0 !important;
          }
          .btn table {
            max-width: 100% !important;
            width: 100% !important;
          }
          .btn a {
            font-size: 16px !important;
            max-width: 100% !important;
            width: 100% !important;
          }
        }
        
        @media all {
          .ExternalClass {
            width: 100%;
          }
          .ExternalClass,
          .ExternalClass p,
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td,
          .ExternalClass div {
            line-height: 100%;
          }
          .apple-link a {
            color: inherit !important;
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            text-decoration: none !important;
          }
          #MessageViewBody a {
            color: inherit;
            text-decoration: none;
            font-size: inherit;
            font-family: inherit;
            font-weight: inherit;
            line-height: inherit;
          }
        }
        .logo-holder{
          padding: 15px;
        }
        </style>
      </head>
      <body>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
          <tr>
            <td>&nbsp;</td>
            <td class="container">
              <div class="content">
    
                <!-- START CENTERED WHITE CONTAINER -->
                <span class="preheader">This is preheader text. Some clients will show this text as a preview.</span>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="main">
    
                  <!-- START MAIN CONTENT AREA -->
                  <tr>
                    <td class="logo-holder">
                      <img src="https://ichosendroppoint.com/static/media/CDP_green.8e056bc2306d56329cbc.png" alt="" width="256" />
                    </td>
                  </tr>
                  <tr>
                    <td class="wrapper">
                      <p>Hi ${newFormData.firstname},</p>
                      <p>
                        Your Subcription has been registered for ${SubscriptionRange()}!</p><br/>
                       <p>Your Subscription Details are as follows : </p>
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tbody>
                          <tr>
                            <td>Account Name: </td>
                            <td>${newFormData.firstname} ${newFormData.middlename} ${newFormData.lastname} </td>
                          </tr>
                          <tr>
                            <td>Member ID: </td>
                            <td>${newFormData.IdNum} </td>
                          </tr>
                          <tr>
                            <td>Phone Number: </td>
                            <td>${newFormData.phone}</td>
                          </tr>
                          <tr>
                            <td>Subscription Registered: </td>
                            <td>${SubscriptionRange()}</td>
                          </tr>
                        </tbody>
                      </table>
                      <br/><br/>
                      <p>We are happy to work with you. You can now access our website.</p>
                      <p>Thank you!</p>
                    </td>
                  </tr>
                  <tr >
                    <td > 
                      <div class="button">
                        <a href="https://ichosendroppoint.com/login" target="_blank" >LOG IN HERE</a> 
                      </div>
                    </td>
                  </tr>
                  <!-- END MAIN CONTENT AREA -->
                  </table>
    
                <!-- START FOOTER -->
                <div class="footer">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td class="content-block">
                        <span class="apple-link">Unit B-02 Lower 2nd Floor St. Francis Square Building Julia Vargas Avenue cor. Bank Drive Ortigas Center Mandaluyong City.</span>
                        <br><br/> Do you have questions? <br/>
                        Email us @ 
                        <a href="https://https://ichosendroppoint.com/contact%20Us" target="_blank">iamchoseninternational@gmail.com</a> <br>(02) – 7006-8924
                      </td>
                    </tr>
                  </table>
                </div>
    
                <!-- END FOOTER -->
                
    <!-- END CENTERED WHITE CONTAINER --></div>
            </td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </body>
    </html>
    `;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'iamchosendroppoint@gmail.com',
        pass: 'yueh qywn hkwo kjmp',
      },
    });

    const mailOptions = {
      from: 'iamchosendroppoint@gmail.com',
      to: email,
      subject: subject,
      html:htmlContent,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
