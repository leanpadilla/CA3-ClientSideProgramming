function doGet(e) {

    var htmlOutput =  HtmlService.createTemplateFromFile('PageLogin');
    htmlOutput.message = '';
    return htmlOutput.evaluate();
  }
  
  function doPost(e) {
    
    Logger.log(JSON.stringify(e));
    
    if(e.parameter.LoginButton == 'Login')
    {    
      var username = e.parameter.username;
      var password = e.parameter.password;
    
      var checkanswer = checkLogin(username, password);
    
      if(checkanswer == 'TRUE')
      {
        var htmlOutput =  HtmlService.createTemplateFromFile('PageForm');
        htmlOutput.username = username.toUpperCase();
        htmlOutput.message = '';
        return htmlOutput.evaluate();   
      }
      else
      {
        var htmlOutput =  HtmlService.createTemplateFromFile('PageLogin');
        htmlOutput.message = 'Failed to Login';
        return htmlOutput.evaluate();     

    }   
}
else if(e.parameter.AddButton == 'Add')
{
  var username = e.parameter.username;
  
  var checkanswer = checkLogin(username, password);
  
  if(checkanswer == 'TRUE')
  {
    AddRecord(e.parameter.firstname, e.parameter.lastname, e.parameter.address, e.parameter.city, e.parameter.state, e.parameter.zip)
    var htmlOutput =  HtmlService.createTemplateFromFile('PageForm');
    htmlOutput.username = username.toUpperCase();
    htmlOutput.message = 'Record Added';
    return htmlOutput.evaluate();   
  }
  else
  {
    var htmlOutput =  HtmlService.createTemplateFromFile('PageLogin');
    htmlOutput.message = 'Failed to Login';
    return htmlOutput.evaluate();     
  }
  
}
else if(e.parameter.LogoutButton == 'Logout')
{
  LogOutUserNow(e.parameter.username);
  var htmlOutput =  HtmlService.createTemplateFromFile('PageLogin');
  htmlOutput.message = 'Logged Out';

  return htmlOutput.evaluate(); 
}

}

function AddRecord(firstname, lastname, address, city, state, zip) {
var url = '';  //URL OF GOOGLE SHEET;
var ss= SpreadsheetApp.openByUrl(url);
var dataSheet = ss.getSheetByName("DATA");
dataSheet.appendRow([firstname, lastname, address, city, state, zip, new Date()]);
}

function getUrl() {
var url = ScriptApp.getService().getUrl();
return url;
}

function checkLogin(username, password) {
var url = '';  //URL OF GOOGLE SHEET;
var ss= SpreadsheetApp.openByUrl(url);

var usernamesheet = ss.getSheetByName("USERNAMES");
var currentsheet = ss.getSheetByName("CURRENTLOGGEDIN");
var usernameLastRow =  usernamesheet.getLastRow();
var currentLastRow =  currentsheet.getLastRow();
var found_record = '';

for(var y = 2; y <= currentLastRow; y++)
{
  if(currentsheet.getRange(y, 1).getValue().toUpperCase() == username.toUpperCase())

  {
    found_record = 'TRUE';
    var d = new Date();
    currentsheet.getRange(y, 2).setValue(d);
   }      
 }
 
 if(found_record == '')
 {
   for(var i = 2; i <= usernameLastRow; i++)
   {
     if(usernamesheet.getRange(i, 1).getValue().toUpperCase() == username.toUpperCase() && 
       usernamesheet.getRange(i, 2).getValue().toUpperCase() == password.toUpperCase())
       {
         found_record = 'TRUE';
         currentsheet.appendRow([username.toUpperCase(), new Date()]);
       }    
   }
 }  
  
 if(found_record == '')
 {
   found_record = 'FALSE'; 
 }
 
 return found_record; 
}

function LogOutUserNow(username)
{

    var url = '';  //URL OF GOOGLE SHEET;
    var ss= SpreadsheetApp.openByUrl(url);
    
    var currentsheet = ss.getSheetByName("CURRENTLOGGEDIN")
    var currentLastRow =  currentsheet.getLastRow();
    
    for(var y = 2; y <= currentLastRow; y++)
    {
      if(currentsheet.getRange(y, 1).getValue() == username.toUpperCase())
      {
       currentsheet.getRange(y, 3).setValue('X');
      }      
    }
    
    for(var y = 2; y <= currentLastRow; y++)
    {
      if(currentsheet.getRange(y, 3).getValue() == 'X')
      {
       currentsheet.deleteRow(y);
      }      
    }
  
  }
  
  function LogOutUser()
  {
    var url = '';  //URL OF GOOGLE SHEET;
    var ss= SpreadsheetApp.openByUrl(url);
    
    var currentsheet = ss.getSheetByName("CURRENTLOGGEDIN")
    var currentLastRow =  currentsheet.getLastRow();

    var ThirtyMinutesAgo = new Date( Date.now() - 30000 * 60 );
  
    for(var y = 2; y <= currentLastRow; y++)
    {
      if(currentsheet.getRange(y, 2).getValue() < ThirtyMinutesAgo)
      {
       currentsheet.getRange(y, 3).setValue('X');
      }      
    }
    
    for(var y = 2; y <= currentLastRow; y++)
    {
      if(currentsheet.getRange(y, 3).getValue() == 'X')
      {
       currentsheet.deleteRow(y);
      }      
    }
  }
  
  
