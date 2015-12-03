	/// routing 
	Router.configure({
  		layoutTemplate: 'ApplicationLayout'
	});
	Router.route('/', function () {
  		this.render('navbar', {
    to:"navbar"
  	});
	  this.render('main', {
	    to:"main"
	  });
	});

	Router.route('/website/:_id', function () {
  	this.render('navbar', {
    to:"navbar"
  	});
  		this.render('website', {
    	to:"main", 
    	data:function(){
      return Websites.findOne({_id:this.params._id});
    }
  	});
	});

	Accounts.ui.config({
		passwordSignupFields: "USERNAME_AND_EMAIL"
	});

	/////
	// template helpers 
	/////
	Template.website_header.helpers({username:function(){
		if (Meteor.user()){
 		 return Meteor.user().username;
    
	}
	else {
	  return "anonymous internet user / LogIn to submit webpages, vote and comment";
	}
	}
	});

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({}, {sort:{upscore: -1, createdOn:-1}});
		}
	});

	Template.comments_list.helpers({
		comments:function(){
			var website_id = Session.get("websiteid");
			return Comments.find({website_id:website_id}, {sort:{createdOn:1}});
		}
	});
	/// Convert user_id to User 
	Template.comment_item.helpers({
		getUser:function(user_id){
		  var user = Meteor.users.findOne({_id:user_id});
		  if (user){
		    return user.username;
		  }
		  else {
		    return "anonymous";
		  }
		}
	});


	/////
	// template events 
	/////
	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Up voting website with id "+website_id);
			// put the code in here to add a vote to a website!
			if (Meteor.user()){
			Websites.update(website_id, {$inc: {upscore: 1} });
			}
			return false;// prevent the button from reloading the page
		}, 
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Down voting website with id "+website_id);

			// put the code in here to remove a vote from a website!
			if (Meteor.user()){
				Websites.update(website_id, {$inc: {downscore: 1} });
			}

			return false;// prevent the button from reloading the page
		},
		"click .js-moreDetails":function(event){

			var website_id = this._id;
			console.log("Link to website page");

			// put the code in here to remove a vote from a website!
			Session.set("websiteid", website_id);

			//return false;// prevent the button from reloading the page
		}
	})


	Template.website.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Up voting website with id "+website_id);
			// put the code in here to add a vote to a website!
			if (Meteor.user()){
			Websites.update(website_id, {$inc: {upscore: 1} });
			}
			return false;// prevent the button from reloading the page
		}, 
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Down voting website with id "+website_id);

			// put the code in here to remove a vote from a website!
			if (Meteor.user()){
				Websites.update(website_id, {$inc: {downscore: 1} });
			}

			return false;// prevent the button from reloading the page
		}
	})

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		}, 
		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:
			var url = event.target.url.value;
			var title = event.target.title.value;
			var description = event.target.description.value;
			console.log("url: "+url+ "   title"+title+"   description"+description);

			//  put your website saving code in here!
			if (Meteor.user()){
			 Websites.insert({
	    		title:title, 
	    		url:url, 
	    		description:description, 
	    		createdOn:new Date(),
	    		createdBy:Meteor.user()._id	    		
    		});
    		$(".success-add").html("Success!");	
    		$('.js-save-website-form').closest('form').find("input[type=text]").val("");
			}			
			return false;// stop the form submit from reloading the page

		}
	});

	/// Comments

Template.commentSubmit.events({
	'submit form':function(event){
		var body = event.target.body.value;
		var website_id = Session.get("websiteid");
		if (Meteor.user()){
			 Comments.insert({
	    		body:body,
	    		website_id:website_id,	
	    		createdOn:new Date(),
	    		createdBy:Meteor.user()._id
    			});	
			 $(".js-logincommnets").html("comment added successfully");
			 $(".js-logincommnets").css("color","green");
			 $('#comment-form').closest('form').find("input[type=text], textarea").val("");
			}
			else {
				$(".js-logincommnets").html("Please, LogIn to submit comments");
				$(".js-logincommnets").css("color","red");
				$('#comment-form').closest('form').find("input[type=text], textarea").val("");
			}

		return false;
		
	}

});


/////
Template.searchBox.helpers({
  WebpagesIndex: () => WebpagesIndex
});



