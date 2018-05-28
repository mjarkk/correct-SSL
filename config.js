module.exports = {
  
  // web servertype
  // default = autocheck that will check it for you
  // options: autocheck, apache, nginx
  webServer: 'autocheck',

  // Delay between checks in hours
  // Max 24 hours
  checkDelay: 4,

  // checkDomains:
  // only the domain name NOT the "/" and "https"
  checkDomains: [
    'example.com',
    'www.example.com'
  ],

  // what to do if the server is not valid place here whatever you want
  // don't forget to add "&&" if you want to exsecute more commands
  // %%domain%% will be replaced with the domain name
  fixCommand: `
    certbot certonly --standalone -d %%domain%%
  `

}