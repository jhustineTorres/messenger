var chatList = document.getElementById('userList');
var databaseRef = firebase.database().ref('users/');

var $userList=$("#accountList");
console.log(databaseRef);
      
databaseRef.once('value', function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    var childData = childSnapshot.val();
    $userList.append('<li><input type="radio" class="userList" name="users" value="'+childSnapshot.key+'">'+childData.name+'</li>')
    
  })
});
//////////////////////////////////////
$("body").on("click",".userList",function(){
  var value=$(this).val();
  $(".chatList").empty();
  var databaseRef = firebase.database().ref('chat').child(value).once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();
      console.log(childSnapshot)
      $(".chatList").append('<li><input type="radio" class="chatListitem"  name="users" value="'+childSnapshot.val()+'">'+childData+'</li>')
      
    })
  });;
})
///////////////////////////////////////////
var conversationid;
   
$("body").on("click",".chatListitem",function(){
  $(".messagess").empty();
  conversationid=$(this).val();
  firebase.database().ref('messages').child(conversationid).once('value', function(snapshot) {
    console.log(snapshot.key,snapshot.val())
  });;
      
  firebase.database().ref('messages').child(conversationid).child('conversation').on('child_added', function (data) {
    var type;
    if(data.val().user_id == user_id){
      type="sent";
    }
    else{
      type="replies";
    }
    $('<li class="'+type+'"><p>' + data.val().message + '</p></li>').appendTo($('.messages ul'));
    $('.message-input input').val(null);
    $('.contact.active .preview').html('<span>You: </span>' + data.val().message);
    $(".messages").animate({ scrollTop: $(".messages")[0].scrollHeight }, 0);
    });
  function writeUserData(message) {
       
    var db_ref = firebase.database().ref('messages').child(conversationid).child('conversation');
    db_ref.push({
      user_id: user_id,
      message: message
    });
  }
  $('.submit').click(function() {
    newMessage();
  });

  function newMessage() {
    message = $(".message-input input").val();
    if($.trim(message) == '') {
      return false;
    }
    writeUserData(message);
  };

  $('.messageBox').on('keydown', function(e) {
    console.log(e);
    if (e.which == 13) {
      newMessage();
      return false;
    } 
  });
})
///////////////////////////////////
$('.saveNewContact').click(function() {
  save_user();
});

function save_user(){
  var user_name = document.getElementById('user_name').value;
  firebase.database().ref().child('users').push({name: user_name});
  firebase.database().ref().child('chat').child().push({0:"Team Chat"});
}