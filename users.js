$.ajax({
    url: 'https://randomuser.me/api/?results=5',
    dataType: 'json',
    success: function(data) {
      console.log(data);
    }
  });

  