Websites = new Mongo.Collection("websites");

// collections/comments.js

Comments = new Mongo.Collection('comments');

///easy search
WebpagesIndex = new EasySearch.Index({
  collection: Websites,
  fields: ['title', 'description'],
  engine: new EasySearch.Minimongo({
  	sort: function () {
      return { upscore: -1 };
    }
  })
});



// set up security on Websites
Websites.allow({

	// we need to be able to update votes.
	update:function(userId, doc){
		console.log("testing security on image update");
		if (Meteor.user()){// they are logged in
			return true;
		} else {// user not logged in - do not let them update votes. 
			return false;
		}
	},

	insert:function(userId, doc){
		console.log("testing security on image insert");
		if (Meteor.user()){// they are logged in
			if (userId != doc.createdBy){// the user is messing about
				return false;
			}
			else {// the user is logged in, it has the correct user id
				return true;
			}
		}
		else {// user not logged in
			return false;
		}
	}
})

// set up security on Comments
Comments.allow({

	insert:function(userId, doc){
		console.log("testing security on image insert");
		if (Meteor.user()){// they are logged in
			if (userId != doc.createdBy){// the user is messing about
				return false;
			}
			else {// the user is logged in, it has the correct user id
				return true;
			}
		}
		else {// user not logged in
			return false;
		}
	}
})