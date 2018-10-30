fetch("https://developers.zomato.com/api/v2.1/reviews?res_id=16907963", {
      method: 'GET',
      headers: {
        'Accept':'application/json',
        'user-key': 'b603ad21353b8bb4f20d5e5b346df6dd'
      },
    })
    .then((res) => res.json())
    .then((resJSON) => {
      for(i=0;i<resJSON['user_reviews'].length;i++){
      console.log('Review' + (i+1) +':' + resJSON['user_reviews'][i]['review']['review_text'])
    }
    })
